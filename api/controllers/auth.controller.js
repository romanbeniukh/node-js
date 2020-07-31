import Joi from "@hapi/joi";
import { authModel, USER_STATUSES } from "../models/auth.model";
import bcrypt from "bcrypt";
import jwt, { verify } from "jsonwebtoken";
import { createControllerProxy } from "../helpers/controllerProxy";
import {
  Conflict,
  NotFound,
  Unauthorized,
  BadRequest,
} from "../helpers/errors.constructor";
import sgMail from "@sendgrid/mail";

class AuthController {
  async registerUser(req, res, next) {
    try {
      console.log(req.file.filename)
      const { email, password } = req.body;

      const checkedEmailInDb = await authModel.getUserEmail(email);
      if (checkedEmailInDb) {
        throw new Conflict("User alredy exist");
      }

      const passwordHash = await this.hashingPassword(password);

      const avatarURL = `${process.env.SERVER_LINK}${process.env.IMAGES_CATALOG}${req.file.filename}`;

      const result = await authModel.createUser({
        email,
        password: passwordHash,
        avatarURL,
      });

      this.emailValidation(result);

      return res.status(201).json({
        user: { email, subscription: result.subscription, avatarURL },
      });
    } catch (err) {
      next(err);
    }
  }

  async userLogIn(req, res, next) {
    try {
      const { email, password } = req.body;
      const userAuth = await authModel.getUserEmail(email);

      console.log(userAuth);
      if (!userAuth) {
        throw new NotFound("User not found");
      }

      if (userAuth.status === USER_STATUSES.NOT_VERIFY) {
        throw new BadRequest("User not verified");
      }

      const checkedPassword = await this.passwordChecked(
        password,
        userAuth.password
      );

      if (!checkedPassword) {
        throw new Unauthorized("User not authorized");
      }

      const token = this.generateToken(userAuth._id);
      await authModel.updateUser(userAuth.email, token);

      return res.status(200).json({
        user: {
          email,
          subscription: userAuth.subscription,
          avatarURL: userAuth.avatarURL,
        },
        token,
      });
    } catch (err) {
      next(err);
    }
  }

  async userVerification(req, res, next) {
    try {
      const { verificationToken } = req.params;

      const verifyUser = await authModel.getUserByVerificationToken(
        verificationToken
      );

      if (!verifyUser) {
        throw new NotFound("User not found");
      }

      await authModel.verificatedUser(verifyUser.email);

      res.status(200).json("User been verificated");
    } catch (err) {
      next(err);
    }
  }

  async autorizate(req, res, next) {
    try {
      const authHeaders = req.get("Authorization");

      if (!authHeaders) {
        throw new Unauthorized("User not authorized");
      }
      const token = authHeaders.replace("Bearer ", "");
      const user = await authModel.findUserByToken(token);

      if (!user) {
        throw new Unauthorized("User not authorized");
      }
      try {
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, user._id);
      } catch (err) {
        throw err;
      }

      req.user = user;

      next();
    } catch (err) {
      next(err);
    }
  }

  async userLogOut(req, res, next) {
    try {
      const { _id, email } = req.user;
      if (!_id) {
        throw new Unauthorized("User not authorized");
      }

      await authModel.getUserByEmailAndDeleteToken(email);

      return res.status(204).json();
    } catch (err) {
      next(err);
    }
  }

  async userUpdateAvatar(req, res, next) {
    try {
      const userEmail = req.user.email;

      if (!userEmail) {
        throw new Unauthorized("User not authorized");
      }

      const avatarURL = `${process.env.SERVER_LINK}${process.env.IMAGES_CATALOG}${req.file.filename}`;

      await authModel.updateUserAvatar(req.user.email, avatarURL);

      return res.status(200).json(avatarURL);
    } catch (err) {
      next(err);
    }
  }

  async getCurrentUserByToken(req, res, next) {
    try {
      const user = await authModel.findUserByToken(req.user.token);
      if (!user) {
        throw new Unauthorized("User not authorized");
      }

      return res
        .status(200)
        .json({ email: user.email, subscription: user.subscription });
    } catch (err) {
      next(err);
    }
  }

  async emailValidation(user) {
    await sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const { verificationToken, email } = user;
    const validationUrl = `${process.env.SERVER_LINK}auth/verify/${verificationToken}`;
    const msg = {
      to: email,
      from: process.env.EMAIL_SENDER,
      subject: "Please validate your Email adress",
      html: `<a href=${validationUrl}>Click here to validate your email</a>`,
    };

    await sgMail.send(msg).then(() => {
      console.log('Message sent')
    }).catch((error) => {
      console.log(error.response.body)
    })
  }

  async hashingPassword(password) {
    return bcrypt.hash(password, 8);
  }

  async passwordChecked(password, userPassword) {
    return bcrypt.compare(password, userPassword);
  }

  generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_PRIVATE_KEY);
  }

  validateRequestBody(req, res, next) {
    const userRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    try {
      const userValidate = userRules.validate(req.body);
      if (userValidate.error) {
        throw new BadRequest("Invalid request body");
      }

      next();
    } catch (err) {
      next(err);
    }
  }
}

export const authController = createControllerProxy(new AuthController());
