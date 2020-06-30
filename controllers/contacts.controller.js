const {
  getContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require('../models/contacts.model');

class ContactsController {
  async getAllContacts(req, res) {
    const contacts = await getContacts();
    res.status(200).json(contacts);
  }

  async getContactById(req, res) {
    const { id } = req.params;
    const contact = await getContactById(id);

    !contact ? res.status(400).json({ message: 'Contact not found' }) : res.status(200).json(contact);
  }

  async removeContact(req, res) {
    const { id } = req.params;
    const result = await removeContact(+id);

    (!result) ? res.status(404).json({ message: 'Contact not found' }) : res.status(200).json({ message: 'Contact successful deleted' });
  }

  async addContact(req, res) {
    const { name, phone, email } = req.body;
    const contact = await addContact(name, phone, email);

    res.status(201).json(contact);
  }

  async updateContact(req, res) {
    const { id } = req.params;
    const result = await updateContact(id, req.body);

    (!result) ? res.status(404).json({ message: 'Contact not found' }) : res.status(200).json(result);
  }
}

module.exports = {
  contactsController: new ContactsController(),
};
