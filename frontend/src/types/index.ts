export type LoginProps = {
  email: string;
  password: string;
};
export type APIResponse = {
  status: boolean;
  message: string;
  body: {
    token: string;
  };
};

export type AuthResponse = {
  username: string;
  id: string;
  name: string;
  profile_photo: string;
};
