import Entry from './model/entry';

function chronomancy(args: string[]): Entry[] {
    if(args.length == 0) {
        const version = require('../package.json').version;
        console.log(`chronomancy version ${version}`);
    }

    if (args[0] === 'start') {

        const [ command, story, notes ] = args;

        return [
            new Entry(new Date(), story, notes)
        ];
    }

    return [];
}

export default chronomancy;
