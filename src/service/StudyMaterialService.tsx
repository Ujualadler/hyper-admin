import { AxiosResponse } from "axios";
import { API_CLIENT } from "../util/ApiClient"

export const createStudyMaterial = async(formData: FormData): Promise<any> => {
    try {
        const { data }: AxiosResponse<any> = await API_CLIENT.post('/api/study-material/create', formData);
        console.log(data);
        if(data?.message === "Created Successfully") {
            return { message: data?.message };
        }
    } catch(e) {
        console.log(e);
    }
}

export const getStudyMaterials = async(): Promise<any> => {
    try {
        const { data }: AxiosResponse<any> = await API_CLIENT.get('/api/study-material');
        if(data) {
            return data?.data;
        }
    } catch(e) {   
        console.log(e);
    }
}

export const deleteStudyMaterial = async(id: string): Promise<any> => {
    try {
        const { data }: AxiosResponse<any> = await API_CLIENT.delete(`/api/study-material/${id}`);
        if(data?.message === "Deleted Successfully") {
            return data?.message;
        }
    } catch(e) {
        console.log(e);
    }
}