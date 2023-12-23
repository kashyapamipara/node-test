import { getLogger } from '../services/logger';

const log = getLogger('error-utils');
const DEFAULT_ERROR_CODE = 500;

export const ERROR_CONST = {
    DATABASE_ERROR: 'DATABASE_ERROR',
    UNHANDLED_ERROR: 'UNHANDLED_ERROR',
    BAD_REQUEST: 'BAD_REQUEST',
    UNPROCESSABLE_ENTITY: 'UNPROCESSABLE_ENTITY',
    NOT_FOUND: 'NOT_FOUND',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FAILED_DEPENDENCY: 'FAILED_DEPENDENCY',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR'
};
export const ERROR_TYPE_ARR = Object.values(ERROR_CONST);
export type ERROR_TYPE_ENUM = typeof ERROR_TYPE_ARR[number];

export const STATUS_CODE = {
    [ERROR_CONST.DATABASE_ERROR]: DEFAULT_ERROR_CODE,
    [ERROR_CONST.UNHANDLED_ERROR]: DEFAULT_ERROR_CODE,
    [ERROR_CONST.INTERNAL_SERVER_ERROR]: DEFAULT_ERROR_CODE,
    [ERROR_CONST.BAD_REQUEST]: 400,
    [ERROR_CONST.UNPROCESSABLE_ENTITY]: 422,
    [ERROR_CONST.NOT_FOUND]: 404,
    [ERROR_CONST.UNAUTHORIZED]: 401,
    [ERROR_CONST.FAILED_DEPENDENCY]: 424
};

export const DEFAULT_ERROR_MESSAGE = {
    [ERROR_CONST.DATABASE_ERROR]: 'There was an internal error, Please try again later',
    [ERROR_CONST.UNHANDLED_ERROR]: 'Something went wrong, please try again later',
    [ERROR_CONST.BAD_REQUEST]: 'Sorry, there was an error processing your request',
    [ERROR_CONST.UNPROCESSABLE_ENTITY]: 'Sorry, there was an error processing your request',
    [ERROR_CONST.NOT_FOUND]: 'Resource not found',
    [ERROR_CONST.UNAUTHORIZED]: 'Operation not allowed',
    [ERROR_CONST.FAILED_DEPENDENCY]: 'Failed dependency',
    [ERROR_CONST.INTERNAL_SERVER_ERROR]: 'An unexpected error occurred.'
};

interface IGenericError {
    errorType?: ERROR_TYPE_ENUM;
    exceptionCode: string;
    description?: string;
    err?: any;
    meta?: any;
    moduleName?: string;
    id?: string;
}

export interface IGenericErrorReturnType {
    status: string;
    status_code: number;
    error: string;
    error_code: string;
    description: string;
    errorDetails?: any;
}

export default class HttpException extends Error {
    status_code: number;

    private status: string;

    private error: string;

    private error_code: string;

    private description: string;

    private errorDetails: any;

    private meta: any;

    private moduleName: string;

    constructor({
                    errorType = ERROR_CONST.UNHANDLED_ERROR,
                    exceptionCode,
                    description,
                    err,
                    meta,
                    moduleName = 'error-utils'
                }: IGenericError) {
        log.error(
          err,
          `Module Name: ${moduleName}
			Exception Code: ${exceptionCode}
			Description: ${description}`
        );
        super(description);
        this.status = 'ERROR';
        this.status_code = STATUS_CODE[errorType];
        this.error = ERROR_CONST[errorType];
        this.error_code = exceptionCode || ERROR_CONST.UNHANDLED_ERROR;
        this.description = description || DEFAULT_ERROR_MESSAGE[errorType];
        this.errorDetails = err?.message;
        this.meta = meta;
        this.moduleName = moduleName;
    }
}
