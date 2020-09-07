import { ValidationErrorDescription } from '../actions/types';
import { WrappedFormUtils } from 'antd/es/form/Form';
import * as _ from 'lodash';

export const handleJoiErrors = (
    errors: ValidationErrorDescription,
    getFieldValue: WrappedFormUtils['getFieldValue'],
) => {
    let newState = {};

    _.forOwn(errors, (value, key) => {
        newState = {
            ...newState,
            [key]: {
                value: getFieldValue(key),
                errors: [new Error(value.key)], // TODO: l10n
            },
        };
    });

    return newState;
};
