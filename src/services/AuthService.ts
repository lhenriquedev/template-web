import { httpClient } from "./httpClient";

interface ISignUpDTO {
  full_name: string;
  role: string;
  email: string;
  password: string;
}

interface ISignInDTO {
  email: string;
  password: string;
}

interface ISignInResponse {
  accessToken: string;
  refreshToken: string;
}

interface IProfileResponse {
  data: {
    id: string;
    full_name: string;
    email: string;
    role: string;
  };
}

export class AuthService {
  static async signUp(body: ISignUpDTO) {
    const { data } = await httpClient.post("/signup", body);
    return data;
  }

  static async signIn(body: ISignInDTO) {
    const { data } = await httpClient.post<ISignInResponse>("/login", body);
    return data;
  }

  static async refreshToken(refreshToken: string) {
    const { data } = await httpClient.post<ISignInResponse>("/refresh-token", {
      refreshToken,
    });
    return data;
  }

  static async getProfile() {
    const { data } = await httpClient.get<IProfileResponse>("/profile");
    return data.data;
  }
}
