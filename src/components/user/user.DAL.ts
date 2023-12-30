import { getLogger } from '../../services/logger';
import HttpException, { ERROR_CONST } from '../../utils/error-utils';
import { USER_ERROR_CODES } from './user.errors';
import User, { IUser, IUserDocument } from './user.model';

const MODULE_NAME_FOR_LOG = 'user.DAL';
const log = getLogger(MODULE_NAME_FOR_LOG);

/** Create new user doc in database
 */
export const createUser = async (userObject: IUserDocument): Promise<IUser | never> => {
    try {
        return await User.create(userObject);
    } catch (err) {
        if (err.code === 11000 ) {
            throw new HttpException({
                errorType: ERROR_CONST.BAD_REQUEST,
                exceptionCode: 'EMAIL_ALREADY_EXIST',
                description: USER_ERROR_CODES.EMAIL_ALREADY_EXIST,
                err,
                moduleName: MODULE_NAME_FOR_LOG
            });
        }
        throw new HttpException({
            errorType: ERROR_CONST.DATABASE_ERROR,
            exceptionCode: 'CREATE_USER_IN_DB',
            description: USER_ERROR_CODES.CREATE_USER_IN_DB,
            err,
            moduleName: MODULE_NAME_FOR_LOG
        });
    }
};

export const pullAuthTokenFromUser = async (userId, tokenToPull): Promise<IUser> => {
    try {
        return await User.findByIdAndUpdate(userId, {
            $pull: {
                tokens: {
                    token: tokenToPull
                }
            }
        }).exec();
    } catch (err) {
        throw new HttpException({
            errorType: ERROR_CONST.DATABASE_ERROR,
            exceptionCode: 'USER_PULL_AUTH_TOKEN_DB',
            description: USER_ERROR_CODES.USER_PULL_AUTH_TOKEN_DB,
            err,
            moduleName: MODULE_NAME_FOR_LOG
        });
    }
};
