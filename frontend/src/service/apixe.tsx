import axios, { AxiosResponse } from 'axios';

const url = "http://localhost:5192/api/Xe";

export interface Xe {
    maXe?: number | string;
    tenXe: string;
    uuDai: number;
    giaBan: number;
    thongSoKiThuat: string;
    loaiXe: string;
    thumbnail: string;
    moTa: string;
    soLuong: number;
    maDaiLy: number;
    
  }

export const getAllXe = async (): Promise<Xe[]> => {
    try {
        const response = await axios.get<Xe[]>(`${url}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch Xe: ${error}`);
    }
}

export const addXe = async (xe: Xe): Promise<Xe> => {
    try {
        const response = await axios.post<Xe>(url, xe);
        
        return response.data;
    } catch (error) {
        throw new Error(`Failed to add Xe: ${error}`);
    }
}

export const editXe = async (id: string, xe: Xe): Promise<Xe> => {
    try {
        const response = await axios.put<Xe>(`${url}/${id}`, xe);
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
