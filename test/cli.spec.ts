import chronomancy from '../src/chronomancy';


test('should return version if no arguments given', () => {

    console.log = jest.fn(msg => process.stdout.write(msg + '\n'))

    chronomancy([]);

    expect(console.log).toBeCalledWith('Hello, World!');

});
