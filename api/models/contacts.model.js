import mongoose, { Schema } from "mongoose";

const { ObjectId } = mongoose.Types;

const contactSchema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});

contactSchema.statics.getAllContacts = getAllContacts;
contactSchema.statics.getContactById = getContactById;
contactSchema.statics.addContact = addContact;
contactSchema.statics.removeContact = removeContact;
contactSchema.statics.updateContact = updateContact;

async function getAllContacts(userId) {
  return this.find({ userId });
}

async function getContactById(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  return this.findById(id);
}

async function addContact(contact) {
  return this.create(contact);
}

async function removeContact(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  return this.findByIdAndDelete(id);
}

async function updateContact(id, updateContactInfo) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  return this.findByIdAndUpdate(id, updateContactInfo);
}

export const contactsModel = mongoose.model("Contact", contactSchema);
