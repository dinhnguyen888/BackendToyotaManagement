import { ReactNode, useEffect, useState } from "react";
import React from "react";
import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import Money from '../image/money.png';
import Product from '../image/car.png';
import Employee from '../image/employee.png';
import Agency from '../image/product.png';
import ComposeChart from "../components/conposechart";
import Template from "../template/template";
import { getTotalDaiLy, getTotalDonDatHang, getTotalSanPham, getTotalNhanVien } from "../service/apitotal";
import { Navigate, useNavigate } from "react-router";

interface childProps {
  tieude: string;
  so: number;
  topIcon: ReactNode;
}


const ReportBox: React.FC<childProps> = ({ tieude, so, topIcon }) => {
  return (
    <div className="h-36 w-64 rounded-lg relative mb-11 my-10 shadow-lg bg-zinc-400 ">
      <div className="h-14 w-14 bg-zinc-100 absolute -top-4 mx-4 rounded-lg">
        {topIcon}
      </div>
      <div className="absolute right-0 bg-slate-50 h-full w-2/3 text-right font-serif rounded-e-lg">
        <div className="text-xl tracking-tighter text-gray-500 font-semi mr-3 mt-2">
          {tieude}
        </div>
        <div className="uppercase text-3xl font-mono text-emerald-600 font-bold mr-3 my-1">
          {so}
        </div>
      </div>
    </div>
  );
};

const data = [
  {
    subject: 'Thái độ',
    A: 120,
    B: 110,
    C: 115,
    fullMark: 150,
  },
  {
    subject: 'Kĩ năng',
    A: 98,
    B: 130,
    C: 150,
    fullMark: 150,
  },
  {
    subject: 'Hiệu suất',
    A: 86,
    B: 130,
    C: 150,
    fullMark: 150,
  },
  {
    subject: 'Chất lượng',
    A: 99,
    B: 100,
    C: 150,
    fullMark: 150,
  },
  {
    subject: 'Đóng góp',
    A: 85,
    B: 90,
    C: 100,
    fullMark: 150,
  },
  {
    subject: 'Tốc độ phát triển',
    A: 65,
    B: 85,
    C: 80,
    fullMark: 150,
  },
];

function EmployeeChart() {
  return (
    <RadarChart cx={300} cy={150} outerRadius={100} width={500} height={400} data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="subject" />
      <PolarRadiusAxis angle={30} domain={[0, 150]} />
      <Radar name="Bao" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
      <Radar name="Khanh" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
      <Radar name="Dinh" dataKey="C" stroke="pink" fill="pink" fillOpacity={0.6} />
      <Legend />
    </RadarChart>
  );
}

const Report: React.FC = () => {
  const [totalDaiLy, setTotalDaiLy] = useState(0);
  const [totalDonDatHang, setTotalDonDatHang] = useState(0);
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalEmployee, setTotalEmployee] = useState(0);
  const navigate = useNavigate()
const handledaily = () =>{
  navigate("/daily")
}
const handlesanpham = () =>{
  navigate("/danhsach")
}
const handledondathang = () =>{
  navigate("/donhang")
}
const handlenhanvien = () =>{
  navigate("/nhanvien")
}


  useEffect(() => {
    const fetchData = async () => {
      try {
        const daiLyCount = await getTotalDaiLy();
        const donDatHangCount = await getTotalDonDatHang();
        const productCount = await getTotalSanPham();
        const employeeCount = await getTotalNhanVien();

        setTotalDaiLy(daiLyCount);
        setTotalDonDatHang(donDatHangCount);
        setTotalProduct(productCount);
        setTotalEmployee(employeeCount);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Template>
        <h1 className="mt-28 font-sans font-bold text-2xl text-black ml-4 shadow-sm">Báo cáo </h1>
        <div className="flex justify-between mx-auto ">
          <ReportBox tieude={`Total Agency`} so={totalDaiLy} topIcon={<img src={Agency}  onClick={handledaily}/>} />
          <ReportBox tieude={`Total order`} so={totalDonDatHang} topIcon={<img src={Money} onClick={handledondathang} />} />
          <ReportBox tieude={`Total product`} so={totalProduct} topIcon={<img src={Product} onClick={handlesanpham} />} />
          <ReportBox tieude={`Total Employee`} so={totalEmployee} topIcon={<img src={Employee}  onClick={handlenhanvien}/>} />
        </div>
        {/* <div className="bg-slate-100 rounded-lg">
          <h1 className="ml-11 uppercase font-serif mb-10 font-bold text-red-500">Doanh số và sản phẩm</h1>
          <div className="flex justify-center">
            <Chartpie />
            <div className="float-right w-full h-56">
              <p>Chú thích:</p>
              <div className="flex justify-start">
                <div className="rounded-sm w-8 h-4 mt-1 mr-3" style={{ backgroundColor: '#8884d8' }}></div>
                <p>% doanh số bán hàng ứng với mỗi xe</p>
              </div>
              <div className="flex justify-start">
                <div className="rounded-sm w-8 h-4 mt-1 mr-3" style={{ backgroundColor: '#82ca9d' }}></div>
                <p>Xe còn tồn kho</p>
              </div>
            </div>
          </div>
        </div> */}
        <div className="bg-slate-100 rounded-lg my-11">
          <h1 className="font-bold uppercase ml-11 font-serif mb-8 text-blue-500">Đánh giá nhân viên</h1>
          <div className="flex justify-center shadow-sm">
            <ComposeChart />
            <EmployeeChart />
          </div>
        </div>
      </Template>
    </>
  );
}

export default Report;
