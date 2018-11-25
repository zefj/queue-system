import * as _ from 'lodash';

/**
 * Validates an identifier with a regex expression
 * @param {string} number
 * @param {regex} mask
 */
export const identifierValid = (number, mask) => {
    return number.match(mask) !== null;
};

/**
 * Attempts to increment a complex identifier, based on a regex expression.
 * The regex expression MUST have all the components enclosed in groups.
 * @param {string} identifier
 * @param {regex} mask
 * @param {number | null} incrementGroup Match group to increment, counting from 0. Eg: for identifier AB001D and regex
 * /^([A-Z]{0,3})([0-9]{1,4})(D)$/g, the incrementGroup is 1.
 */
const incrementIdentifier = (identifier, mask = /(.*)/g, incrementGroup = 0): string => {
    if (!identifierValid(identifier, mask)) {
        throw new Error('Identifier does not match the mask.');
    }

    const match = mask.exec(identifier) as string[]; // safe assert because of identifierValid call above

    match.shift();
    const number = match[incrementGroup]; // number always at the end

    const intNumber = parseInt(number, 10);

    if (isNaN(intNumber)) {
        throw new Error(`Got NaN while trying to parse the match at position ${incrementGroup}. Make sure you specified the correct group index.`);
    }

    const incrementedNumber = (intNumber + 1).toString();

    match[match.indexOf(number)] = _.padStart(incrementedNumber, number.length, 0);
    const result = match.join('');

    if (!identifierValid(result, mask)) {
        throw new Error(`The result ${result} does not match the mask. You might've ran out of available identifiers.`);
    }

    return result;
};

export default incrementIdentifier;
