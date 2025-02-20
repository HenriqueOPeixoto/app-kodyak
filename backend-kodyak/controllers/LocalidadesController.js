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

exports.getMunicipioViewById = (req, res) => {
    LocalidadesDAO.getMunicipioViewById(req, res);
};
