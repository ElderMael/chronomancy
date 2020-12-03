import {Task} from "../types/types";
import dayjs from "dayjs";
import chalk from "chalk";
import {getBorderCharacters, table} from "table";

export function printEntries(timesheet: string, entries: Task[]) {
    const titles = ['DAY', 'START', 'END', 'DURATION', 'TYPE', 'NOTES'];


    const rows = entries.map((e) => {
        const diff = dayjs(e?.end_time ? e.end_time : dayjs()).diff(e.start_time);
        const duration = dayjs.duration(diff);

        return [
            dayjs(e.start_time).format('ddd MMM DD, YYYY'),
            dayjs(e.start_time).format('hh:mm:ss A'),
            e?.end_time ? dayjs(e.end_time).format('hh:mm:ss A') : '',
            `${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`,
            e.task_type,
            e.notes,
        ];
    }).map((e, index, tasks) => {
        const [day, ...rest] = e;

        if (day === tasks[index - 1]?.[0]) {
            return ['', ...rest];
        }

        return [...e];
    });

    console.log(chalk.green(`Timesheet: ${timesheet}`));
    console.log(table([titles, ...rows], {
        border: getBorderCharacters(`void`),
        columnDefault: {
            paddingLeft: 0,
            paddingRight: 2
        },
        drawHorizontalLine: () => {
            return false
        }
    }));
}