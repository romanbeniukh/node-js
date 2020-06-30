const validator = require('../helpers/validate');

const addContact = (req, res, next) => {
  const validationRule = {
    name: 'required|string',
    phone: 'required|string',
    email: 'required|email',
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(400)
        .send({
          data: err,
        });
    } else {
      next();
    }
  });
};

const updateContact = (req, res, next) => {
  const validationRule = {
    name: 'string',
    phone: 'string',
    email: 'email',
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(400)
        .send({
          data: err,
        });
    } else {
      next();
    }
  });
};

module.exports = {
  addContact,
  updateContact,
};
