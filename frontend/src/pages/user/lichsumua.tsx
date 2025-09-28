import React, { useEffect, useState } from 'react';
import { Table, message, Modal, Form, Input, Button, Avatar } from 'antd';
import { DingdingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getDonDatHang, deleteDonDatHang, editDonDatHang, DonDatHang } from '../../service/apidondathang';
import { createBaoDuong } from '../../service/apibaoduong'; // Import the createBaoDuong function

const History: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DonDatHang[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(false);
  const [isDepositModalVisible, setIsDepositModalVisible] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<DonDatHang | null>(null);
  const [isMaintenanceModalVisible, setIsMaintenanceModalVisible] = useState<boolean>(false); // State for maintenance modal

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const maKhachHang = localStorage.getItem('maKhachHang');
    if (maKhachHang) {
      try {
        const orders = await getDonDatHang(Number(maKhachHang));
        setData(orders);  
      } catch (error) {
        message.error('Không thể lấy dữ liệu đơn đặt hàng');
      } finally {
        setLoading(false);
      }
    } else {
      message.error('Không tìm thấy mã khách hàng');
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDonDatHang(id);
      message.success('Xóa đơn đặt hàng thành công');
      window.location.reload()
      fetchOrders();
    } catch (error) {
      message.error('Bạn đã đặt cọc đơn này rồi, không thể xóa được');
    }
  };

  const handleOpenAuthen = () => {
    setVisible(!visible);
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      localStorage.removeItem('login');
      navigate('/');
    }
  };

  const handleOpenHistory = () => {
    navigate('/lichsumua');
  };

  const handleDeposit = (order: DonDatHang) => {
    setSelectedOrder(order);
    setIsDepositModalVisible(true);
  };

  const handleDepositSubmit = async (values: { datCoc: number }) => {
    if (selectedOrder) {
      const updatedOrder: DonDatHang = { ...selectedOrder, datCoc: values.datCoc };
      try {
        await editDonDatHang(selectedOrder.maDonHang!, updatedOrder);
        localStorage.setItem("maDonHang",selectedOrder.maDonHang!.toString())
        message.success('Cập nhật tiền đặt cọc thành công');
        setIsDepositModalVisible(false);
        fetchOrders();
      } catch (error) {
        message.error('Cập nhật tiền đặt cọc thất bại');
      }
    }
  };

  const handleCancel = () => {
    setIsDepositModalVisible(false);
    setIsMaintenanceModalVisible(false); // Close maintenance modal
  };

  const handleRequestMaintenance = (order: DonDatHang) => {
    setSelectedOrder(order);
    setIsMaintenanceModalVisible(true); // Open maintenance modal
  };

  const handleConfirmMaintenance = async () => {
    const maKhachHang = localStorage.getItem('maKhachHang');
    const maDonHang =localStorage.getItem('maDonHang')
    if (maKhachHang && selectedOrder) {
      try {
        await createBaoDuong({ maKhachHang: Number(maKhachHang),maDonHang:Number(maDonHang) });
        message.success('Yêu cầu bảo dưỡng thành công');
        setIsMaintenanceModalVisible(false);
      } catch (error) {
        message.error('Yêu cầu bảo dưỡng thất bại, bạn đã yêu cầu rồi');
      }
    } else {
      message.error('Không tìm thấy mã khách hàng hoặc đơn hàng');
    }
  };

  const columns = [
    {
      title: 'Mã Đơn Hàng',
      dataIndex: 'maDonHang',
      key: 'maDonHang',
    },
    {
      title: 'Mã Khách Hàng',
      dataIndex: 'maKhachHang',
      key: 'maKhachHang',
    },
    {
      title: 'Mã Xe',
      dataIndex: 'maXe',
      key: 'maXe',
    },
    {
      title: 'Ngày Đặt Hàng',
      dataIndex: 'ngayDatHang',
      key: 'ngayDatHang',
    },
    {
      title: 'Đặt Cọc',
      dataIndex: 'datCoc',
      key: 'datCoc',
    },
    {
      title: 'Chính Sách Bảo Hành',
      dataIndex: 'chinhSachBaoHanh',
      key: 'chinhSachBaoHanh',
    },
    {
      title: 'Tổng Tiền',
      dataIndex: 'tongTien',
      key: 'tongTien',
    },
    {
      title: 'Số Lượng',
      dataIndex: 'soLuong',
      key: 'soLuong',
    },
    {
      title: 'Tình Trạng Đơn Hàng',
      dataIndex: 'tinhTrangDonHang',
      key: 'tinhTrangDonHang',
      render: (status: number) => (status === 0 ? 'Đang Giao Hàng' : 'Đã Giao Hàng'),
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (text: string, record: DonDatHang) => (
        <>
          {record.tinhTrangDonHang === 0 ? (
            <Button type="link" onClick={() => handleDeposit(record)}>Đặt Cọc</Button>
          ) : (
            <Button type="link" onClick={() => handleRequestMaintenance(record)}>Yêu Cầu Bảo Dưỡng</Button>
          )}
          <Button type="link" danger onClick={() => handleDelete(record.maDonHang!)}>Xóa</Button>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="bg-slate-900 shadow-2 h-16 w-full text-center mb-11 float-right">
        <div className="flex justify-between container mx-auto h-full items-center">
          <DingdingOutlined className="ml-1 text-white text-4xl" />
          <div className="flex items-center">
            <p className="uppercase mr-3 text-pretty text-sm font-mono font-bold text-blue-300 space-x-2">user</p>
            <Avatar className="mr-4 bg-white cursor-pointer" onClick={handleOpenAuthen}></Avatar>
          </div>
        </div>
      </div>

      {visible && (
        <div className="absolute top-0 right-0 bg-gray-700 p-5 my-16 z-10">
          <button className="text-blue-200 hover:underline" onClick={handleLogout}>
            Đăng xuất
          </button>
          <br />
          <button className="text-green-200 hover:underline" onClick={handleOpenHistory}>
            Xem lịch sử mua
          </button>
        </div>
      )}

      <div style={{ padding: '30px' }}>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="maDonHang"
        />
      </div>

      <Modal
        title="Nhập tiền đặt cọc"
        visible={isDepositModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form onFinish={handleDepositSubmit}>
          <Form.Item
            name="datCoc"
            label="Số tiền đặt cọc"
            rules={[{ required: true, message: 'Vui lòng nhập số tiền đặt cọc' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Xác nhận yêu cầu bảo dưỡng"
        visible={isMaintenanceModalVisible}
        onCancel={handleCancel}
        onOk={handleConfirmMaintenance}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>Bạn có chắc muốn yêu cầu bảo dưỡng cho đơn hàng này?</p>
      </Modal>
    </>
  );
};

export default History;
