import { Button, Table, Modal, Input, message } from "antd";
import { useState, useEffect } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAllDonDatHang, addDonDatHang, editDonDatHang, deleteDonDatHang, DonDatHang } from '../service/apidondathang';
import Template from "../template/template";

const Order: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editingOrder, setEditingOrder] = useState<DonDatHang | null>(null);
  const [addingOrder, setAddingOrder] = useState<DonDatHang | null>(null);
  const [dataSource, setDataSource] = useState<DonDatHang[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<DonDatHang | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const orders = await getAllDonDatHang();
      setDataSource(orders);
    } catch (error) {
      message.error('Failed to fetch orders');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredDataSource = dataSource.filter(order =>
    Object.values(order).some(value =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns = [
    {
      key: "1",
      title: "ID",
      dataIndex: "maDonHang",
    },
    {
      key: "2",
      title: "Mã Khách Hàng",
      dataIndex: "maKhachHang",
    },
    {
      key: "3",
      title: "Mã Xe",
      dataIndex: "maXe",
    },
    {
      key: "4",
      title: "Ngày Đặt Hàng",
      dataIndex: "ngayDatHang",
    },
    {
      key: "5",
      title: "Đặt Cọc",
      dataIndex: "datCoc",
    },
    {
      key: "6",
      title: "Chính Sách Bảo Hành",
      dataIndex: "chinhSachBaoHanh",
    },
    {
      key: "7",
      title: "Tổng Tiền",
      dataIndex: "tongTien",
    },
    {
      key: "8",
      title: "Số Lượng",
      dataIndex: "soLuong",
    },
    {
      key: "9",
      title: "Tình Trạng Đơn Hàng",
      dataIndex: "tinhTrangDonHang",
      render: (status: number, record: DonDatHang) => (
        <Button
          type="primary"
          onClick={() => handleChangeOrderStatus(record)}
        >
          {status === 0 ? "Đang Giao Hàng" : "Đã Giao Hàng"}
        </Button>
      ),
    },
    {
      key: "10",
      title: "Actions",
      render: (record: DonDatHang) => (
        <>
          <EditOutlined
            onClick={() => {
              onEditOrder(record);
            }}
          />
          <DeleteOutlined
            onClick={() => {
              onDeleteOrder(record);
            }}
            style={{ color: "red", marginLeft: 12 }}
          />
        </>
      ),
    },
  ];

  const onAddOrder = () => {
    setIsAdding(true);
    setAddingOrder({
      maDonHang: 0,
      maKhachHang: "",
      maXe: "",
      ngayDatHang: "",
      datCoc: 0,
      chinhSachBaoHanh: "",
      tongTien: 0,
      soLuong: 0,
      tinhTrangDonHang: 0,
    });
  };

  const onDeleteOrder = (record: DonDatHang) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa đơn hàng này?",
      okText: "Có",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteDonDatHang(record.maDonHang!);
          setDataSource((prev) => prev.filter((order) => order.maDonHang !== record.maDonHang));
          message.success('Order deleted successfully');
        } catch (error) {
          message.error('Failed to delete order');
        }
      },
    });
  };

  const onEditOrder = (record: DonDatHang) => {
    setIsEditing(true);
    setEditingOrder({ ...record });
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingOrder(null);
  };

  const resetAdding = () => {
    setIsAdding(false);
    setAddingOrder(null);
  };

  const handleEditOk = async () => {
    if (editingOrder) {
      try {
        const updatedOrder = await editDonDatHang(editingOrder.maDonHang!, editingOrder);
        setDataSource((prev:any) => prev.map((order:any) => (order.maDonHang === editingOrder.maDonHang ? updatedOrder : order)));
        resetEditing();
        message.success('Order updated successfully');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        message.error('Failed to update order');
      }
    }
  };

  const handleAddOk = async () => {
    if (addingOrder) {
      try {
        const addedOrder = await addDonDatHang(addingOrder);
        setDataSource((prev) => [...prev, addedOrder]);
        resetAdding();
        message.success('Order added successfully');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        message.error('Failed to add order');
      }
    }
  };

  const handleChangeOrderStatus = (order: DonDatHang) => {
    setSelectedOrder(order);
    Modal.confirm({
      title: "Xác nhận giao hàng?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          setConfirmLoading(true);
          const updatedOrder = { ...order, tinhTrangDonHang: 1 };
          await editDonDatHang(order.maDonHang!, updatedOrder);
          setDataSource((prev) =>
            prev.map((item) => (item.maDonHang === order.maDonHang ? updatedOrder : item))
          );
          message.success('Order status updated successfully');
          setConfirmLoading(false);
        } catch (error) {
          message.error('Failed to update order status');
          setConfirmLoading(false);
        }
      },
    });
  };

  return (
    <Template>
      <div className="App mt-24">
        <h1 className="font-bold text-2xl">Danh sách đơn hàng</h1>
        <header className="App-header">
          <Button onClick={onAddOrder} className="my-5">Add a new Order</Button>
          <Input
            placeholder="Tìm kiếm đơn hàng"
            value={searchText}
            onChange={handleSearch}
            className="mb-5"
          />
          <Table columns={columns} dataSource={filteredDataSource} rowKey="maDonHang" />
          <Modal
            title="Edit Order"
            visible={isEditing}
            okText="Save"
            onCancel={resetEditing}
            onOk={handleEditOk}
          >
            <Input
              placeholder="Tên Xe"
              value={editingOrder?.maXe}
              onChange={(e) => setEditingOrder((prev) => ({ ...prev!, maXe: e.target.value }))}
            />
            <Input
              placeholder="Mã Khách Hàng"
              value={editingOrder?.maKhachHang}
              onChange={(e) => setEditingOrder((prev) => ({ ...prev!, maKhachHang: e.target.value }))}
            />
            <Input
              placeholder="Ngày Đặt Hàng"
              value={editingOrder?.ngayDatHang}
              onChange={(e) => setEditingOrder((prev) => ({ ...prev!, ngayDatHang: e.target.value }))}
            />
            <Input
              placeholder="Đặt Cọc"
              value={editingOrder?.datCoc.toString()}
              onChange={(e) => setEditingOrder((prev) => ({ ...prev!, datCoc: parseFloat(e.target.value) }))}
            />
            <Input
              placeholder="Chính Sách Bảo Hành"
              value={editingOrder?.chinhSachBaoHanh}
              onChange={(e) => setEditingOrder((prev) => ({ ...prev!, chinhSachBaoHanh: e.target.value }))}
            />
            <Input
              placeholder="Tổng Tiền"
              value={editingOrder?.tongTien.toString()}
              onChange={(e) => setEditingOrder((prev) => ({ ...prev!, tongTien: parseFloat(e.target.value) }))}
            />
            <Input
              placeholder="Số Lượng"
              value={editingOrder?.soLuong.toString()}
              onChange={(e) => setEditingOrder((prev) => ({ ...prev!, soLuong: parseInt(e.target.value) }))}
            />
            <Input
              placeholder="Tình Trạng Đơn Hàng"
              value={editingOrder?.tinhTrangDonHang.toString()}
              onChange={(e) => setEditingOrder((prev) => ({ ...prev!, tinhTrangDonHang: parseInt(e.target.value) }))}
            />
          </Modal>
          <Modal
            title="Add Order"
            visible={isAdding}
            okText="Add"
            onCancel={resetAdding}
            onOk={handleAddOk}
          >
            <Input
              placeholder="Tên Xe"
              value={addingOrder?.maXe}
              onChange={(e) => setAddingOrder((prev) => ({ ...prev!, maXe: e.target.value }))}
            />
            <Input
              placeholder="Mã Khách Hàng"
              value={addingOrder?.maKhachHang}
              onChange={(e) => setAddingOrder((prev) => ({ ...prev!, maKhachHang: e.target.value }))}
            />
            <Input
              placeholder="Ngày Đặt Hàng"
              value={addingOrder?.ngayDatHang}
              onChange={(e) => setAddingOrder((prev) => ({ ...prev!, ngayDatHang: e.target.value }))}
            />
            <Input
              placeholder="Đặt Cọc"
              value={addingOrder?.datCoc.toString()}
              onChange={(e) => setAddingOrder((prev) => ({ ...prev!, datCoc: parseFloat(e.target.value) }))}
            />
            <Input
              placeholder="Chính Sách Bảo Hành"
              value={addingOrder?.chinhSachBaoHanh}
              onChange={(e) => setAddingOrder((prev) => ({ ...prev!, chinhSachBaoHanh: e.target.value }))}
            />
            <Input
              placeholder="Tổng Tiền"
              value={addingOrder?.tongTien.toString()}
              onChange={(e) => setAddingOrder((prev) => ({ ...prev!, tongTien: parseFloat(e.target.value) }))}
            />
            <Input
              placeholder="Số Lượng"
              value={addingOrder?.soLuong.toString()}
              onChange={(e) => setAddingOrder((prev) => ({ ...prev!, soLuong: parseInt(e.target.value) }))}
            />
            <Input
              placeholder="Tình Trạng Đơn Hàng"
              value={addingOrder?.tinhTrangDonHang.toString()}
              onChange={(e) => setAddingOrder((prev) => ({ ...prev!, tinhTrangDonHang: parseInt(e.target.value) }))}
            />
          </Modal>
        </header>
      </div>
    </Template>
  );
}

export default Order;
