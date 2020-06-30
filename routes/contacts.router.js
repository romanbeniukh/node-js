const { Router } = require('express');
const { contactsController } = require('../controllers/contacts.controller');
const validation = require('../middleware/contacts.validate');

const contactsRouter = Router();

contactsRouter.get('/', contactsController.getAllContacts);
contactsRouter.get('/:id', contactsController.getContactById);
contactsRouter.delete('/:id', contactsController.removeContact);
contactsRouter.post('/', validation.addContact, contactsController.addContact);
contactsRouter.patch('/:id', validation.updateContact, contactsController.updateContact);

module.exports = {
  contactsRouter,
};
