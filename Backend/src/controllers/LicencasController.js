const SoftwaresAdquiridos = require('../models/softwaresadquiridos');
const LicencasAtribuidas = require('../models/licencasatribuidas');

const licencaController = {};


licencaController.getSoftwareLicenses = async (req, res) => {
    const { chaveproduto } = req.params;

    try {
        const software = await SoftwaresAdquiridos.findOne({ where: { chaveproduto } });
        if (!software) {
            return res.status(404).json({ error: 'Software not found' });
        }

        const licenses = await LicencasAtribuidas.findAll({ where: { chaveproduto } });
        res.json({ software, licenses });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching software licenses' });
    }
};


licencaController.updateLicense = async (req, res) => {
    const { chaveproduto } = req.params;
    const { idatribuida, nomepc } = req.body;

    try {
        const license = await LicencasAtribuidas.findOne({ where: { idatribuida, chaveproduto } });
        if (!license) {
            return res.status(404).json({ error: 'License not found' });
        }

        await license.update({ 
            nomepc, 
            dataatri: new Date()
        });
        res.json(license);
    } catch (error) {
        res.status(500).json({ error: 'Error updating license' });
    }
};



licencaController.removeLicense = async (req, res) => {
    const { idatribuida } = req.params;

    try {
        const license = await LicencasAtribuidas.findByPk(idatribuida);
        if (!license) {
            return res.status(404).json({ error: 'License not found' });
        }

        await license.destroy();
        res.json({ message: 'License removed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error removing license' });
    }
};


module.exports = licencaController;
