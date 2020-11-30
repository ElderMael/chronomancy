import {addNewEntry} from "../src/commands/in";
import {Database} from "sqlite";
import {completeEntry} from "../src/commands/out";

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

    test('should complete given task', () => {
        // given
        const database = {
            run: jest.fn(() => {
                return Promise.resolve();
            }) as any,
            get: jest.fn(() => {
                return Promise.resolve();
            }) as any,
        } as Database;

        // when
        const result = completeEntry(database, 1, new Date());

        return result;
    });

});