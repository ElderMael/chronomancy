import chronomancy from '../src/chronomancy';


test('should return version if no arguments given', () => {

    const version = require('../package.json').version;

    console.log = jest.fn(msg => process.stdout.write(msg + '\n'))

    chronomancy([]);

    expect(console.log).toBeCalledWith(`chronomancy version ${version}`);

});
