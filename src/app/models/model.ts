export interface User {
  id: string;
  firstname:string;
  lastname:string;
  password:string;
  accountType:string;
  creatorconsent:boolean;
  phone:string;
  username: string;
  email: string;
  role: string;
  rememberMe: boolean;
}

export interface signUpDto {
  firstname:string;
  lastname:string;
  password:string;
  accountType:string;
  creatorconsent:boolean;
  phone:string;
  email: string;
}

// Re-export course models for convenience
export * from './course.model';