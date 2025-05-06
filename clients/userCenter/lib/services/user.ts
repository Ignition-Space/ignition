import request from '../utils/request';

const prefix = 'user/auth';
const UserPrefix = 'user/user';

export interface IUser {
  id?: string;
  username: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface IResponse<T> {
  data: T;
  message: string;
  code: number;
}

export const getUserInfo = () => {
  return request.get<IResponse<IUser>>(`${prefix}/token/info`);
};

export const updateUserInfo = (params: Partial<IUser>) => {
  return request.post<IUser>(`${prefix}/update`, params);
};

export const login = (params: { username: string; password: string }) => {
  return request.post<string>(`${prefix}/login`, params);
};

export const logout = () => {
  return request.post(`${prefix}/logout`);
};
