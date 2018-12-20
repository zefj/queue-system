/* tslint:disable:object-literal-key-quotes */
import { expect } from 'chai';
import 'mocha';

import incrementIdentifier from '../ticket-numbering';

describe('ticket identifier incrementor', () => {
    it('throws if identifier doesn\'t match the mask', () => {
        expect(() => incrementIdentifier('BB100', /^([0-9]{1,4})$/g, 0)).to.throw();
    });

    it('throws on incorrect group index', () => {
        expect(() => incrementIdentifier('BB100', /^([A-Z]{0,3})([0-9]{1,4})$/g, 0)).to.throw();
    });

    it('throws if the result doesn\'t match the mask', () => {
        expect(() => incrementIdentifier('BB99', /^([A-Z]{0,3})([0-9]{1,2})$/g, 1)).to.throw();
    });

    const runIncrements = (identifiers, mask?, group?) => {
        for (const key in identifiers) {
            if (identifiers.hasOwnProperty(key)) {
                const value = identifiers[key];
                expect(incrementIdentifier(key, mask, group)).to.equal(value);
            }
        }
    };

    it('handles incrementation with default mask and incrementGroup for simple identifiers', () => {
        const identifiers = {
            '0': '1',
            '9': '10',
            '00': '01',
            '09': '10',
            '99': '100',
            '100': '101',
            '199': '200',
            '999': '1000',
            '1000': '1001',
        };

        runIncrements(identifiers);
    });

    it('increments unprefixed identifiers', () => {
        const identifiers = {
            '0': '1',
            '9': '10',
            '00': '01',
            '09': '10',
            '99': '100',
            '100': '101',
            '199': '200',
            '999': '1000',
            '1000': '1001',
        };

        const mask = /^([0-9]{1,4})$/g;

        runIncrements(identifiers, mask, 0);
    });

    it('increments prefixed identifiers', () => {
        const identifiers = {
            'B0': 'B1',
            'B9': 'B10',
            'B00': 'B01',
            'B09': 'B10',
            'B99': 'B100',
            'B100': 'B101',
            'B199': 'B200',
            'B999': 'B1000',
            'B1000': 'B1001',
        };

        const mask = /^([A-Z]{0,3})([0-9]{1,4})$/g;

        runIncrements(identifiers, mask, 1);
    });

    it('increments prefixed and suffixed identifiers', () => {
        const identifiers = {
            'X0D': 'X1D',
            'X9D': 'X10D',
            'X00D': 'X01D',
            'X09D': 'X10D',
            'X99D': 'X100D',
            'X100D': 'X101D',
            'X199D': 'X200D',
            'X999D': 'X1000D',
            'X1000D': 'X1001D',
        };

        const mask = /^([A-Z]{0,3})([0-9]{1,4})(D)$/g;

        runIncrements(identifiers, mask, 1);
    });

    it('increments the correct match group', () => {
        const identifiers = {
            'X-0D': 'X-1D',
            'X-9D': 'X-10D',
            'X-00D': 'X-01D',
            'X-09D': 'X-10D',
            'X-99D': 'X-100D',
            'X-100D': 'X-101D',
            'X-199D': 'X-200D',
            'X-999D': 'X-1000D',
            'X-1000D': 'X-1001D',
        };

        const mask = /^([A-Z]{0,3})(-)([0-9]{1,4})(D)$/g;

        runIncrements(identifiers, mask, 2);
    });
});
