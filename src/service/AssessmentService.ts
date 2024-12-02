import axios, { AxiosError, AxiosResponse } from "axios";
import { useAuth } from "../context/AuthContext";
import { API_CLIENT } from "../util/ApiClient";
import { getHeaders } from "../config";

type QuestionType = "multipleChoice" | "singleChoice" | "yesNo" | "descriptive";

interface Option {
  text: string;
  file: File | null;
  filePreview: string | null;
}

interface Question {
  text: string;
  type: QuestionType;
  mark: number;
  options?: Option[];
  correctAnswer: string | string[];
  file?: File | null;
}

const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};

export const getAssessment = async (id: string): Promise<any> => {
  try {
    const { data }: AxiosResponse<any> = await API_CLIENT.get(
      `/quiz/getQuizAdmin?id=${id}`,
      { headers: getHeaders().headers }
    );
    if (data) {
      return data;
    }
    return data; // Add a return for other response cases if needed
  } catch (error) {
    const axiosError = error as AxiosError; // Cast error as AxiosError
    const status = axiosError.response?.status;

    if (!status) return { error: axiosError }; // Handle cases where status may not exist

    if (status === 401 || status === 403) {
      logout(); // Log out if unauthorized
    }

    return { error: axiosError }; // Return error for other cases
  }
};

export const getAllAssessment = async (
  category: string,
  difficulty: string
): Promise<any> => {
  try {
    const { data }: AxiosResponse<any> = await API_CLIENT.get(
      `/quiz/getAllQuiz?id=${category}&difficulty=${difficulty}`,
      { headers: getHeaders().headers }
    );
    if (data) {
      return data;
    }
    return data; // Add a return for other response cases if needed
  } catch (error) {
    const axiosError = error as AxiosError; // Cast error as AxiosError
    const status = axiosError.response?.status;

    if (!status) return { error: axiosError }; // Handle cases where status may not exist

    if (status === 401 || status === 403) {
      logout(); // Log out if unauthorized
    }

    return { error: axiosError }; // Return error for other cases
  }
};

export const postAssessment = async (formData: FormData): Promise<any> => {
  try {
    const { data }: AxiosResponse<any> = await API_CLIENT.post(
      "/quiz/createQuiz",
      formData,
      { headers: getHeaders().headers }
    );
    if (data?.message === "Created Successfully") {
      return data;
    }
  } catch (error) {
    const axiosError = error as AxiosError; // Cast error as AxiosError
    const status = axiosError.response?.status;

    if (!status) return { error: axiosError }; // Handle cases where status may not exist

    if (status === 401 || status === 403) {
      logout(); // Log out if unauthorized
    }

    return { error: axiosError }; // Return error for other cases
  }
};

export const deleteQuestion = async (
  questionId: any,
  id: any
): Promise<any> => {
  try {
    const { data }: AxiosResponse<any> = await API_CLIENT.put(
      "/quiz/delete",
      { questionId, id },
      { headers: getHeaders().headers }
    );
    if (data?.message === "Question deleted successfully") {
      return { message: data?.message };
    }
  } catch (error) {
    const axiosError = error as AxiosError; // Cast error as AxiosError
    const status = axiosError.response?.status;

    if (!status) return { error: axiosError }; // Handle cases where status may not exist

    if (status === 401 || status === 403) {
      logout(); // Log out if unauthorized
    }

    return { error: axiosError }; // Return error for other cases
  }
};

export const deleteAssessment = async (id: any): Promise<any> => {
  try {
    const { data }: AxiosResponse<any> = await API_CLIENT.delete(
      "/quiz/deleteQuiz",
      {
        data: { id }, // Add `id` inside `data`
        headers: getHeaders().headers,
      }
    );

    if (data?.message === "Question deleted successfully") {
      return { message: data?.message };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;

    if (!status) return { error: axiosError }; // Handle cases where status may not exist

    if (status === 401 || status === 403) {
      logout(); // Log out if unauthorized
    }

    return { error: axiosError }; // Return error for other cases
  }
};

export const postEditAssessment = async (formData: FormData): Promise<any> => {
  try {
    const { data }: AxiosResponse<any> = await API_CLIENT.put(
      "/quiz/edit",
      formData,

      { headers: getHeaders().headers }
    );
    if (data?.message === "Question updated successfully") {
      return { message: data?.message };
    }
  } catch (error) {
    const axiosError = error as AxiosError; // Cast error as AxiosError
    const status = axiosError.response?.status;

    if (!status) return { error: axiosError }; // Handle cases where status may not exist

    if (status === 401 || status === 403) {
      logout();
    }

    return { error: axiosError }; // Return error for other cases
  }
};
