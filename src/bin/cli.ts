import yargs, {Arguments} from "yargs";
import {open} from "sqlite";
import {homedir} from "os";
import sqlite3 from "sqlite3";

const [, , ...args] = process.argv;

yargs(args)
    .middleware(createDatabaseIfNecessary)
    .commandDir('../commands')
    .help()
    .parse();

async function createDatabaseIfNecessary(argv: Arguments): Promise<Arguments> {
    return open({
        filename: `${homedir()}/.chronomancy/database.db`,
        driver: sqlite3.Database
    }).then((db) => {
        const schema = db.exec(`
            CREATE TABLE IF NOT EXISTS Meta
            (
                id                INTEGER PRIMARY KEY,
                current_timesheet INTEGER,
                current_task      INTEGER
            );

            CREATE TABLE IF NOT EXISTS Timesheets
            (
                id   INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            );

            INSERT OR IGNORE INTO Timesheets(id, name)
            VALUES (1, 'DEFAULT');

            INSERT OR IGNORE INTO Meta(id, current_timesheet)
            VALUES (1, 1);

            CREATE TABLE IF NOT EXISTS Tasks
            (
                id           INTEGER   NOT NULL PRIMARY KEY AUTOINCREMENT,
                task_type    TEXT      NOT NULL,
                notes        TEXT      NULL,
                start_time   TIMESTAMP NOT NULL,
                end_time     TIMESTAMP NULL,
                timesheet_id INTEGER   NOT NULL,
                FOREIGN KEY (timesheet_id) REFERENCES Timesheets (id)
            );
        `);

        return Promise.all([
            Promise.resolve(db),
            schema,
        ]);
    }).then((results) => {
        const [db] = results;
        argv.database = db;

        return argv;
    });
}