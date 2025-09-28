import axios, { AxiosResponse } from 'axios';

const url = "http://localhost:5192/api/KhachHang";

export interface KhachHang {
    maKhachHang?: number | string;
    hoVaTen: string;
    diaChi: string;
    sdt: string;
    email: string;
}

export const getAllKhachHang = async (): Promise<KhachHang[]> => {
    try {
        const response = await axios.get<KhachHang[]>(`${url}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch KhachHang: ${error}`);
    }
}

export const addKhachHang = async (khachHang: KhachHang): Promise<KhachHang> => {
    try {
        const response = await axios.post<KhachHang>(url, khachHang);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to add KhachHang: ${error}`);
    }
}

export const editKhachHang = async (id: string, khachHang: KhachHang): Promise<KhachHang> => {
    try {
        const response = await axios.put<KhachHang>(`${url}/${id}`, khachHang);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to edit KhachHang: ${error}`);
    }
}

export const deleteKhachHang = async (id: string): Promise<void> => {
    try {
        await axios.delete<void>(`${url}/${id}`);
    } catch (error) {
        throw new Error(`Failed to delete KhachHang: ${error}`);
    }
}
