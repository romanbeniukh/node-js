import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { upload } from '../helpers/multer';
import { compressorImg } from '../helpers/mozjpeg';

const router = Router();

router.post(
  '/register',
  upload.single('avatar'),
  compressorImg,
  authController.validateRequestBody,
  authController.registerUser
);

router.post(
  '/login',
  authController.validateRequestBody,
  authController.userLogIn
);

router.patch('/logout', authController.autorizate, authController.userLogOut);

router.get('/verify/:verificationToken', authController.userVerification);

router.patch(
  '/users/avatars',
  authController.autorizate,
  upload.single('avatar'),
  compressorImg,
  authController.userUpdateAvatar
);

router.get(
  '/users/current',
  authController.autorizate,
  authController.getCurrentUserByToken
);
export const authRouter = router;
