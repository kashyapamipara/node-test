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

    public description: string;

    constructor(public successCode: string, data?: any, description?: string, public statusCode: number = 200) {
        if (data) {
            this.data = data;
        }
        if (description) {
            this.description = description;
        }
    }

    static apiSuccess({
        code,
        data,
        description,
        statusCode,
    }: {
        code: string;
        data?: any;
        description?: string;
        statusCode?: number;
    }): SuccessResponse {
        return new SuccessResponse(code, data, description, statusCode);
    }
}
