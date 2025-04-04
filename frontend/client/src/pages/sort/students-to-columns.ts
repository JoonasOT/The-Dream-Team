/* Types */
import { Student, StudentWithColumn, StudentWithLocation } from "../../types/Student";
import { ColumnCreation, StudentToColMapper } from "../../types/Columns";
import { Project } from "../../types/Project";

/* Components, services & etc. */
import { getStudentStatus } from "../../services/student/student.service";
import { getStudentLocation } from "../../services/student/location.service";

const createRowAdder = () => {
  const numPerCol: Array<number> = [0, 0, 0];
  return (studentW: StudentWithColumn): StudentWithLocation => {
    const row = numPerCol[studentW.column!];
    numPerCol[studentW.column!]++;
    return { ...studentW, row };
  };
};

const addInitialLocation = (projectId: Project["id"], students: Student[]): StudentWithLocation[] => {
    return students.map(student => { return { student, column: getStudentLocation(projectId, student.id) } })
                   .map(createRowAdder())
}

const addLocationBasedOnRequest = (projectId: Project["id"], students: Student[]): StudentWithLocation[] => {
    // TODO: Update this function after figured out getStudentStatus' func. signature
    projectId;
    return students.map(student => { return { student, column: getStudentStatus(student) } })
                   .map(createRowAdder())
}

export const addStudentsLocations = (usecase: ColumnCreation): StudentToColMapper => {
    switch (usecase) {
        case ColumnCreation.Initial:
            return addInitialLocation;
        case ColumnCreation.Request:
            return addLocationBasedOnRequest;
        default:
            throw new Error("Invalid column creation value!");
    }
}