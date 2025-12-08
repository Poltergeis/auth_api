export interface Student {
  id: string;
  email: string;
  name: string;
  passwordHash: string | null;
  semester: string;
  state: string;
  birthdate: string | null;
  relationship: string | null;
  createdAt: Date;
  hasCompletedEvaluation: boolean;
  tutorId: string | null;
}

export interface AdultStudentRegisterData {
  email: string;
  password: string;
  name: string;
  semester: string;
  state: string;
}

export interface MinorStudentRegisterData {
  email: string;
  name: string;
  semester: string;
  state: string;
  birthdate: string;
  relationship: string;
  tutorId: string;
}