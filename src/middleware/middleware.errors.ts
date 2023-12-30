export const MIDDLEWARE_ERROR_CODES = {
    AUTH_USER_NOT_FOUND: 'Auth-Token is not valid or Auth-user not found',
    ERROR_DECODING_AUTH_TOKEN: 'Authentication failed',
    SESSION_EXPIRED_ERROR: 'Session Expired',
    AUTH_TOKEN_NOT_SET_IN_ERROR: 'Missing Auth-Token',
    UNHANDLED_DATABASE_ERROR: 'UNHANDLED_DATABASE_ERROR',
    UNAUTHORIZED: 'Unauthorized',
    CHANNEL_DISABLED: 'The channel is not enabled or required channel data not found',

    PREVIEWLINK_NOT_FOUND: 'Auth-Token is not valid or Previewlink not found',
    AUTH_FAILED_IN_PREVIEW_LINK: 'Authentication failed',

    GET_FLEXIBLE_INDICATOR_BAD_REQUEST: 'The request is missing some important fields to fetch flexible indicator',
    BOT_ACCESS_NOT_FOUND: 'Do not have access for Bot',
    BOT_NOT_FOUND: 'Bot not found',

    BOT_MODULE_ACCESS_NOT_FOUND: 'Do not have access for Bot module',
    MODULE_VALIDATE_UNHANDLED: 'An unexpected error occurred while validating module'
};
