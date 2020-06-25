const fs = require('fs').promises;
const path = require('path');
const { uuid } = require('uuidv4');
const contactsDb = path.join('db', 'contacts.json')

class Contact {
  constructor ({ name, phone, email }, id) {
    this.id = id
    this.name = name
    this.phone = phone
    this.email = email
  }
}

const showContactsList = async () => {
  const contacts = await fs.readFile(contactsDb, 'utf-8');
  return JSON.parse(contacts);
};

const getContactById = async id => {
  const contacts = await showContactsList();
  return contacts.find(contact => contact.id === id);
};

const removeContact = async id => {
  const contacts = await showContactsList() || [];
  const isContact = await getContactById(id);

  if (isContact !== undefined) {
    const contactsAfterRemove = contacts.filter(contact => contact.id !== id);
    const contactsForDb = JSON.stringify(contactsAfterRemove);

    await fs.writeFile(contactsDb, contactsForDb)

    return contactsAfterRemove;
  } else {
    console.warn(`\x1B[31m Contact with id - ${id} not found!`);
  }
};

const addContact = async (name, phone, email) => {
  const contacts = await showContactsList() || [];
  const id = uuid();
  const createdContact = new Contact({name, phone, email}, id);
  const newContacts = [...contacts, createdContact]
  const contactsForDb = JSON.stringify(newContacts);

  await fs.writeFile(contactsDb, contactsForDb);

  return newContacts;
};

module.exports = {
  showContactsList,
  getContactById,
  removeContact,
  addContact
};
