// apidondathang.ts

import axios from 'axios';

export interface DonDatHang {
  maDonHang?: number;
  maKhachHang: number |string;
  maXe: number |string;
  ngayDatHang: string;
  datCoc: number;
  chinhSachBaoHanh: string;
  tongTien: number;
  soLuong: number;
  tinhTrangDonHang: number;
  xe?: XeDto;
}

export interface XeDto {
  maXe: number |string ;
  uuDai: string ;
  giaBan: number;
  tenXe: string;
  maDaiLy: number;
  thongSoKiThuat: string;
  loaiXe: string;
  thumbnail: string;
  moTa: string;
  soLuong: number;
}

const url = "http://localhost:5192/api/DonDatHang";
const geturl = "http://localhost:5192/api/DonDatHang/khachhang/";

export const getAllDonDatHang = async (): Promise<DonDatHang[]> => {
  const response = await axios.get(url);
  return response.data;
};

export const getDonDatHang = async (maKhachHang: number): Promise<DonDatHang[]> => {
  const response = await axios.get(`${geturl}${maKhachHang}`);
  return response.data;
};


export const addDonDatHang = async (donDatHang: DonDatHang): Promise<DonDatHang> => {
  const response = await axios.post(url, donDatHang);
  return response.data;
};

export const editDonDatHang = async (id: number, donDatHang: DonDatHang): Promise<void> => {
  await axios.put(`${url}/${id}`, donDatHang);
};

export const deleteDonDatHang = async (id: number): Promise<void> => {
  await axios.delete(`${url}/${id}`);
};
