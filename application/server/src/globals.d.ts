declare namespace Express {
    interface Request {
        session?: any;
        locals?: any;
    }
}

// Required for mixins, eg.: const TimestampsMixin = <T extends Constructor<Model>>(superclass: T) => {
type Constructor<T> = new(...args: any[]) => T;

declare module NodeJS {
    interface Global {
        logger: import('winston').Logger;
    }
}

declare const logger: import('winston').Logger;
