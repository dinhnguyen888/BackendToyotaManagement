import axios, { AxiosResponse } from 'axios';

const url = "http://localhost:5192/api/DaiLy";
const url2 = "http://localhost:5192/api/DonDatHang";
const url3 = "http://localhost:5192/api/Xe";
const url4 = "http://localhost:5192/api/NhanVien";

 interface DaiLy {
    maDaiLy?: number | string;
    tenDaiLy: string;
    diaChi: string;
    email: string;
    sdt: string;
  }
  interface DonDatHang {
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
  interface XeDto {
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
    interface NhanVien {
        maNhanVien?: number;
        
        hieuSuatLamViec: string;
        hoVaTen: string;
        diaChi: string;
        sdt: string;
        luong: string;
        lichLamViec: string;
        chucVu: string;
       
    }
    interface Xe {
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
  

export const getTotalDaiLy = async (): Promise<number> => {
     const response = await axios.get<DaiLy[]>(`${url}`);
    return response.data.length;
    
};

export const getTotalSanPham = async (): Promise<number> => {
    const response = await axios.get<Xe[]>(`${url3}`);
   return response.data.length;
   
};

export const getTotalDonDatHang = async (): Promise<number> => {
    const response = await axios.get<DonDatHang[]>(`${url2}`);
   return response.data.length;
   
};

export const getTotalNhanVien = async (): Promise<number> => {
    const response = await axios.get<NhanVien[]>(`${url4}`);
   return response.data.length;
   
};