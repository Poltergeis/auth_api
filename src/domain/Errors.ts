export class InvalidCredentialsError extends Error {
  constructor(message: string = 'Credenciales inválidas') {
    super(message);
    this.name = 'InvalidCredentialsError';
  }
}

export class UserAlreadyExistsError extends Error {
  constructor(message: string = 'El usuario ya existe') {
    super(message);
    this.name = 'UserAlreadyExistsError';
  }
}

export class TutorNotFoundError extends Error {
  constructor(message: string = 'Tutor no encontrado') {
    super(message);
    this.name = 'TutorNotFoundError';
  }
}
