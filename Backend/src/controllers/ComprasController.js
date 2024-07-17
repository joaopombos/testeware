const { v4: uuidv4 } = require('uuid');
const sequelize = require('../models/database');
const { fn, col } = require('sequelize'); 
const LicencasAtribuidas = require('../models/licencasatribuidas');
const SoftwaresAdquiridos = require('../models/softwaresadquiridos');
const TipoSoftwares = require('../models/tipossoftwares');
const Versoes = require('../models/versoes');
const Empresas = require('../models/empresas');
const { Op } = require('sequelize');


const shopController = {};


shopController.listCategoriesOrSoftwares = async (req, res) => {
    const { type, query } = req.query; 

    let whereCondition = {};
    if (query) {
        whereCondition.nome = { [Op.iLike]: `%${query}%` }; 
    }

    try {
        let items;
        if (type === 'softwares') {
            items = await TipoSoftwares.findAll({
                where: { ...whereCondition, idtipo: 1 } 
            });
        } else {
            items = await TipoSoftwares.findAll({
                where: { ...whereCondition, idtipo: 2 } 
            });
        }


        const itemsWithBase64 = items.map(item => {
            const jsonItem = item.toJSON();
            return {
                ...jsonItem,
                logotipo: jsonItem.logotipo ? Buffer.from(jsonItem.logotipo).toString('base64') : null,
                imagenssoftware: jsonItem.imagenssoftware ? Buffer.from(jsonItem.imagenssoftware).toString('base64') : null
            };
        });

        console.log('Items with Base64:', itemsWithBase64); 

        res.json(itemsWithBase64);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Error fetching items' });
    }
};

const stripe = require('stripe')('sk_test_51JbCVGJuN2xREvwFmnv3dGbp3DupvLh7JtPUcZNFAB8a1qKTeDcUk25PRIDn5UHin5n3OFhQkScUWawEUJVViJwi00JzYtVuUJ'); 




async function gerarChaveUnica() {
    let chaveUnica = null;
    let chaveExiste = true;

    while (chaveExiste) {
        chaveUnica = uuidv4().replace(/-/g, '').slice(0, 12);
        const chaveEncontrada = await SoftwaresAdquiridos.findOne({ where: { chaveproduto: chaveUnica } });
        if (!chaveEncontrada) {
            chaveExiste = false;
        }
    }

    return chaveUnica;
}



shopController.purchaseSuccess = async (req, res) => {
    try {
        const { idproduto, nome, versao, quantidade } = req.body;


        const emp_nif = req.cookies.emp_nif;
        if (!emp_nif) {
            return res.status(400).json({ error: 'NIF da empresa não fornecido nos cookies' });
        }

        const software = await TipoSoftwares.findByPk(idproduto);
        if (!software) {
            return res.status(404).json({ error: 'Software não encontrado' });
        }

        const empresa = await Empresas.findOne({ where: { nif: emp_nif } });
        if (!empresa) {
            return res.status(404).json({ error: 'Empresa não encontrada' });
        }


        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: software.nome,
                        },
                        unit_amount: software.precoproduto * 100, 
                    },
                    quantity: quantidade,
                },
            ],
            mode: 'payment',
            success_url: 'https://localhost:3001/shop/sucess',
            cancel_url: 'https://localhost:3001/shop/cancel',
        });


        const existingPurchase = await SoftwaresAdquiridos.findOne({
            where: {
                nome: nome,
                versaoadquirida: versao,
                nif: emp_nif
            }
        });

        let chaveProduto;
        if (existingPurchase) {
            chaveProduto = existingPurchase.chaveproduto;
        } else {
            chaveProduto = await gerarChaveUnica();
            await SoftwaresAdquiridos.create({
                nome,
                chaveproduto: chaveProduto,
                nif: emp_nif,
                versaoadquirida: versao
            });
        }


        const maxIdResult = await LicencasAtribuidas.findOne({
            attributes: [[sequelize.fn('max', sequelize.col('idatribuida')), 'maxId']]
        });
        const maxId = maxIdResult ? maxIdResult.get('maxId') || 0 : 0;

        let idCounter = maxId + 1;


        const licencasCriadas = await Promise.all(
            Array.from({ length: quantidade }).map(() => LicencasAtribuidas.create({
                chaveproduto: chaveProduto,
                nomepc: `PC do Cliente`,
                dataatri: new Date(),
                idatribuida: idCounter++
            }))
        );

        res.json({
            message: 'Compra realizada com sucesso',
            chaveProduto: chaveProduto,
            licencasCriadas: licencasCriadas,
            sessionId: session.id 
        });
    } catch (error) {
        console.error('Erro ao processar compra:', error.message);
        res.status(500).json({ error: 'Erro ao processar compra' });
    }
};









shopController.softwareDetails = async (req, res) => {
    const { idproduto } = req.params; 

    try {
        const software = await TipoSoftwares.findByPk(idproduto);

        if (!software) {
            return res.status(404).json({ error: 'Software not found' });
        }

        let logotipoBase64 = null;
        if (software.logotipo) {
            logotipoBase64 = Buffer.from(software.logotipo).toString('base64');
        }

        const softwareComBase64 = {
            ...software.toJSON(),
            logotipo: logotipoBase64
        };

        res.json(softwareComBase64);
    } catch (error) {
        console.error('Error retrieving software details:', error);
        res.status(500).json({ error: 'Error retrieving software details' });
    }
};





shopController.getVersionsByProductId = async (req, res) => {
    const { idproduto } = req.params;

    try {
        const versions = await Versoes.findAll({ where: { idproduto } });
        res.json(versions);
    } catch (error) {
        console.error('Error fetching versions:', error);
        res.status(500).json({ error: 'Error fetching versions' });
    }
};




module.exports = shopController;