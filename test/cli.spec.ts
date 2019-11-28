import chronomancy from '../src/chronomancy';
import Entry from '../src/model/entry';

test('should return version if no arguments given', () => {

    const version = require('../package.json').version;

    console.log = jest.fn(msg => process.stdout.write(msg + '\n'))

    chronomancy([]);

    expect(console.log).toBeCalledWith(`chronomancy version ${version}`);

});

describe('start command', () => {
    // when
    const entries: Entry[]  = chronomancy([
            "start",
            "TECH",
            "Update Docs For App"
    ]);

    // then
    test('should start task given a story number and task description', () => {
        expect(entries.length).toBe(1);
    });

    test('should start task with the given parameters', () => {
        const [ entry ] = entries;
        const now = new Date();

        expect( now > entry.start ).toBe(true);
    });

});
