export interface FormDataState {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  profileImage: null | File;
  message?: string; 
}