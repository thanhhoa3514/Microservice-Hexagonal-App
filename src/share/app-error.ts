import { ZodError } from "zod";
import { Response } from "express";


export class AppError extends Error {
    private statusCode: number = 500;
    private rootCause?: Error;
    private detail?: Record<string, any> = {};
    private logMessage?: string;
    private constructor(err: Error) {
        super(err.message);
    }

    // factory method(design pattern)
    static from(err: Error, statusCode: number = 500) {
        const appError = new AppError(err);
        appError.statusCode = statusCode;
        return appError;
    }


    // wrapper method (design pattern)
    wrap(rootCause: Error): AppError {
        const appError = AppError.from(this, this.statusCode);
        appError.rootCause = rootCause;
        return appError;
    }


    // setter chain method (design pattern)
    withDetail(key: string, value: any): AppError {
        if (!this.detail) {
            this.detail = {};
        }
        this.detail[key] = value;
        return this;
    }
    withLog(logMessage: string): AppError {
        this.logMessage = logMessage;
        return this;
    }

    toJSON(isProduction: boolean = true) {
        const rootCause = this.getRootCause();
        return isProduction ? {
            message: this.message,
            statusCode: this.statusCode,
            detail: this.detail,

        } : {
            message: this.message,
            statusCode: this.statusCode,
            detail: this.detail,
            rootCause: rootCause ? rootCause : this.message,
            logMessage: this.logMessage
        }
    }
    getRootCause(): Error | null {
        if (this.rootCause) {
            return this.rootCause instanceof AppError ? this.rootCause.getRootCause() : this.rootCause;
        }
        return null;
    }
    getStatusCode(): number {
        return this.statusCode;
    }
}

// util error function
export const responseError = (res: Response, err: Error) => {
    const isProduction = process.env.NODE_ENV === 'production';
    // !isProduction && console.log(err.stack);
    if (err instanceof AppError) {
        const appError = err as AppError;

        res.status(appError.getStatusCode()).json(appError.toJSON(isProduction));
        return;
    }

    if (err instanceof ZodError) {
        const zodError = err as ZodError;
        const appError = ErrValidRequest.wrap(zodError);

        zodError.issues.forEach((issue) => {
            appError.withDetail(issue.path.join('.'), issue.message);
        });

        res.status(appError.getStatusCode()).json(appError.toJSON(isProduction));
        return;
    }
    const appError = ErrInternalServer.wrap(err);
    res.status(appError.getStatusCode()).json(appError.toJSON(isProduction));
    return;

}
export const ErrValidRequest = AppError.from(new Error('Invalid request'), 400);
export const ErrInternalServer = AppError.from(new Error('Internal server error'), 500);
export const ErrNotFound = AppError.from(new Error('Not found'), 404);
export const ErrUnauthorized = AppError.from(new Error('Unauthorized'), 401);
export const ErrForbidden = AppError.from(new Error('Forbidden'), 403);
export const ErrBadRequest = AppError.from(new Error('Bad request'), 400);
export const ErrUnprocessableEntity = AppError.from(new Error('Unprocessable entity'), 422);
export const ErrConflict = AppError.from(new Error('Conflict'), 409);
export const ErrTooManyRequests = AppError.from(new Error('Too many requests'), 429);
export const ErrServiceUnavailable = AppError.from(new Error('Service unavailable'), 503);