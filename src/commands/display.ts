import {Arguments, Argv} from "yargs";
import {DatabaseArg, Task} from "../types/types";
import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration';
import relativeTime from "dayjs/plugin/relativeTime";
import {printEntries} from "../format/table";

dayjs.extend(duration);
dayjs.extend(relativeTime);


interface StartArgs {
    readonly at: string;
    readonly type: string;
    readonly notes: string[];
}

export const command = [
    'display',
];

export const aliases = [
    'd',
];

export const describe = `Display the current timesheet.`;

export function builder(yargs: Argv<StartArgs>): Argv {
    return yargs;
}


export const handler = async function handleDisplayCommand(args: Arguments<StartArgs & DatabaseArg>): Promise<any> {
    const meta = await args.database
        .get<{ current_timesheet: number }>(`SELECT current_timesheet
                                             FROM Meta
                                             WHERE id = 1`);

    if (!meta) {
        return Promise.reject(new Error('No active timesheet found.'));
    }

    const timesheet = await args.database.get<{ name: string }>(`SELECT *
                                                                 FROM Timesheets
                                                                 WHERE id = :timesheetId`, {
        ':timesheetId': meta.current_timesheet
    })

    const entries = await args.database.all<Task[]>(`SELECT *
                                                     FROM Tasks
                                                     WHERE timesheet_id = :timesheetId
                                                     ORDER BY start_time`, {
        ':timesheetId': meta.current_timesheet
    });

    printEntries(timesheet?.name as string, entries);

    return Promise.resolve();
}
