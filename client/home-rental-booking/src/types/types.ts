export interface FormDataState {
  firstname: string;
  lastname: string;
  Email: string;
  password: string;
  confirmPassword: string;
  profileImage: null | File;
  message?: string; 
}

export interface UserState {
  user: string | null;
  token: string | null;
  profileImagePath: string | null;
}