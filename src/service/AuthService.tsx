import axios, { AxiosResponse } from "axios";

const API_URL = "http://localhost:4000";

interface User {
    userID: string,
    userPassword: string,
    schoolCode: string,
}

interface UserResponse {
    data: {
        strToken: object,
        schoolName: string,
        userName: string,
        userTypeID: number,
    },
    message: string,
}

export const login = async(userData: User): Promise<any> => {
    try {
        const { data }: AxiosResponse<UserResponse> = await axios.post(
            `${API_URL}/api/Logon/login`,
            userData,
        )
        if(data?.data) {
            return data.data
        } else {
            throw new Error(data.message)
        }
    } catch(e) {
        handleError(e);
        throw e;
    }
}

const handleError = (error: any) => {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data?.message || error.message);
    } else {
      console.error("Unexpected error:", error.message);
    }
  };