import axios, { AxiosResponse } from 'axios';

const url = "http://localhost:5192/api/DaiLy";

export interface DaiLy {
    maDaiLy?: number | string;
    tenDaiLy: string;
    diaChi: string;
    email: string;
    sdt: string;
   
  
    
   
    
  }

  export const getTotalDaiLy = async (): Promise<number> => {
     const response = await axios.get<DaiLy[]>(`${url}`);
    return response.data.length;
};
export const getAllXe = async (): Promise<DaiLy[]> => {
    try {
        const response = await axios.get<DaiLy[]>(`${url}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch DaiLy: ${error}`);
    }
}

export const addXe = async (xe: DaiLy): Promise<DaiLy> => {
    try {
        const response = await axios.post<DaiLy>(url, xe);
        
        return response.data;
    } catch (error) {
        throw new Error(`Failed to add DaiLy: ${error}`);
    }
}

export const editXe = async (id: string, xe: DaiLy): Promise<DaiLy> => {
    try {
        const response = await axios.put<DaiLy>(`${url}/${id}`, xe);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to edit Xe: ${error}`);
    }
}

export const deleteXe = async (id: string): Promise<void> => {
    try {
        await axios.delete<void>(`${url}/${id}`);
    } catch (error) {
        throw new Error(`Failed to delete Xe: ${error}`);
    }
}
