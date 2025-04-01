/* Types */
import { AuthToken } from "../../types/Auth";
import { ColumnType } from "../../types/Columns";
import { Label, LabelContent, LabelType } from "../../types/Label";
import { Project } from "../../types/Project";
import { Student, StudentStorageItem } from "../../types/Student";

/* Components, services & etc. */
import { callAPI, USE_SERVER } from "../api/api.service";
import { defaultStudents } from "./default-students";
import storage from "../storage/storage.service";

// TODO: Get stuff from local storage
export const getStudentLocation = (projectId: Project["id"], studentId: Student["id"]): ColumnType => {
    const saved = storage.get<StudentStorageItem>(`s${studentId}`);
    return saved?.projects?.filter(project => project.projectId === projectId).map(project => project.status)[0] ?? ColumnType.Applied;
}

export const setStudentLocationTo = (location: ColumnType, projectId: Project["id"], studentId: Student["id"]): void => {
    const itemName = `s${studentId}`;
    const mapper = (old: StudentStorageItem) => {
        const oldProjects = old.projects?.filter(project => project.projectId === projectId) ?? [];
        return { ...old, projects: [ ...oldProjects, { projectId, status: location} ] }
    }
    if (!storage.update<StudentStorageItem>(itemName, mapper)) {
        storage.save<StudentStorageItem>({ projects: [{ projectId, status: location }]}, itemName);
    }
}