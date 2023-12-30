import HttpException, {
  DEFAULT_ERROR_MESSAGE,
  ERROR_CONST
} from '../utils/error-utils';

const MODULE_NAME_FOR_LOG = 'error.middleware';

export const errorMiddleware = (err, req, res, next) => {
    try {
        // set meta data
        let tranceMeta;
        if (err.meta) {
            tranceMeta = { ...err.meta, ...{ traceId: req.id } };
        } else {
            tranceMeta = { traceId: req.id };
        }

        // Logging Error logic
        if (err && err.errorDetails) {
            req.log.error(
                {
                    errorDetails: err.errorDetails,
                    description: err.description,
                },
                `${err.description}`,
            );
        } else if (err && err.error_code) {
            req.log.error(
                {
                    error_code: err.error_code,
                    description: err.description,
                    tranceMeta,
                },
                `${err.description}`,
            );
        } else {
            req.log.error(err, `${err.message || 'Error_info'}`);
        }

        // returning response to api
        if (err && err.status_code) {
            res.err = err;
            res.status(err.status_code).json({ ...err, ...{ id: req.id } });
        } else {
            res.err = err;
            const exception = new HttpException({
                errorType: ERROR_CONST.UNHANDLED_ERROR,
                exceptionCode: ERROR_CONST.UNHANDLED_ERROR,
                description: DEFAULT_ERROR_MESSAGE[ERROR_CONST.UNHANDLED_ERROR],
                err,
                moduleName: MODULE_NAME_FOR_LOG,
            });
            res.status(exception.status_code).json({ ...exception, ...{ id: req.id } });
        }
    } catch (error) {
        res.err = error;
        const exception = new HttpException({
            errorType: ERROR_CONST.INTERNAL_SERVER_ERROR,
            exceptionCode: ERROR_CONST.INTERNAL_SERVER_ERROR,
            description: DEFAULT_ERROR_MESSAGE[ERROR_CONST.INTERNAL_SERVER_ERROR],
            err: error,
        });
        res.status(exception.status_code).json({ ...exception, ...{ id: req.id } });
    }
};
