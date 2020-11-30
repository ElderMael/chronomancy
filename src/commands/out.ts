import {Arguments, Argv} from "yargs";
import {Database, ISqlite} from 'sqlite'
import {parseDate} from "chrono-node";
import chalk from "chalk";
import {DatabaseArg, Task} from "../types/types";

interface StartArgs {
    readonly at: string;
    readonly type: string;
    readonly notes: string[];
}

export const command = [
    'out',
];

export const aliases = [
    'o',
];

export const describe = `Completes the current task.`;

export function builder(yargs: Argv<StartArgs>): Argv {
    return yargs.option('at', {
        default: 'now',
        description: 'a human parseable start date e.g. now, 10 minutes ago, etc.'
    });
}

export async function completeEntry(database: Database,
                                    entryId: number,
                                    endTime: Date): Promise<ISqlite.RunResult> {
    return database
        .run(`
            UPDATE tasks
            SET end_time = :endTime
            WHERE id = :entryId
        `, {
            ':endTime': endTime,
            ':entryId': entryId
        });

}


export const handler = async function handleStartCommand(args: Arguments<StartArgs & DatabaseArg>): Promise<any> {
    const endDate = parseDate(args.at, new Date());

    const currentEntryId = await args.database.get<number>(`SELECT current_task
                                                            FROM Meta
                                                            WHERE id = 1`);

    const entry = await args.database.get<Task>(`SELECT *
                                                 FROM Tasks
                                                 WHERE id = :entryId`, {
        ':entryId': currentEntryId
    });

    if (!entry?.end_time) {
        console.log(chalk.red('Task was already completed'));
        return Promise.reject();
    }

    return completeEntry(args.database, currentEntryId as number, endDate)
        .then(() => {
            console.log(chalk.green('Task completed.'));
        });
}
