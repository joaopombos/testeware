const TipoSoftwares = require('../models/tipossoftwares');
const Orcamentos = require('../models/orcamentos');
const Clientes = require('../models/clientes');
const SoftwaresAdquiridos = require('../models/softwaresadquiridos');
const LicencasAtribuidas = require('../models/licencasatribuidas');
const Empresas = require('../models/empresas');
const TipoUser = require('../models/tipouser');
const Versoes = require('../models/versoes');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');

const adminController = {};


adminController.listSoftwares = async (req, res) => {
    const { tipo, query } = req.query;

    let whereCondition = {};
    if (query) {
        whereCondition = {
            nome: {
                [Op.iLike]: `%${query}%`
            }
        };
    }

    try {
        let softwares;
        if (tipo === 'softwares') {
            softwares = await TipoSoftwares.findAll({ where: { ...whereCondition, idtipo: 1 } });
        } else {
            softwares = await TipoSoftwares.findAll({ where: { ...whereCondition, idtipo: 2 } }); 
        }


        const softwaresComBase64 = softwares.map(software => {
            const jsonSoftware = software.toJSON();
            return {
                ...jsonSoftware,
                logotipo: jsonSoftware.logotipo ? jsonSoftware.logotipo.toString('base64') : null, 
                imagenssoftware: jsonSoftware.imagenssoftware ? jsonSoftware.imagenssoftware.toString('base64') : null 
            };
        });

        console.log('Softwares com Base64:', softwaresComBase64); 

        res.json(softwaresComBase64);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching softwares' });
    }
};

adminController.getSoftwareById = async (req, res) => {
    const { idproduto } = req.params;

    try {
        const software = await TipoSoftwares.findByPk(idproduto);
        if (!software) {
            return res.status(404).json({ error: 'Software not found' });
        }
        res.json(software);
    } catch (error) {
        console.error('Erro ao buscar software:', error);
        res.status(500).json({ error: 'Error fetching software' });
    }
};


adminController.updateSoftware = async (req, res) => {
    const { idproduto } = req.params;
    const { nome, descricao, categoria, versao, precoproduto, logotipo, imagenssoftware, idtipo } = req.body;

    try {
        const software = await TipoSoftwares.findByPk(idproduto);
        if (!software) {
            return res.status(404).json({ error: 'Software not found' });
        }


        const versaoChanged = software.versao !== versao;

      
        const base64ToBuffer = (base64String) => {
            if (!base64String) return null;
            return Buffer.from(base64String.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        };

        const updateData = {
            nome,
            descricao,
            categoria,
            versao,
            precoproduto,
            idproduto,
            logotipo: base64ToBuffer(logotipo),
            imagenssoftware: base64ToBuffer(imagenssoftware),
            idtipo
        };

        await software.update(updateData);

    
        if (versaoChanged) {
            const novaVersao = await Versoes.create({
                versao: versao,
                datamodifi: new Date(),
                idproduto: idproduto
            });
            console.log('Versão adicionada:', novaVersao);
        }

        res.json(software);
    } catch (error) {
        console.error('Error updating software:', error);
        res.status(500).json({ error: 'Error updating software' });
    }
};



adminController.deleteSoftware = async (req, res) => {
    const { idproduto } = req.params;

    try {
        console.log(`Attempting to delete software with id: ${idproduto}`); // Logging

        const software = await TipoSoftwares.findByPk(idproduto);
        if (!software) {
            console.log(`Software not found with id: ${idproduto}`); // Logging
            return res.status(404).json({ error: 'Software not found' });
        }

        // Delete associated versions
        await Versoes.destroy({
            where: { idproduto }
        });

        // Delete the software entry
        await software.destroy();

        console.log(`Software and associated versions successfully deleted with id: ${idproduto}`); // Logging
        res.json({ message: 'Software deleted successfully' });
    } catch (error) {
        console.error(`Error deleting software with id: ${idproduto}`, error); // Logging
        res.status(500).json({ error: 'Error deleting software' });
    }
};

adminController.addSoftware = async (req, res) => {
    try {
        const { nome, descricao, categoria, versao, precoproduto, idproduto, logotipo, imagenssoftware, idtipo } = req.body;

        console.log('Dados recebidos para adicionar software:', req.body);

        if (!idproduto) {
            return res.status(400).json({ error: 'ID do produto não fornecido.' });
        }

 
        const base64ToBuffer = (base64String) => {
            if (!base64String) return null;
            return Buffer.from(base64String.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        };

        const novoSoftware = await TipoSoftwares.create({
            nome,
            descricao,
            categoria,
            versao,
            precoproduto,
            idproduto,
            logotipo: base64ToBuffer(logotipo),
            imagenssoftware: base64ToBuffer(imagenssoftware),
            idtipo
        });

        console.log('Software adicionado:', novoSoftware);

       
        const novaVersao = await Versoes.create({
            versao: versao,
            datamodifi: new Date(), 
            idproduto: idproduto
        });

        console.log('Versão adicionada:', novaVersao);

        res.status(201).json({ novoSoftware, novaVersao });
    } catch (error) {
        console.error('Erro ao adicionar software:', error);
        res.status(500).json({ error: 'Erro ao adicionar software.' });
    }
};


adminController.listBudgets = async (req, res) => {
    try {
        const budgets = await Orcamentos.findAll();
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching budgets' });
    }
};



adminController.getBudgetDetails = async (req, res) => {
    const { idorca } = req.params;

    try {
        const budget = await Orcamentos.findByPk(idorca);
        if (!budget) {
            return res.status(404).json({ error: 'Budget not found' });
        }
        res.json(budget);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching budget details' });
    }
};

adminController.respondToBudget = async (req, res) => {
    const { idorca } = req.params;
    const { resposta } = req.body;

    try {
        const budget = await Orcamentos.findByPk(idorca);
        if (!budget) {
            return res.status(404).json({ error: 'Budget not found' });
        }

        const cliente = await Clientes.findOne({ where: { nif: budget.nif } });
        if (!cliente) {
            return res.status(404).json({ error: 'Client not found' });
        }

        let transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            auth: {
                user: '76a8dd002@smtp-brevo.com',
                pass: 'aIUpR5yJwXVBqLGN'
            }
        });

        let mailOptions = {
            from: '"Ware" <rodrigo.pina113@gmail.com>',
            to: cliente.email,
            subject: `Resposta ao Orçamento`,
            text: resposta
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ error: 'Error sending email', details: error.message });
            }
            res.json({ message: 'Response sent successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error responding to budget', details: error.message });
    }
};




