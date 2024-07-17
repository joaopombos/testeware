const Clientes = require('../models/clientes');
const  Empresas  = require('../models/empresas');
const Ware = require('../models/ware')
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


const clientesController = {};


function generatePassword() {
  return crypto.randomBytes(6).toString('hex');
}


clientesController.createSignup = async (req, res) => {
  try {
    const { nomeempresa, emp_nif, localizacao, contacto_empresa, nome, email, contacto_cliente, nif } = req.body;

    if (!nomeempresa || !emp_nif || !nome || !email || !nif) {
      return res.status(400).json({
        error: 'Faltam campos obrigatórios',
        details: [
          !nomeempresa && 'nomeempresa não pode ser nulo',
          !emp_nif && 'emp_nif não pode ser nulo',
          !nome && 'nome não pode ser nulo',
          !email && 'email não pode ser nulo',
          !nif && 'nif não pode ser nulo'
        ].filter(Boolean).join(', ')
      });
    }

    let empresa = await Empresas.findOne({ where: { nif: emp_nif } });

    if (!empresa) {
      empresa = await Empresas.create({ nomeempresa, nif: emp_nif, localizacao,  contacto: contacto_empresa });
    }

    const codigopessoal = generatePassword();

    const iduser = 1;

    const client = await Clientes.create({ emp_nif, iduser, nome, email, codigopessoal, contacto: contacto_cliente, nif });

    let transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: '76a8dd002@smtp-brevo.com',
        pass: 'aIUpR5yJwXVBqLGN'
      },
      from: 'rodrigo.pina113@gmail.com'
    });

    let mailOptions = {
      from: '"Ware" <rodrigo.pina113@gmail.com>',
      to: email,
      subject: 'Código Pessoal',
      text: `Olá ${nome},\n\nO código pessoal é: ${codigopessoal}\n\nObrigado!`,
      html: `<p>Olá ${nome},</p><p>O código pessoal é: <strong>${codigopessoal}</strong></p><p>Obrigado!</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: 'Erro ao enviar e-mail', details: error.message });
      }
      res.status(201).json(client);
    });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar cliente', details: error.message });
  }
};


const jwtSecret = 'seuSegredoAqui';

clientesController.login = async (req, res) => {
  console.log(req.body);
  const { email, codigopessoal, emp_nif } = req.body;

  try {
    if (!email || !codigopessoal) {
      return res.status(400).json({ error: 'Email e código pessoal são obrigatórios.' });
    }

    const client = await Clientes.findOne({ where: { email }, attributes: ['emp_nif', 'iduser', 'email', 'codigopessoal', 'nif'] });
    console.log(client); 


    if (!client) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    if (codigopessoal !== client.codigopessoal) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: client.nif, email: client.email, iduser: client.iduser, emp_nif: client.emp_nif },
      jwtSecret,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 3600000 }); 
    res.cookie('nif', client.nif, { httpOnly: true, secure: false, maxAge: 3600000 }); 
    res.cookie('iduser', client.iduser, { httpOnly: true, secure: false, maxAge: 3600000 }); 
    res.cookie('emp_nif', client.emp_nif, { httpOnly: true, secure: false, maxAge: 3600000 }); 


    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};


clientesController.logout = (req, res) => {
  res.clearCookie('token');
  res.clearCookie('nif');
  res.clearCookie('iduser');
  res.status(200).send('Logout realizado com sucesso.');
};

clientesController.logoutadmin = (req, res) => {
  res.clearCookie('token');
  res.clearCookie('idware');
  res.status(200).send('Logout realizado com sucesso.');
};




clientesController.create_gestor = async (req, res) => {
  try {
    const { emp_nif, nome, email, contacto: contacto_cliente, nif  } = req.body;

    if (!emp_nif || !nome || !email || !nif) {
      return res.status(400).json({
        error: 'Faltam campos obrigatórios',
        details: [
          !emp_nif && 'emp_nif não pode ser nulo',
          !nome && 'nome não pode ser nulo',
          !email && 'email não pode ser nulo',
          !nif && 'nif não pode ser nulo'
        ].filter(Boolean).join(', ')
      });
    }

    const empresaExistente = await Empresas.findOne({ where: { nif: emp_nif } });
    if (!empresaExistente) {
      return res.status(400).json({
        error: 'emp_nif não é válido',
        details: 'emp_nif fornecido não corresponde a nenhuma empresa existente'
      });
    }

    const codigopessoal = generatePassword();

    const iduser = 2;

    const client = await Clientes.create({ emp_nif, iduser, nome, email, codigopessoal, contacto: contacto_cliente, nif });

    let transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: '76a8dd002@smtp-brevo.com',
        pass: 'aIUpR5yJwXVBqLGN'
      },
      from: 'rodrigo.pina113@gmail.com'
    });

    let mailOptions = {
      from: '"Ware" <rodrigo.pina113@gmail.com>',
      to: email,
      subject: 'Código Pessoal',
      text: `Olá ${nome},\n\nO teu código pessoal é: ${codigopessoal}\n\nObrigado!`,
      html: `<p>Olá ${nome},</p><p>O seu código pessoal é: <strong>${codigopessoal}</strong></p><p>Obrigado!</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: 'Erro ao enviar e-mail', details: error.message });
      }
      res.status(201).json(client);
    });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar cliente', details: error.message });
  }
};

clientesController.loginadmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ error: 'Username e password são obrigatórios.' });
    }

    const wareUser = await Ware.findOne({ where: { username } });

    if (!wareUser) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }


    if (password !== wareUser.password) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { idware: wareUser.idware, username: wareUser.username },
      jwtSecret,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 3600000 }); 
    res.cookie('idware', wareUser.idware, { httpOnly: true, secure: false, maxAge: 3600000 }); 

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

module.exports = clientesController;