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

            if (startTime == null) {
                throw new Error("Start time cannot be null");
            }

            if (story == null) {
                throw new Error("Story cannot be null");
            }

            if (notes == null) {
                throw new Error("Notes cannot be null");
            }

            const startDate = parseDate(startTime);

            console.log(command);

            return [
                new Entry(startDate, story, notes)
            ];
        }

        const [ command, story, notes ] = args;

        console.log(command);

        if (story == null) {
            throw new Error("Story cannot be null");
        }

        if (notes == null) {
            throw new Error("Notes cannot be null");
        }

        return [
            new Entry(new Date(), story, notes)
        ];

    }

    return [];
}

export default chronomancy;
