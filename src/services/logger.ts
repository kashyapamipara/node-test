import { config } from 'dotenv';
import { Request, Response } from 'express';
import { ServerResponse } from 'http';
import pino from 'pino';
import PinoHttp from 'pino-http';

config();

const LOG_LEVEL = process.env.LOG_LEVEL || 'trace';

export const log = pino({
    level: LOG_LEVEL,
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss Z',
            ignore: 'pid,hostname'
        }
    }
});

/**
 * Logger serializer
 */
export const debugConfig = {
    res(res: Response) {
        if (process.env.DEBUG_MODE === 'false') {
            return;
        }
        /** eslint-disable-next-line consistent-return
         */
        return {
            statusCode: res.statusCode
        };
    },
    req(req: Request) {
        if (process.env.DEBUG_MODE === 'false') {
            return;
        }
        /** eslint-disable-next-line consistent-return
         */
        return {
            id: req.id,
            method: req.method,
            url: req.url,
            queryParameters: req.query,
            /**
             * Including the headers in the log could be in violation
             * of privacy laws, e.g. GDPR. You should use the "redact" option to
             * remove sensitive fields. It could also leak authentication data in
             * the logs.
             */
            headers: req.headers,
            hostname: req.hostname,
            remoteAddress: req.ip,
            remotePort: req.socket?.remotePort || 'none'
        };
    },
    err(err: Error) {
        return {
            type: 'ERROR' /** The name of the object's constructor. */,
            message: err.message /** The supplied error message. */,
            stack: err.stack /** The stack when the error was generated. */
        };
    }
};

export const commonConfig = {
    level: LOG_LEVEL,
    customSuccessMessage(res: ServerResponse) {
        return `Request completed with statusCode ${res.statusCode}`;
    },
    customErrorMessage(error: Error) {
        return error.message;
    },
    customAttributeKeys: {
        req: 'HTTP_Request',
        res: 'HTTP_Response',
        err: 'HTTP_Error',
        responseTime: 'Execute_Time'
    },
    serializers: debugConfig
};

export const customLogger: { [key: string]: any } = {
    local: PinoHttp({
        logger: log,
        ...commonConfig
    } as pino.LoggerOptions),
    development: PinoHttp({
        redact: ['HTTP_Request.headers'],
        logger: log,
        ...commonConfig
    } as pino.LoggerOptions),
    staging: PinoHttp({
        redact: ['HTTP_Request.headers'],
        logger: log,
        ...commonConfig
    } as pino.LoggerOptions),
    production: PinoHttp({
        redact: ['HTTP_Request.headers'],
        logger: log,
        ...commonConfig
    } as pino.LoggerOptions)
};

export function getLogger(logModuleName: string) {
    return log.child({ component: logModuleName });
}
