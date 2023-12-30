/** USER controller error codes
 */
export const USER_ERROR_CODES = {
    USER_NOT_FOUND: 'USER not found for email id',
    INCORRECT_PASSWORD: 'Password Incorrect',
    AUTH_FAILED: 'Authentication Failed',
    SIGN_IN_FAIL: 'Provided credentials are not correct',
    INTERNAL_SERVER_ERROR: 'Internal Error',
    /** USER DAL error codes
     */
    CREATE_USER_IN_DB: 'Something went wrong while creating new user user',
    USER_PULL_AUTH_TOKEN_DB: 'There was an internal error',
    EMAIL_ALREADY_EXIST: 'user already exists with email address'
};
