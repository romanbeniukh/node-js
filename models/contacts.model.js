const fs = require('fs').promises;
const path = require('path');
const { uuid } = require('uuidv4');

const contactsDb = path.join('db', 'contacts.json');

class Contact {
  constructor({ name, phone, email }, id) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.email = email;
  }
}

const getContacts = async () => {
  const contacts = await fs.readFile(contactsDb, 'utf-8');
  return JSON.parse(contacts);
};

const getContactById = async (id) => {
  const contacts = await getContacts() || [];
  return contacts.find((contact) => contact.id === id);
};

const removeContact = async (id) => {
  const contacts = await getContacts() || [];
  const isContact = await getContactById(id) || null;

  if (isContact) {
    const contactsAfterRemove = contacts.filter((contact) => contact.id !== id);
    const contactsForDb = JSON.stringify(contactsAfterRemove);

    await fs.writeFile(contactsDb, contactsForDb);
  }

  return isContact;
};

const addContact = async (name, phone, email) => {
  const contacts = await getContacts() || [];
  const id = uuid();
  const createdContact = new Contact({ name, phone, email }, id);
  const newContacts = [...contacts, createdContact];
  const contactsForDb = JSON.stringify(newContacts);

  await fs.writeFile(contactsDb, contactsForDb);

  return createdContact;
};

const updateContact = async (id, updatedValue) => {
  const contacts = await getContacts() || [];
  const contact = await getContactById(id) || null;

  if (contact) {
    const newContact = { ...contact, ...updatedValue };
    const newContacts = contacts.map((elem) => (elem.id !== newContact.id ? elem : newContact));
    const contactsForDb = JSON.stringify(newContacts);

    await fs.writeFile(contactsDb, contactsForDb);
    return newContact;
  }
};

module.exports = {
  getContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
