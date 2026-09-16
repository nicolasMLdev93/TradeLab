import axiosClient from "./axiosClient";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
}

export interface AuthResponse {
  ok: boolean;
  user: AuthUser;
  accessToken: string;
}

export interface RefreshResponse {
  ok: boolean;
  accessToken: string;
}

export interface MeResponse {
  ok: boolean;
  user: AuthUser;
}

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await axiosClient.post<AuthResponse>("/auth/login", payload);

  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
};

export const register = async (
  payload: RegisterPayload,
): Promise<AuthResponse> => {
  const { data } = await axiosClient.post<AuthResponse>(
    "/auth/register",
    payload,
  );

  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
};

export const logout = async (): Promise<void> => {
  try {
    await axiosClient.post("/auth/logout");
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }
};

export const refresh = async (): Promise<string> => {
  const { data } = await axiosClient.post<RefreshResponse>("/auth/refresh");

  localStorage.setItem("accessToken", data.accessToken);

  return data.accessToken;
};

export const getCurrentUser = async (): Promise<AuthUser> => {
  const { data } = await axiosClient.get<MeResponse>("/auth/me");
  return data.user;
};

export const isAuthenticated = (): boolean => {
  return Boolean(localStorage.getItem("accessToken"));
};

export const getStoredUser = (): AuthUser | null => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

export const clearSession = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};
