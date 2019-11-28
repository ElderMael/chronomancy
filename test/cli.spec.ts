import { chronomancy } from '../src/bin/cli';
import * as chai from 'chai';
import * as sinon from 'sinon';

const assert = chai.assert;

describe('CLI', () => {
    describe('version', () => {
        it('should show the version', () => {
            console.log(process.argv)
            const spy = sinon.spy(console, 'log');
            process.argv = [ 'node', 'cli.ts', 'version' ];

            chronomancy()

            assert(spy.calledWith('0.0.1'))

            spy.restore()
        });
    });
});
