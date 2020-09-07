export class NotPermittedError extends global.Error {
    error: string;
    /* tslint:disable-next-line:variable-name */
    status_code: number;

    constructor(error: string, message: string) {
        super(message);
        this.error = error;
        this.status_code = 403;
    }
}
