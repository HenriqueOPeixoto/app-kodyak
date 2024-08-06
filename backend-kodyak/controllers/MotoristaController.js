const MotoristaDAO = require('../DAOs/PostgreSQL/MotoristaDAO');

exports.createMotorista = (req, res) => {
    MotoristaDAO.createMotorista(req, res);
};

exports.getMotoristas = (req, res) => {
    MotoristaDAO.getMotoristas(req, res);
};

exports.getMotoristaById = (req, res) => {
    MotoristaDAO.getMotoristaById(req, res);
};

exports.updateMotorista = (req, res) => {
    MotoristaDAO.updateMotorista(req, res);
};

exports.alterarStatusMotorista = (req, res) => {
    MotoristaDAO.alterarStatusMotorista(req, res);
};