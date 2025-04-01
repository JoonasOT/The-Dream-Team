/* Types */
import { AuthToken } from "../../types/Auth";
import { ColumnType } from "../../types/Columns";
import { Project } from "../../types/Project";
import { Student } from "../../types/Student";

/* Components, services & etc. */
import { callAPI, USE_SERVER } from "../api/api.service";
import { defaultStudents } from "./default-students";

// TODO: Request student status (if in team or not etc.) from ML
export const getStudentStatus = (student: Student): ColumnType => {
    student;

    // Gets random column type:
    const columnTypes = Object.keys(ColumnType)
      .map(n => Number.parseInt(n))
      .filter(n => !Number.isNaN(n));

    return columnTypes[Math.floor(Math.random() * columnTypes.length)];
}

export const getStudents = (projectID: Project["id"], token: AuthToken): Promise<Student[]> => {
    
    const errorHandler = (reason: any): Student[] => {
        console.log("[GET STUDENTS ERROR] --- " + reason);
        return [];
    }

    return USE_SERVER ? callAPI<Student[]>(`/projects/${projectID}/students`, token).catch(errorHandler) : Promise.resolve(defaultStudents);
}
