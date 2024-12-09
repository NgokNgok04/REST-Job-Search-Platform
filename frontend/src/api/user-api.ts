/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIResponse, LoginProps } from "@/types";
import client from "@/utils/axiosClient";

export const UserAPI = {
  getSelf: async () => {
    try {
      const response = await client.get("/profil/self");
      return response.data.body;
    } catch (error) {
      throw (error as any)?.response?.data.body;
    }
  },
  getUserData: async (userId: number) => {
    try {
      const response = await client.get(`/profil/${userId}`);
      return response.data.body;
    } catch (error) {
      throw (error as any)?.response?.data;
    }
  },
  login: async (payload: LoginProps) => {
    try {
      const response = await client.post<APIResponse>("/login", payload);
      return response.data;
    } catch (err) {
      throw (err as any)?.response?.data;
    }
  },
  logout: async () => {
    try {
      const response = await client.post<APIResponse>("/logout");

      return response.data;
    } catch (error) {
      throw (error as any)?.response?.data;
    }
  },
};
