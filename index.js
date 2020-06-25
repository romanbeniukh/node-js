const { showContactsList, getContactById, removeContact, addContact } = require('./modules/contacts');
const argv = require('yargs').argv;

// const test = async () => {
//   await addContact('ivan', '456783', 'fgdf@gfdg.com');
//   await showContactsList();
// };

// test();

const invokeAction = ({ action, id, name, email, phone }) => {
  switch (action) {
    case 'list':
      showContactsList();
      break;

    case 'get':
      getContactById(id);
      break;

    case 'add':
      addContact(name, phone, email);
      break;

    case 'remove':
      removeContact(id);
      break;

    default:
      console.warn('\x1B[31m Unknown action type!');
  }
}

invokeAction(argv);
