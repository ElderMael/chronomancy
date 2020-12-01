import {Arguments, Argv} from "yargs";
import {DatabaseArg, Task} from "../types/types";
import {table} from "table";
import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration';
import relativeTime from "dayjs/plugin/relativeTime";

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

    const entries = await args.database.all<Task[]>(`SELECT *
                                                     FROM Tasks
                                                     WHERE timesheet_id = :timesheetId`, {
        ':timesheetId': meta.current_timesheet
    });

    const titles = ['DAY', 'START', 'END', 'DURATION', 'NOTES'];

    let rows = entries.map(e => {

        let diff = dayjs(e?.end_time ? e.end_time : dayjs()).diff(e.start_time);
        let duration = dayjs.duration(diff);
        return [
            dayjs(e.start_time).format('ddd MMM DD, YYYY'),
            dayjs(e.start_time).format('hh:mm:ss'),
            e?.end_time ? dayjs(e.end_time).format('hh:mm:ss') : '',
            `${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`,
            e.notes,
        ];
    });

    console.log(table([titles, ...rows]));

    return Promise.resolve();
}
