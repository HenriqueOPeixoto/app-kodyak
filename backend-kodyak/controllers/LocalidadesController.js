const LocalidadesDAO = require('../DAOs/PostgreSQL/LocalidadesDAO');

exports.getUnidadesFederativas = (req, res) => {
    LocalidadesDAO.getUnidadesFederativas(req, res);
};

exports.getMunicipios = (req, res) => {
    LocalidadesDAO.getMunicipios(req, res);
};

exports.getUnidadeFederativaById = (req, res) => {
    LocalidadesDAO.getUnidadeFederativaById(req, res);
};

exports.getMunicipioById = (req, res) => {
    LocalidadesDAO.getMunicipioById(req, res);
};
