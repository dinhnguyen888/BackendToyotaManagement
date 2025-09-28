import axios from 'axios';

export interface Account {
  id: number;
  nguoiDung: string;
  matKhau: string;
  vaiTro: string;
}

const apiUrl = 'http://localhost:5192/api/XacThuc'; // Đường dẫn của API

export const getAllUsers = async (): Promise<Account[]> => {
  const response = await axios.get<Account[]>(apiUrl);
  return response.data;
};

export const getUserById = async (id: number): Promise<Account> => {
  const response = await axios.get<Account>(`${apiUrl}/${id}`);
  return response.data;
};

export const createUser = async (user: Account): Promise<Account> => {
  const response = await axios.post<Account>(apiUrl, user);
  return response.data;
};

export const updateUser = async (id: number, user: Account): Promise<Account> => {
  const response = await axios.put<Account>(`${apiUrl}/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axios.delete<void>(`${apiUrl}/${id}`);
};
