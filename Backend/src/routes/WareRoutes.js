const express = require('express');
const router = express.Router();
const licencaController = require('../controllers/LicencasController');
const clientesController = require('../controllers/ClientesController');
const comprasController = require('../controllers/ComprasController');
const appController = require('../controllers/AppController');
const analyticsController = require('../controllers/AnalyticsController');

const { isAuthenticated, isBuyer, isManager, isAdmin } = require('../middlewares/middleware');

// Rotas de cadastro e login
router.post('/signin/comprador', clientesController.createSignup);
router.post('/signin/gestor', clientesController.create_gestor);
router.post('/login', clientesController.login);                  
router.post('/login/admin', clientesController.loginadmin);     
router.get('/logout', clientesController.logout);                 
router.get('/logout/admin', clientesController.logoutadmin);     

// Rotas de loja acessíveis aos comprador
router.get('/shop/softwares', isAuthenticated, isBuyer, comprasController.listCategoriesOrSoftwares);                 
router.get('/shop/:idproduto/', isAuthenticated, comprasController.softwareDetails);             
router.post('/shop/compra/', isAuthenticated, isBuyer, comprasController.purchaseSuccess);                      
router.get('/shop/:idvenda/success', isAuthenticated, isBuyer, comprasController.purchaseSuccess); 
router.get('/versions/:idproduto', isAuthenticated, isBuyer, comprasController.getVersionsByProductId);    

// Rotas da biblioteca acessíveis aos compradores e gestor
router.get('/library', isAuthenticated, appController.listAcquiredSoftwares);             
router.get('/license/:chaveproduto', isAuthenticated, licencaController.getSoftwareLicenses);
router.put('/license/:chaveproduto', isAuthenticated, licencaController.updateLicense);

// Rotas do administrador
router.get('/list/admin', isAuthenticated, isAdmin, appController.listSoftwares);                       
router.put('/update/admin/:idproduto', isAuthenticated, isAdmin, appController.updateSoftware);         
router.get('/edit/admin/:idproduto', isAuthenticated, isAdmin, appController.getSoftwareById);
router.delete('/edit/admin/:idproduto', isAuthenticated, isAdmin, appController.deleteSoftware);      
router.post('/add/admin', isAuthenticated, isAdmin, appController.addSoftware);                       
router.get('/budget/admin', isAuthenticated, isAdmin, appController.listBudgets);                      
router.get('/budget/admin/:idorca', isAuthenticated, isAdmin, appController.getBudgetDetails);          
router.post('/budget/admin/:idorca', isAuthenticated, isAdmin, appController.respondToBudget);         
router.get('/metrics/admin', isAuthenticated, isAdmin, analyticsController.getMetrics);
router.get('/admin/clientes', isAuthenticated, isAdmin, appController.listClientes);
router.get('/admin/clientes/:nif', isAuthenticated, isAdmin, appController.getClientByNif);
router.put('/admin/clientes/:nif', isAuthenticated, isAdmin, appController.updateClient);
router.delete('/admin/clientes/:nif', isAuthenticated, isAdmin, appController.deleteClient);  
router.get('/admin/empresas', isAuthenticated, isAdmin, appController.listEmpresas);        

module.exports = router;