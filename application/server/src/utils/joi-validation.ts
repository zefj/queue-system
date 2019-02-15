import { SchemaLike } from 'joi';

const joi = require('joi');

export interface ValidationErrorDescription {
    [name: string]: {
        type: string,
        key: string,
        message: string,
    };
}

export class JoiValidationError extends global.Error {
    description: ValidationErrorDescription;
    // tslint:disable-next-line:variable-name
    status_code: number;

    constructor(description: ValidationErrorDescription) {
        super('Validation error');
        this.description = description;
        this.status_code = 403;
    }
}

export const validateData = (data, schema: SchemaLike): ValidationErrorDescription | null => {
    const options = { abortEarly: false };
    const errors = joi.validate(data, schema, options);
    return errors.error ?
        buildUsefulErrorObject(errors.error.details) :
        null;
};

export const validationInvariant = (data, schema: SchemaLike) => {
    const options = { abortEarly: false };
    const errors = joi.validate(data, schema, options);

    if (errors.error) {
        throw new JoiValidationError(buildUsefulErrorObject(errors.error.details));
    }

    return null;
};

const buildUsefulErrorObject = (errors): ValidationErrorDescription => {
    const usefulErrors = {};
    errors.map((error) => {
        if (!usefulErrors.hasOwnProperty(error.path.join('_'))) {
            usefulErrors[error.path.join('_')] = {
                type: error.type,
                key: `error.${error.path.join('_')}.${error.type}`,
                message: error.message,
            };
        }
    });
    return usefulErrors;
};
