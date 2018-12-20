declare namespace Express {
    interface Request {
        session?: any;
        locals?: any;
    }
}

// Required for mixins, eg.: const TimestampsMixin = <T extends Constructor<Model>>(superclass: T) => {
type Constructor<T> = new(...args: any[]) => T;
