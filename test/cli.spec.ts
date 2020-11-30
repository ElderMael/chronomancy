import {addNewEntry} from "../src/commands/start";
import {Database} from "sqlite";

describe('Start Command', () => {

    test('should create new entry given types and notes', () => {
        // given
        const database = {
            run: jest.fn(() => {
                return Promise.resolve();
            }) as any,
        } as Database;

        // when
        const result = addNewEntry(database, 'meeting', 'omg', new Date(), 1);

        //then
        return result;
    });

});