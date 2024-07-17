const { Sequelize, fn, col } = require('sequelize');
const Orcamentos = require('../models/orcamentos');

const adminController = {};

adminController.getMetrics = async (req, res) => {
    try {
        const totalCost = await Orcamentos.sum('precoorcamento');

        const averageCost = await Orcamentos.findAll({
            attributes: [[fn('AVG', col('precoorcamento')), 'averageCost']],
        });

        const totalBudgets = await Orcamentos.count();

        res.json({
            totalCost,
            averageCost: averageCost.length > 0 ? averageCost[0].dataValues.averageCost : null,
            totalBudgets
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching metrics' });
    }
};

module.exports = adminController;
