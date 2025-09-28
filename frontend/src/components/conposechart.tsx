import React, { useEffect, useState } from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { getAllUsers, NhanVien } from "../service/apinhanvien";

const ComposeChart: React.FC = () => {
  const [nhanVienData, setNhanVienData] = useState<{ name: string; hieuSuat: string }[]>([]);

  useEffect(() => {
    const fetchNhanVienData = async () => {
      try {
        const data = await getAllUsers();
        const formattedData = data.map((nv) => ({
          name: nv.hoVaTen,
          hieuSuat: nv.hieuSuatLamViec
        }));
        setNhanVienData(formattedData);
      } catch (error) {
        console.error("Failed to fetch nhan vien data:", error);
      }
    };

    fetchNhanVienData();
  }, []);

  return (
    <ComposedChart
      layout="vertical"
      width={600}
      height={400}
      data={nhanVienData}
      margin={{
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      }}
    >
      <CartesianGrid stroke="#f5f5f5" />
      <XAxis type="category" />
      <YAxis dataKey="name" type="category" scale="band" />
      <Tooltip />
      <Legend />
      <Bar dataKey="hieuSuat" barSize={20} fill="#413ea0" />
    </ComposedChart>
  );
}

export default ComposeChart;
