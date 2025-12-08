export interface Tutor {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  phone: string;
  createdAt: Date;
}

export interface TutorRegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
}