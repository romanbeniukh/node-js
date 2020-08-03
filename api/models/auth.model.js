import mongoose, { Schema } from 'mongoose';
import { v4 } from 'uuid';

const { ObjectId } = mongoose.Types;
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

userSchema.statics.getUserEmail = getUserEmail;
userSchema.statics.createUser = createUser;
userSchema.statics.updateUser = updateUser;
userSchema.statics.findUserByToken = findUserByToken;
userSchema.statics.getUserByEmailAndDeleteToken = getUserByEmailAndDeleteToken;
userSchema.statics.updateUserAvatar = updateUserAvatar;
userSchema.statics.getUserByVerificationToken = getUserByVerificationToken;
userSchema.statics.verificatedUser = verificatedUser;

function getUserEmail(email) {
  return this.findOne({ email });
}

function createUser(userAuth) {
  userAuth.verificationToken = v4();
  return this.create(userAuth);
}

function updateUser(email, token) {
  return this.updateOne({ email }, { token });
}

function findUserByToken(token) {
  return this.findOne({ token });
}

function getUserByEmailAndDeleteToken(email) {
  return this.updateOne({ email }, { token: '' });
}

function updateUserAvatar(email, avatarURL) {
  return this.updateOne({ email }, { avatarURL });
}

function getUserByVerificationToken(verificationToken) {
  return this.findOne({ verificationToken });
}

function verificatedUser(email) {
  return this.updateOne(
    { email },
    { verificationToken: null, status: USER_STATUSES.ACTIVE }
  );
}

export const userModel = mongoose.model('User', userSchema);
