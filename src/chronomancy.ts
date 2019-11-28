import Entry from './model/entry';
import { parseDate } from 'chrono-node';

function chronomancy(args: string[]): Entry[] {
    if(args.length == 0) {
        const version = require('../package.json').version;
        console.log(`chronomancy version ${version}`);
    }

    if (args[0] === 'start') {

        if (args[1] === '--at') {
            const [ command, , startTime, story, notes ] = args;

            const startDate = parseDate(startTime);

            return [
                new Entry(startDate, story, notes)
            ];
        }

        const [ command, story, notes ] = args;

        return [
            new Entry(new Date(), story, notes)
        ];

    }

    return [];
}

export default chronomancy;
