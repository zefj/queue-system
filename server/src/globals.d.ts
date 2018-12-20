declare namespace Express {
    interface Request {
        session?: any;
        locals?: any;
    }
}

// type Constructor<T> = new(...args: any[]) => T;
