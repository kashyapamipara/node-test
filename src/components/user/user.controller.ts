import { NextFunction, Request, Response } from "express";
import { getLogger } from "../../services/logger";
import HttpException, { ERROR_CONST } from "../../utils/error-utils";
import { successCommonCode, SuccessResponse } from "../../utils/success-utils";
import { createUser } from "./user.DAL";
import { USER_ERROR_CODES } from "./user.errors";
import User, { IUser, IUserDocument } from "./user.model";

const MODULE_NAME_FOR_LOG = "user.controller";
const log = getLogger(MODULE_NAME_FOR_LOG);

class UserController {
  /** signUp new user its used first time while setup system
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<void>}
   */
  public async signupUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userObject = req.body;
      const user = await createUser(userObject);
      log.info("user created successfully");
      const response = SuccessResponse.apiSuccess({
        code: successCommonCode.CREATED_SUCCESSFULLY,
        data: user,
        message: "user signup Successfully",
      });
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Post - /user/login
   * login for panel user
   * @param req
   * @param res
   * @param next
   */
  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = <IUserDocument>req.body;

      const user = await User.findByCredentials(email, password);
      if (!user) {
        throw new HttpException({
          errorType: ERROR_CONST.BAD_REQUEST,
          exceptionCode: USER_ERROR_CODES.SIGN_IN_FAIL,
          description: "SIGN_IN_FAIL",
          moduleName: MODULE_NAME_FOR_LOG,
        });
      }

      /*
       * Generate new token on every login  */
      const userToken = await user.getAuthToken();
      const response = SuccessResponse.apiSuccess({
        code: "USER_LOGIN_SUCCESSFULLY",
        data: {
          token: userToken,
          role: user.role,
          _id: userToken._id,
          name: user.name,
          email: user.email,
          contactNumber: user.contactNumber,
        },
        message: "user signup Successfully",
      });
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Post - /user/logout/
   * logout from device & remove token array
   * @param req
   * @param res
   * @param next
   */

  public async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      /*
       * Token verification  */
      const token = req.header("Authorization");
      const user = req.user as IUser;
      /*
       * Removes token on every logout  */
      await user.removeToken(token).catch((err) => {
        throw new HttpException({
          errorType: ERROR_CONST.DATABASE_ERROR,
          exceptionCode: "ERROR_ON_FINDING_TOKEN",
          description: "Cannot find the matching token",
          err,
          moduleName: MODULE_NAME_FOR_LOG,
        });
      });

      await req.user.save();
      const response = SuccessResponse.apiSuccess({
        code: "LOGOUT_SUCCESSFULLY",
        message: "user logout Successfully",
        statusCode: 201,
      });
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Post - /user/getUser/
   * get user from token
   * @param req
   * @param res
   * @param next
   */

  public async getUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      /*
       * Token verification  */
      const token = req.header("Authorization");
      const user = req.user as IUser;

      const response = SuccessResponse.apiSuccess({
        code: "GET_USER_SUCCESSFULLY",
        message: "user get Successfully",
        data: user,
        statusCode: 201,
      });
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  }
}

export const userController = new UserController();
export default userController;
