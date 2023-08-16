import { Istudent } from "./istudent";
import { Itutor } from "./itutor";

export interface Irequest {
    id: number;
    tutor_id: number;
    student_id: number;
    tutor: Itutor;
    student: Istudent;
}
