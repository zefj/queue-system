import * as winston from 'winston';

export const makeLogger = (app) => {
    const logger = winston.createLogger({
        format: winston.format.json(),
    });

    winston.addColors({
        error: 'bold white redBG',
        warn: 'bold red',
        info: 'bold white greenBG',
        verbose: 'magenta whiteBG',
        debug: 'bold yellow',
        silly: 'bold yellow',
    });

    // TODO: add production-level logging
    if (process.env.NODE_ENV !== 'production') {
        logger.add(new winston.transports.Console({
            level: 'silly',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.label({ label: app }),
                winston.format.printf(info => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`),
            ),
        }));
    }

    return logger;
};
