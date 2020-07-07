const Contact = require('../models/contacts.model');

class ContactsController {
  async getAllContacts(req, res) {
    try {
      const contacts = await Contact.getContacts();
      res.status(200).json(contacts);
    } catch (err) {
      res.status(400).json({ err: err });
    }
    
  }

  async getContactById(req, res) {
    try {
      const { id } = req.params;
      const contact = await Contact.getContactById(id);
      (!contact) ? res.status(404).json({ message: 'Contact not found' }) : res.status(200).json(contact);
    } catch (err) {
      res.status(400).json({ err: err })
    }
  }

  async deleteContact(req, res) {
    try {
      const { id } = req.params;
      const contact = await Contact.deleteContact(id);
      (!contact) ? res.status(404).json({ message: 'Contact not found' }) : res.status(200).json({ message: 'Contact successful deleted' });
    } catch (err) {
      res.status(400).json({ err: err });
    }
  }

  async addContact(req, res) {
    try {
      const { name, phone, email } = req.body;
      const contact = await Contact.addContact({ name, phone, email });
      res.status(201).json(contact);
    } catch (err) {
      res.status(400).json({ err: err });
    }
  }

  async updateContact(req, res) {
    try {
      const { id } = req.params;
      const result = await Contact.updateContact(id, req.body);
      (!result) ? res.status(404).json({ message: 'Contact not found' }) : res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ err: err });
    }
  }
}

module.exports = {
  contactsController: new ContactsController(),
};
