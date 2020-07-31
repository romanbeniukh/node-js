import Joi from "@hapi/joi";
import { contactsModel } from "../models/contacts.model";

class ContactsController {
  async getAllContacts(req, res, next) {
    const response = await contactsModel.getAllContacts();
    res.status(200).json(response);
  }

  async getContactById(req, res, next) {
    const userID = req.params.id;
    const response = await contactsModel.getContactById(userID);
    if (!response) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.status(200).json(response);
  }

  validateUserValue(req, res, next) {
    const validateRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });
    console.log(req.body);

    const validateReq = validateRules.validate(req.body);
    console.log(validateReq);

    if (validateReq.error) {
      return res.status(400).json({ message: "missing required name field" });
    }

    next();
  }

  validateUserUpdateValue(req, res, next) {
    const validateRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    });

    const hasUserFile = req.body.filename && req.body.fieldname === "avatar";

    if (!hasUserFile) {
      return res.status(400).json("User avatar not added");
    }

    const validateReq = validateRules.validate(req.body);

    if (validateReq.error) {
      return res.status(400).json({ message: "missing required name field" });
    }

    next();
  }

  async addContactToDB(req, res, next) {
    try {
      const contact = req.body;
      const result = await contactsModel.addContact(contact);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async deleteContactFromDB(req, res, next) {
    const userID = req.params.id;
    const response = await contactsModel.getContactById(userID);
    if (!response) {
      return res.status(404).json({ message: "User Not Found" });
    }
    await contactsModel.removeContact(userID);

    res.status(200).json({ message: "contact deleted" });
  }

  async updateContactData(req, res, next) {
    try {
      if (!req.body) {
        return res.status(400).json({ message: "missing fields" });
      }

      const userID = req.params.id;
      const result = await contactsModel.updateContact(userID, req.body);
      if (!result) {
        return res.status(404).json({ message: "Not found" });
      }
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}

export const contactsController = new ContactsController();