adminController.listAcquiredSoftwares = async (req, res) => {
    try {
        const nif = req.cookies.nif;
        if (!nif) {
            return res.status(400).json({ error: 'NIF do usuário não fornecido nos cookies' });
        }

        const cliente = await Clientes.findOne({ where: { nif } });

        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        const softwares = await SoftwaresAdquiridos.findAll({ where: { nif: cliente.emp_nif } });

        if (!softwares || softwares.length === 0) {
            return res.status(404).json({ error: 'Nenhum software adquirido encontrado para este cliente' });
        }

        const softwaresWithDetails = await Promise.all(softwares.map(async (software) => {
            const licenses = await LicencasAtribuidas.findAll({ where: { chaveproduto: software.chaveproduto } });
            
            // Busca pelo tipo de software com o mesmo nome
            const tipoSoftware = await TipoSoftwares.findOne({ where: { nome: software.nome } });
            
            // Se encontrar o tipo de software correspondente, obtem o logotipo em base64
            const logotipoBase64 = tipoSoftware && tipoSoftware.logotipo ? Buffer.from(tipoSoftware.logotipo).toString('base64') : null;
            
            return {
                ...software.dataValues,
                licenses,
                logotipo: logotipoBase64
            };
        }));

        res.json(softwaresWithDetails);
    } catch (error) {
        console.error('Erro ao buscar softwares adquiridos:', error);
        res.status(500).json({ error: 'Erro ao buscar softwares adquiridos' });
    }
};



adminController.listClientes = async (req, res) => {
    const { tipo, query } = req.query;

    let whereCondition = {};
    if (query) {
        whereCondition = {
            nome: {
                [Op.iLike]: `%${query}%`
            }
        };
    }

    try {
        let clientes;
        if (tipo === 'comprador-gestor') {
            clientes = await Clientes.findAll({ where: { ...whereCondition, iduser: 1 } }); 
        } else if (tipo === 'gestor') {
            clientes = await Clientes.findAll({ where: { ...whereCondition, iduser: 2 } }); 
        } else {
            clientes = await Clientes.findAll({ where: whereCondition }); 
        }

        
        console.log('Clientes:', clientes); 

        res.json(clientes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching clientes' });
    }
};

adminController.getClientByNif = async (req, res) => {
    const { nif } = req.params;

    try {
        const client = await Clientes.findByPk(nif);
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json(client);
    } catch (error) {
        console.error('Error fetching client:', error);
        res.status(500).json({ error: 'Error fetching client' });
    }
};

adminController.updateClient = async (req, res) => {
    const { nif } = req.params;
    const { nome, email, codigopessoal, contacto, iduser, emp_nif } = req.body;

    try {
      
        const client = await Clientes.findByPk(nif);
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        
        const empresa = await Empresas.findByPk(emp_nif);
        if (!empresa) {
            return res.status(404).json({ error: 'Empresa not found' });
        }

        
        const userType = await TipoUser.findByPk(iduser);
        if (!userType) {
            return res.status(404).json({ error: 'User type not found' });
        }

        
        const updateData = {
            nome,
            email,
            codigopessoal,
            contacto,
            iduser,
            emp_nif
        };

        await client.update(updateData);

        res.json(client);
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ error: 'Error updating client' });
    }
};

adminController.deleteClient = async (req, res) => {
    const { nif } = req.params;

    try {
        const client = await Clientes.findByPk(nif);
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        await client.destroy();
        res.json({ message: 'Client deleted successfully' });
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ error: 'Error deleting client' });
    }
};

adminController.listEmpresas = async (req, res) => {
    try {
        const empresas = await Empresas.findAll({
            attributes: ['nif', 'nomeempresa']
        });
        res.json(empresas);
    } catch (error) {
        console.error('Error fetching empresas:', error);
        res.status(500).json({ error: 'Error fetching empresas' });
    }
};

module.exports = adminController;

