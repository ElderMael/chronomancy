import chronomancy from '../src/chronomancy';
import Entry from '../src/model/entry';

describe('start command', () => {
    const entries: Entry[] = chronomancy([
        "start",
        "TECH",
        "Update Docs For App"
    ]);

    test('should start task given a story number and task description', () => {
        expect(entries.length).toBe(1);
    });

    test('should start task with the given parameters', () => {
        const [entry] = entries;
        const now = new Date();

        if (entry == null) {
            throw new Error('Entry cannot be null');
        }

        expect(now > entry.start).toBe(true);
    });

});


describe('date parsing', () => {
    const entries: Entry[] = chronomancy([
        "start",
        "--at",
        "10 AM",
        "TECH",
        "Update Docs For App"
    ]);

    test('should start task with given time when specified', () => {

        const [entry] = entries;

        if (entry == null) {
            throw new Error('Entry cannot be null');
        }

        expect(entry.start.getHours()).toBe(10);
        expect(entry.start.getDay()).toBe(new Date().getDay());
    });

});
