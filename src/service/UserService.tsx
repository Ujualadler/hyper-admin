import axios, { AxiosResponse } from "axios";
import { useAuth } from "../context/AuthContext";
import { API_CLIENT } from "../util/ApiClient";

interface ListResponse {
  data: [
    {
      _id: string;
      userID: string;
      userPassword: string;
      schoolCode: string;
      schoolName: string;
      userName: string;
      logo: string;
      userType: string;
    }
  ];
}

interface CreateRequest {
  userID: string;
  userPassword: string;
  userName: string;
  userType?: string;
  permissions?: Array<number>;
}

export const list = async (): Promise<any> => {
  try {
    const { data }: AxiosResponse<ListResponse> = await API_CLIENT.get(
      "/user/list"
    );
    console.log("data:", data.data);
    if (data?.data) {
      return data?.data;
    } else {
      // throw new Error(data.message);
    }
  } catch (e) {
    console.log(e);
  }
};

export const createUser = async (user: CreateRequest): Promise<any> => {
  try {
    const { data }: AxiosResponse<any> = await API_CLIENT.post(
      "/api/Logon/register",
      user
    );
    if (data?.message === "created successfuly") {
      return data?.message;
    }
  } catch (e) {
    console.log(e);
  }
};

export const deleteUser = async (id: string): Promise<any> => {
  try {
    const { data }: AxiosResponse<any> = await API_CLIENT.delete(
      `/api/Logon/user/delete/${id}`
    );
    if (data?.message === "Deleted Successfully") {
      return data?.message;
    }
  } catch (e) {
    console.log(e);
  }
};
