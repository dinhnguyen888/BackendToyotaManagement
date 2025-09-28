import axios from 'axios';

const url = "http://localhost:5192/api/NhanVien";



export interface NhanVien {
    maNhanVien?: number;
    
    hieuSuatLamViec: string;
    hoVaTen: string;
    diaChi: string;
    sdt: string;
    luong: string;
    lichLamViec: string;
    chucVu: string;
   
}
export const getAllUsers = async (id?: string): Promise<NhanVien[]> => {
    try {
        const response = await axios.get<NhanVien[]>(`${url}/${id || ''}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch users: ${error}`);
    }
}

export const addUser = async (user: NhanVien): Promise<NhanVien> => {
    try {
        const response = await axios.post<NhanVien>(url, user);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to add user: ${error}`);
    }
}

export const editUser = async (maNhanVien: number, user: NhanVien): Promise<NhanVien> => {
    try {
        const response = await axios.put<NhanVien>(`${url}/${maNhanVien}`, user);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to edit user: ${error}`);
    }
}

export const deleteUser = async (id: string): Promise<void> => {
    try {
        await axios.delete<void>(`${url}/${id}`);
    } catch (error) {
        throw new Error(`Failed to delete user: ${error}`);
    }
}
