import {Database} from "sqlite";

interface DatabaseArg {
    database: Database;
}

interface Task {
    id: number;
    task_type: string;
    notes: string;
    start_time: string;
    end_time: string;
    timesheet_id: string;
}