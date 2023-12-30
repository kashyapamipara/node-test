import { Router } from 'express';
import { authenticate } from '../../middleware/authentication.middleware';
import { ReqProperty, validator } from '../../middleware/validator.middleware';
import userController from './user.controller';
import { AddUserBodyDTO, UserLoginBodyDTO } from './user.dto';

export const userRoute = Router({ strict: false });

/**
 * to sign up new admin
 */
userRoute.post(`/`, validator(ReqProperty.BODY, AddUserBodyDTO), userController.signupUser);

/**
 * to login admin
 */
userRoute.post(`/login`, validator(ReqProperty.BODY, UserLoginBodyDTO), userController.login);

/**
 * to logout admin
 */
userRoute.post(`/logout`, authenticate.middleWare, userController.logout);
/**
 * to get user
 */

userRoute.get(`/getUser`, authenticate.middleWare, userController.getUser);


export default userRoute;
