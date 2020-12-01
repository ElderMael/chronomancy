import {Arguments, Argv} from "yargs";
import {Database, ISqlite} from 'sqlite'
import {parseDate} from "chrono-node";
import chalk from "chalk";
import {DatabaseArg} from "../types/types";

interface StartArgs {
    readonly at: string;
    readonly type: string;
    readonly notes: string[];
}

export const command = [
    'in <type> <notes...>',
];

export const aliases = [
    'i',
];

export const describe = `Create a task within the current context`;

export function builder(yargs: Argv<StartArgs>): Argv {
    return yargs.option('at', {
        default: 'now',
        description: 'a human parseable start date e.g. now, 10 minutes ago, etc.',
        type: 'string',
    }).positional('type', {
        description: 'type of the task',
        type: 'string',
    }).positional('notes', {
        description: 'task descriptions',
        type: 'string'
    });
}

export async function addNewEntry(database: Database,
                                  type: string,
                                  notes: string,
                                  startTime: Date,
                                  timesheet: number): Promise<ISqlite.RunResult> {

    return database
        .run(`
            INSERT INTO tasks(task_type, notes, start_time, timesheet_id )
            VALUES(:type,:notes,:startTime,:timesheetId)
            `, {
            ':type': type,
            ':notes': notes,
            ':startTime': startTime,
            ':timesheetId': timesheet
        });

}


export const handler = async function handleStartCommand(args: Arguments<StartArgs & DatabaseArg>): Promise<any> {
    const timestamp = parseDate(args.at, new Date());
    const result = await args.database.get<{ current_timesheet: number }>(`SELECT current_timesheet FROM Meta`);

    const timesheetId = result?.current_timesheet || 1;

    await args.database.run(`UPDATE Meta SET current_timesheet = :timesheetId WHERE id = 1`, {
        ':timesheetId': timesheetId
    });

    return addNewEntry(args.database,
        args.type.toUpperCase(),
        args.notes.join(' ').trim(),
        timestamp,
        timesheetId as number
    ).then((result) => {
        args.database.run(`UPDATE Meta SET current_task = :taskId WHERE id = 1`, {
            ':taskId': result.lastID
        });
        console.log(chalk.green('New task started.'));
    });
}
