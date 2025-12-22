import { httpClient } from "./httpClient";

interface ISignUpDTO {
  name: string;
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

export class AuthService {
  static async signUp(body: ISignUpDTO) {
    const { data } = await httpClient.post("/sign-up", body);
    return data;
  }

  static async signIn(body: ISignInDTO) {
    const { data } = await httpClient.post<ISignInResponse>("/sign-in", body);
    return data;
  }
  static async refreshToken(refreshToken: string) {
    const { data } = await httpClient.post<ISignInResponse>("/refresh-token", {
      refreshToken,
    });
    return data;
  }
}
