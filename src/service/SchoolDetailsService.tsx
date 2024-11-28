import axios, { AxiosResponse } from "axios";
import { useAuth } from "../context/AuthContext";
import { API_CLIENT } from "../util/ApiClient";
import { getHeaders } from "../config";

export const uploadPPT = async (formData: FormData): Promise<any> => {
  try {
    const { data }: AxiosResponse<any> = await API_CLIENT.post(
      "/api/PPT",
      formData
    );
    if (data?.message === "Created Successfully") {
      return { message: data?.message };
    }
  } catch (e) {
    console.log(e);
  }
};

export const editPPT = async(formData: FormData): Promise<any> => {
    try {
        const { data }: AxiosResponse<any> = await API_CLIENT.post('/api/PPT/edit', formData);
        if(data?.message === "Edited Successfully" ) {
            return { message: data?.message };
        }
    } catch(e) {
        console.log(e);
    }
}

export const getCategories = async(): Promise<any> => {
    try {
        const { data }: AxiosResponse<any> = await API_CLIENT.get('/api/PPT/categories');
        if(data?.data) {
            return { data: data?.data };
        }
    } catch(e) {
        console.log(e);
    }
  
};

export const getPPTList = async (): Promise<any> => {
  try {
    const { data }: AxiosResponse<any> = await API_CLIENT.get("/api/PPT", {
      headers: getHeaders().headers,
    });
    if (data?.data) {
      return { data: data?.data };
    }
  } catch (e: any) {
    // Log the error for debugging
    console.log("Error in getPPTList:", e);

    // You can check if `e` contains Axios error details and throw a specific message
    if (e.response) {
      throw {
        status: e.response.status,
        message: e.response.data?.message || "Error fetching PPT list",
      };
    } else {
      throw new Error(e.message || "Unknown error occurred");
    }
  }
};
