import {Task} from "../types/types";
import dayjs from "dayjs";
import chalk from "chalk";
import {getBorderCharacters, table} from "table";
import {Duration} from "dayjs/plugin/duration";


function zeroPad(num: number, numZeros: number): string {
    const n = Math.abs(num);
    const zeros = Math.max(0, numZeros - Math.floor(n).toString().length);

    let zeroString = Math.pow(10, zeros).toString().substr(1);
    if (num < 0) {
        zeroString = '-' + zeroString;
    }

    return zeroString + n;
}

function durationToString(duration: Duration): string {
    return `${zeroPad(duration.hours(), 2)}h ${zeroPad(duration.minutes(), 2)}m ${zeroPad(duration.seconds(), 2)}s`;
}

function calculateTotals(prev: any, curr: any, index: number, arr: any[]): { daySum: Duration, rows: string[] } {

    const [day, start, end, duration, type, notes] = curr;

    const previousDay = prev.rows[index - 1] || [];

    const d = duration as Duration;

    const isNotLastElement = index < (arr.length - 1);
    const thereIsPreviousDay = previousDay[0] === undefined;
    const nextDayIsTheSame = day === arr[index + 1]?.[0];

    if (isNotLastElement && (nextDayIsTheSame || thereIsPreviousDay)) {
        return {
            daySum: prev.daySum.add(duration as Duration),
            rows: [
                ...prev.rows,
                [
                    day as string,
                    start as string,
                    end as string,
                    durationToString(d),
                    type as string,
                    notes as string
                ]
            ],
        }
    }

    return {
        daySum: dayjs.duration(0, 'm'),
        rows: [
            ...prev.rows,
            [
                day as string,
                start as string,
                end as string,
                durationToString(d),
                type as string,
                notes as string
            ],
            [
                '',
                '',
                'TOTAL',
                durationToString(prev.daySum.add(duration as Duration)),
                '',
                ''
            ],
        ],
    };

}

export function printEntries(timesheet: string, entries: Task[]) {
    const titles = ['DAY', 'START', 'END', 'DURATION', 'TYPE', 'NOTES'];


    const displayableTable: any = entries.map((e) => {
        const diff = dayjs(e?.end_time ? e.end_time : dayjs()).diff(e.start_time);

        const duration = dayjs.duration(diff);

        return [
            dayjs(e.start_time).format('ddd MMM DD, YYYY'),
            dayjs(e.start_time).format('hh:mm:ss A'),
            e?.end_time ? dayjs(e.end_time).format('hh:mm:ss A') : '',
            duration,
            e.task_type,
            e.notes,
        ];
    }).reduce(calculateTotals, {
        daySum: dayjs.duration(0, 'm'),
        rows: [] as string[]
    });

    console.log('');
    console.log(chalk.green(`Timesheet: ${timesheet}`));
    console.log('');
    console.log(table([titles, ...displayableTable.rows], {
        border: getBorderCharacters(`void`),
        columnDefault: {
            paddingLeft: 0,
            paddingRight: 2,
        },
        drawHorizontalLine: () => {
            return false;
        }
    }));
}