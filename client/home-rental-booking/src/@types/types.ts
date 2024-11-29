export type FormDataState = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    confirmPassword: string;
    profileImage: File | null;
    [key: string]: string | File | null; // Allow dynamic keys
  };