import React, { useEffect, useState } from 'react';
import { Table, message, Button, Modal, Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { getAllBaoDuong, deleteBaoDuong, updateBaoDuong } from '../service/apibaoduong';
import { getAllUsers, NhanVien } from '../service/apinhanvien';
import Template from "../template/template";
import type { BaoDuong } from '../service/apibaoduong';

const BaoDuongList: React.FC = () => {
  const [dataSource, setDataSource] = useState<BaoDuong[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [nhanVienList, setNhanVienList] = useState<NhanVien[]>([]);
  const [selectedNhanVien, setSelectedNhanVien] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    fetchMaintenanceRequests();
    fetchNhanVienList();
  }, []);

  const fetchMaintenanceRequests = async () => {
    try {
      const data = await getAllBaoDuong();
      setDataSource(data);
    } catch (error) {
      message.error('Failed to fetch maintenance requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchNhanVienList = async () => {
    try {
      const data = await getAllUsers();
      setNhanVienList(data);
    } catch (error) {
      message.error('Failed to fetch user list');
    }
  };

  const onDeleteRequest = (record: BaoDuong) => {
    Modal.confirm({
      title: "Are you sure you want to delete this maintenance request?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteBaoDuong(record.maKhachHang);
          setDataSource((prev) => prev.filter((item) => item.maKhachHang !== record.maKhachHang));
          message.success('Maintenance request deleted successfully');
        } catch (error) {
          message.error('Failed to delete maintenance request');
        }
      },
    });
  };

  const onSelectNhanVien = (value: number, maKhachHang: number) => {
    setSelectedNhanVien((prev) => ({
      ...prev,
      [maKhachHang]: value,
    }));
  };

  const onSubmit = async (maKhachHang: number, maDonHang: number | string) => {
    const selectedNhanVienId = selectedNhanVien[maKhachHang];
    if (selectedNhanVienId === undefined) {
      message.warning('Please select an employee before submitting.');
      return;
    }

    try {
      await updateBaoDuong(maKhachHang, { maKhachHang, maNhanVien: selectedNhanVienId, maDonHang });
      message.success('Maintenance request updated successfully');
      fetchMaintenanceRequests(); // Refresh the list after update
    } catch (error) {
      message.error('Failed to update maintenance request');
    }
  };

  const columns = [
    {
      key: '1',
      title: 'Mã khách hàng',
      dataIndex: 'maKhachHang',
    },
    {
      key: '2',
      title: 'Mã đơn hàng',
      dataIndex: 'maDonHang',
    },
    {
      key: '3',
      title: 'Mã nhân viên',
      dataIndex: 'maNhanVien',
      render: (maNhanVien: number | undefined, record: BaoDuong) => (
        <Select
          value={selectedNhanVien[record.maKhachHang] ?? maNhanVien}
          style={{ width: 240 }}
          onChange={(value) => onSelectNhanVien(value, record.maKhachHang)}
        >
          {nhanVienList.map((nhanVien) => (
            <Select.Option key={nhanVien.maNhanVien} value={nhanVien.maNhanVien}>
              {nhanVien.hoVaTen}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      key: '4',
      title: 'Actions',
      render: (record: BaoDuong) => (
        <>
          <DeleteOutlined
            onClick={() => onDeleteRequest(record)}
            style={{ color: 'red', marginLeft: 12 }}
          />
          <Button onClick={() => onSubmit(record.maKhachHang, record.maDonHang)}>Submit</Button>
        </>
      ),
    },
  ];

  return (
    <Template>
      <div className="App mt-24">
        <h1 className="font-bold text-2xl">Yêu cầu bảo dưỡng</h1>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey="maKhachHang"
        />
      </div>
    </Template>
  );
};

export default BaoDuongList;
