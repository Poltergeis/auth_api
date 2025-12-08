export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  semester?: string;
  state?: string;
  createdAt: Date;
  hasCompletedEvaluation: boolean;
  isTutor: boolean;
  phone?: string;
  relationship?: string;
  minorName?: string;
  minorEmail?: string;
  minorBirthdate?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  semester?: string;
  state?: string;
  isTutor: false;
}

export interface TutorRegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
  relationship: string;
  isTutor: true;
  minorName: string;
  minorEmail: string;
  minorBirthdate: string; // Debería ser un Date o string ISO
  minorSemester: string;
  minorState: string;
}