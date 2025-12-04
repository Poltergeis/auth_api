export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface RegisterAdultRequestDTO {
  email: string;
  password: string;
  name: string;
  semester?: string;
  state?: string;
}

export interface RegisterTutorRequestDTO {
  email: string;
  password: string;
  name: string;
  phone: string;
  relationship: string;
  minorName: string;
  minorEmail: string;
  minorBirthdate: string;
  minorSemester: string;
  minorState: string;
}

export interface AuthResponseDTO {
  user: {
    id: string;
    email: string;
    name: string;
    isTutor: boolean;
    createdAt: Date;
  };
  token: string;
}