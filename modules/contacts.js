const fs = require('fs').promises;
const path = require('path');

const contactsDb = path.join('db', 'contacts.json')

class Contact {
  constructor ({ name, phone, email }, id) {
    this.id = id,
    this.name = name,
    this.phone = phone,
    this.email = email
  }
}

const showContactsList = async () => {
  const contacts = await fs
  .readFile(contactsDb, 'utf-8')
  .then(res => {
    const parsedContacts = JSON.parse(res);
    console.table(parsedContacts);
    return parsedContacts;
  })
  .catch(err => {
    throw err;
  })

  return contacts;
};

const getContactById = async id => {
  const contacts = await showContactsList();
  const foundedContact = contacts.find(contact => contact.id === id);

  console.log(foundedContact)

  return foundedContact;
};

const removeContact = async id => {
  const contacts = await showContactsList();
  const contactsAfterRemove = await contacts.filter(contact => contact.id !== id);
  const foundedContact = contacts.find(contact => contact.id === id);
  const contactsForDb = JSON.stringify(contactsAfterRemove);

  if (foundedContact) {
    await fs
    .writeFile(contactsDb, contactsForDb)
    .then(() => {
      console.log(`\x1B[32m Contact with id ${id} was successful removed! \x1b[0m`);
    })
    .catch(err => {
      throw err;
    });
  } else {
    console.log(`\x1B[31m Contact with id ${id} not found! \x1b[0m`);
  }
};

const addContact = async (name, phone, email) => {
  const contacts = await showContactsList();
  const id = [...contacts].pop().id + 1;
  const createdContact = new Contact({name, phone, email}, id);
  const newContacts = [...contacts, createdContact];
  const contactsForDb = JSON.stringify(newContacts);

  await fs
    .writeFile(contactsDb, contactsForDb)
    .then(() => {
      console.log(`\x1B[32m Contact with name ${name} was successful added! \x1b[0m`, createdContact);
    })
    .catch(err => {
      throw err;
    });
};

module.exports = {
  showContactsList,
  getContactById,
  removeContact,
  addContact
};
