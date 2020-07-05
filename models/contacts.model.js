const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
  }
);

const getContacts = async function () {
  return this.find();
};

const getContactById = async function (id) {
  return (ObjectId.isValid(id)) ? this.findById(id) : null;
};

const deleteContact = async function (id) {
  return (ObjectId.isValid(id)) ? this.findByIdAndDelete(id) : null;
};

const addContact = async function (contact) {
  return this.create(contact);
}

const updateContact = async function (id, updateData) {
  return (ObjectId.isValid(id)) ? this.findByIdAndUpdate(id, updateData, { new: true }) : null;
}

contactSchema.statics.getContacts = getContacts;
contactSchema.statics.getContactById = getContactById;
contactSchema.statics.deleteContact = deleteContact;
contactSchema.statics.addContact = addContact;
contactSchema.statics.updateContact = updateContact;

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
