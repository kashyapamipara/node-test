export const successCommonCode = {
    CREATED_SUCCESSFULLY: 'CREATED_SUCCESSFULLY',
    DELETED_SUCCESSFULLY: 'DELETED_SUCCESSFULLY',
    UPDATED_SUCCESSFULLY: 'UPDATED_SUCCESSFULLY',
    FETCHED_SUCCESSFULLY: 'FETCHED_SUCCESSFULLY',
    UPLOADED_SUCCESSFULLY: 'UPLOADED_SUCCESSFULLY',
};

export class SuccessResponse {
    public status = 'SUCCESS';

    public data;

    public message: string;

    constructor(public successCode: string, data?: any, message?: string, public statusCode: number = 200) {
        if (data) {
            this.data = data;
        }
        if (message) {
            this.message = message;
        }
    }

    static apiSuccess({
        code,
        data,
        message,
        statusCode,
    }: {
        code: string;
        data?: any;
        message?: string;
        statusCode?: number;
    }): SuccessResponse {
        return new SuccessResponse(code, data, message, statusCode);
    }
}
