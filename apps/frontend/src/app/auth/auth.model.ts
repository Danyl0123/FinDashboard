export interface User {
  email: string;
  password: string;
}

export interface UserAuth {
  email: string;
  id: number;
  token: string;
}
