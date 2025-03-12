import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export type APIUser = {
  id: string;
  username: string;
  avatar: string;
};

export async function getCurrentUser() {
  const { data } = await axios.get<APIUser>(`${API_URL}/auth`, {
    withCredentials: true,
  });

  return data;
}
