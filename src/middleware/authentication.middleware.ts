import { NextFunction, Request, Response } from 'express';
import User from '../components/user/user.model';
import { getLogger } from '../services/logger';
import HttpException, { ERROR_CONST } from '../utils/error-utils';
import { MIDDLEWARE_ERROR_CODES } from './middleware.errors';

const MODULE_NAME_FOR_LOG = 'authentication.middleware';
const log = getLogger(MODULE_NAME_FOR_LOG);

class Authenticate {
    public middleWare(req: Request, res: Response, next: NextFunction) {

        const token = req.header('authorization');
        // this is comparing string so don't change anything
        if (token) {
            User.findByToken(token)
              .then(user => {
                  if (user) {
                      req.user = user;
                      log.debug(`AUTH - user id:${user._id}`);
                      next();
                  } else {
                      const exception = new HttpException({
                          errorType: ERROR_CONST.UNAUTHORIZED,
                          exceptionCode: 'AUTH_USER_NOT_FOUND',
                          description: MIDDLEWARE_ERROR_CODES.AUTH_USER_NOT_FOUND,
                          moduleName: MODULE_NAME_FOR_LOG
                      });
                      next(exception);
                  }
              })
              .catch(err => {
                  let exception;
                  if (err && err.message && err.message === 'Authentication Failed') {
                      exception = new HttpException({
                          errorType: ERROR_CONST.UNAUTHORIZED,
                          exceptionCode: 'ERROR_DECODING_AUTH_TOKEN',
                          description: MIDDLEWARE_ERROR_CODES.ERROR_DECODING_AUTH_TOKEN,
                          moduleName: MODULE_NAME_FOR_LOG
                      });
                  } else if (err && err.message && err.message === 'Session Expired') {
                      exception = new HttpException({
                          errorType: ERROR_CONST.UNAUTHORIZED,
                          exceptionCode: 'SESSION_EXPIRED_ERROR',
                          description: MIDDLEWARE_ERROR_CODES.SESSION_EXPIRED_ERROR,
                          moduleName: MODULE_NAME_FOR_LOG
                      });
                  } else {
                      exception = new HttpException({
                          errorType: ERROR_CONST.DATABASE_ERROR,
                          exceptionCode: 'UNHANDLED_DATABASE_ERROR',
                          description: MIDDLEWARE_ERROR_CODES.UNHANDLED_DATABASE_ERROR,
                          err,
                          moduleName: MODULE_NAME_FOR_LOG
                      });
                  }
                  next(exception);
              });
        } else {
            log.warn(`Authentication : JWT - Auth-Token not set in header`);
            const exception = new HttpException({
                errorType: ERROR_CONST.UNAUTHORIZED,
                exceptionCode: 'AUTH_TOKEN_NOT_SET_IN_ERROR',
                description: MIDDLEWARE_ERROR_CODES.AUTH_TOKEN_NOT_SET_IN_ERROR,
                moduleName: MODULE_NAME_FOR_LOG
            });
            next(exception);
        }
    }
}

export const authenticate = new Authenticate();
