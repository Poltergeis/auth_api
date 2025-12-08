export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface RegisterAdultStudentRequestDTO {
  email: string;
  password: string;
  name: string;
  semester: string;
  state: string;
}

export interface RegisterTutorRequestDTO {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface RegisterMinorStudentRequestDTO {
  email: string;
  name: string;
  semester: string;
  state: string;
  birthdate: string;
  relationship: string;
  tutorId: string;
}

export interface AuthResponseDTO {
  user: {
    id: string;
    email: string;
    name: string;
    userType: 'tutor' | 'student';
    createdAt: Date;
  };
  token: string;
}

export interface TutorResponseDTO {
  tutor: {
    id: string;
    email: string;
    name: string;
    phone: string;
    createdAt: Date;
  };
  token: string;
}

export interface StudentResponseDTO {
  student: {
    id: string;
    email: string;
    name: string;
    semester: string;
    state: string;
    tutorId: string | null;
    createdAt: Date;
  };
}
