import axios from 'axios';

export interface BaoDuong {
  maKhachHang: number;
  maNhanVien?: number;
  maDonHang: number | string;
}

const apiUrl = "http://localhost:5192/api/BaoDuong";

export const getAllBaoDuong = async (): Promise<BaoDuong[]> => {
  const response = await axios.get<BaoDuong[]>(apiUrl);
  return response.data;
};

export const getBaoDuongById = async (maKhachHang: number): Promise<BaoDuong> => {
  const response = await axios.get<BaoDuong>(`${apiUrl}/${maKhachHang}`);
  return response.data;
};

export const createBaoDuong = async (baoDuong: BaoDuong): Promise<void> => {
  await axios.post(apiUrl, baoDuong);
};

export const updateBaoDuong = async (
  maKhachHang: number,
  data: { maKhachHang: number; maNhanVien: number; maDonHang: number | string }
) => {
  try {
    const response = await axios.put(`${apiUrl}/${maKhachHang}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBaoDuong = async (maKhachHang: number): Promise<void> => {
  await axios.delete(`${apiUrl}/${maKhachHang}`);
};
