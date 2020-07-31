import mongoose, { Schema } from 'mongoose';
import { v4 } from 'uuid';

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

export const USER_STATUSES = {
  NOT_VERIFY: 'NOT_VERIFY',
  ACTIVE: 'ACTIVE',
};

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscription: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free',
    required: false,
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(USER_STATUSES),
    default: USER_STATUSES.NOT_VERIFY,
  },
  verificationToken: { type: String, required: false },
  avatarURL: { type: String, required: true },
  token: { type: String, required: false },
});

const getUserEmail = async (email) => {
  return this.findOne({ email });
}

const createUser = async (userAuth) => {
  userAuth.verificationToken = v4();
  return this.create(userAuth);
}

const updateUser = async (email, token) => {
  return this.updateOne({ email }, { token });
}

const findUserByToken = async (token) => {
  return this.findOne({ token });
}

const getUserByEmailAndDeleteToken = async (email) => {
  return this.updateOne({ email }, { token: '' });
}

const updateUserAvatar = (email, avatarURL) => {
  return this.updateOne({ email }, { avatarURL });
}

const getUserByVerificationToken = async (verificationToken) => {
  return this.findOne({ verificationToken });
}

const verificatedUser = async (email) => {
  return this.updateOne(
    { email },
    { verificationToken: null, status: USER_STATUSES.ACTIVE }
  );
}

userSchema.statics.getUserEmail = getUserEmail;
userSchema.statics.createUser = createUser;
userSchema.statics.updateUser = updateUser;
userSchema.statics.findUserByToken = findUserByToken;
userSchema.statics.getUserByEmailAndDeleteToken = getUserByEmailAndDeleteToken;
userSchema.statics.updateUserAvatar = updateUserAvatar;
userSchema.statics.getUserByVerificationToken = getUserByVerificationToken;
userSchema.statics.verificatedUser = verificatedUser;

export const authModel = mongoose.model('User', userSchema);
