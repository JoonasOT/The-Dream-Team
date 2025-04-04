/* Lib imports */
import { DragEndEvent } from "@dnd-kit/core";

/* Types */
import { DragID } from "../../types/Dragging";
import { LabelType } from "../../types/Label";
import { Student, StudentWithLocation } from "../../types/Student";

/* Components, services & etc. */
import { addLabelIfMissing, getStudentLabels, removeLabelFromStudent } from "../../services/student/label.service";
import { parseDragIDs } from "./drag-helpers";

// Just a utility function atm
const columnIdToLabelType = (id: number): LabelType | undefined => {
    switch (id) {
        case 0: return LabelType.Applied;
        case 1: return undefined;
        case 2: return LabelType.Selected;
        default: throw new Error("Invalid column ID!");
    }
}

export const markStudentAsApplied = (projectName: string, studentId: Student["id"]): void => {
    addLabelIfMissing(studentId, { isType: LabelType.Applied, contains: { content: projectName }});
}

const updateStudentSelectLabel = (projectName: string, studentId: Student["id"], oldColumn: LabelType | undefined, newColumn: LabelType | undefined): void => {
    if (oldColumn === newColumn) return;
    if (oldColumn !== LabelType.Selected && newColumn !== LabelType.Selected) return;

    if (oldColumn === LabelType.Selected) {
        removeLabelFromStudent(studentId, { isType: LabelType.Selected, contains: { content: projectName }});
        return;
    }
    addLabelIfMissing(studentId, { isType: LabelType.Selected, contains: { content: projectName }});
}

export const updateMovedStudentsLabels = (projectName: string, event: DragEndEvent): void => {
    const { dragging, target } = parseDragIDs(event)
    if (!target) return;

    const oldColumn = columnIdToLabelType(dragging.columnId);
    const newColumn = columnIdToLabelType(target.columnId);

    updateStudentSelectLabel(projectName, dragging.cardId!, oldColumn, newColumn);
}

export const updateAllStudentLabels = (projectName: string, students: StudentWithLocation[]): void => {
    students.forEach(wrappedStudent => {
        const wasSelected = getStudentLabels(wrappedStudent.student.id, LabelType.Selected)
                            .filter(label => label.content === projectName)
                            .length > 0;
        const isNowSelected = columnIdToLabelType(wrappedStudent.column);

        updateStudentSelectLabel(projectName, wrappedStudent.student.id, wasSelected? LabelType.Selected : undefined, isNowSelected? LabelType.Selected : undefined);
    })
}