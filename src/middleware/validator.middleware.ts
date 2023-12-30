import { plainToInstance } from 'class-transformer';
import { validate, ValidatorOptions } from 'class-validator';
import e, { NextFunction, Request, Response } from 'express';
import HttpException, {
  DEFAULT_ERROR_MESSAGE,
  ERROR_CONST
} from '../utils/error-utils';

export enum ReqProperty {
    QUERY = 'query',
    BODY = 'body',
    PARAMS = 'params',
    HEADERS = 'headers',
}

const MODULE_NAME_FOR_LOG = 'validator.middleware';

const defaultValidatorOptions: ValidatorOptions = Object.freeze({
    whitelist: true,
});

/**
 * A middleware to validate and transform/clean the incoming request data like params, body, query.
 * @param {ReqProperty} reqProperty Request property is the key from request. example: params, body, query.
 * @param {any} Schema Schema is like the pre-defined DTO for request data. It will be dynamic so can't define type.
 * @param {ValidatorOptions} options Options to do certain type of validation on/off.
 * @returns {(req: e.Request, res: e.Response, next: e.NextFunction) => void}
 */
export function validator(
    reqProperty: ReqProperty,
    Schema: any,
    options: ValidatorOptions = {},
): (req: e.Request, res: e.Response, next: e.NextFunction) => void {
    const validatorOptions = { ...defaultValidatorOptions, ...options };
    return async (req: Request, res: Response, next: NextFunction) => {
        const schema = plainToInstance(Schema, req[reqProperty]);
        const errors = await validate(schema, validatorOptions);
        if (!errors.length) {
            req[reqProperty] = schema;
            next();
            return;
        }
        const errorMessages = {};
        errors.forEach(({ property, constraints }) => {
            errorMessages[property] = Object.values(constraints);
        });
        next(
            new HttpException({
                errorType: ERROR_CONST.BAD_REQUEST,
                exceptionCode: ERROR_CONST.BAD_REQUEST,
                description: DEFAULT_ERROR_MESSAGE[ERROR_CONST.BAD_REQUEST],
                meta: { [reqProperty]: errorMessages },
                moduleName: MODULE_NAME_FOR_LOG,
            }),
        );
    };
}
