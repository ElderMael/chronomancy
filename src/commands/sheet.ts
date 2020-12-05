import {Arguments, Argv} from "yargs";
import {DatabaseArg} from "../types/types";
import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration';
import relativeTime from "dayjs/plugin/relativeTime";
import chalk from "chalk";
import {Database} from "sqlite";

dayjs.extend(duration);
dayjs.extend(relativeTime);


interface TimesheetArgs {
    readonly timesheet: string | undefined;
}

export const command = [
    'sheet [timesheet]',
];

export const aliases = [
    's',
];

export const describe = `Switch the current timesheet or create it if necessary`;

export function builder(yargs: Argv<TimesheetArgs>): Argv {
    return yargs.positional('timesheet', {
        description: 'timesheet name to switch to. If it does not exist, it will be created.',
        type: "string",
    });
}


async function insertNewTimesheet(database: Database, name: string): Promise<number> {
    return (await database.run(`INSERT INTO Timesheets(name)
                                VALUES (:timesheet)`, {
        ':timesheet': name,
    })).lastID as number;
}

export const handler = async function handleTimesheetCommand(args: Arguments<TimesheetArgs & DatabaseArg>): Promise<any> {

    if (!args.timesheet) {

        const currentSheet = await args.database.get<{ name: string }>(`SELECT name
                                                                        FROM Timesheets
                                                                        WHERE Timesheets.id = (SELECT current_timesheet FROM Meta WHERE Meta.id = 1)`);
        console.log(`Current timesheet: ${chalk.green(currentSheet?.name)}`)

        return Promise.resolve();
    }

    const timesheet = await args.database.get<{ id: number, name: string }>(`SELECT id, name
                                                                             FROM Timesheets
                                                                             WHERE name = :timesheetName`, {
        ':timesheetName': args.timesheet,
    });

    const currentTimesheet: number = timesheet?.id ?? await insertNewTimesheet(args.database, args.timesheet);

    await args.database.run(`UPDATE Meta
                             SET current_timesheet = :currentTimesheet
                             WHERE id = 1`, {
        ':currentTimesheet': currentTimesheet,
    });

    console.log(`Switching to timesheet: ${chalk.green(args.timesheet)}`);

}
