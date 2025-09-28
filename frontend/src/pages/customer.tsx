import { Button, Table, Modal, Input, message } from "antd";
import { useState, useEffect } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAllKhachHang, addKhachHang, editKhachHang, deleteKhachHang, KhachHang } from '../service/apikhachhang';
import Template from "../template/template";

const Customer: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<KhachHang | null>(null);
  const [dataSource, setDataSource] = useState<KhachHang[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const customers = await getAllKhachHang();
      setDataSource(customers);
    } catch (error) {
      message.error('Failed to fetch customers');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredDataSource = dataSource.filter(customer =>
    Object.values(customer).some(value =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns = [
    {
      key: "1",
      title: "ID",
      dataIndex: "maKhachHang",
    },
    {
      key: "2",
      title: "Họ và Tên",
      dataIndex: "hoVaTen",
    },
    {
      key: "3",
      title: "Địa Chỉ",
      dataIndex: "diaChi",
    },
    {
      key: "4",
      title: "Số Điện Thoại",
      dataIndex: "sdt",
    },
    {
      key: "5",
      title: "Email",
      dataIndex: "email",
    },
    {
      key: "6",
      title: "Actions",
      render: (record: KhachHang) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditCustomer(record);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteCustomer(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  const onAddCustomer = async () => {
    const newCustomer: KhachHang = {
        maKhachHang:0,
      hoVaTen: "",
      diaChi: "",
      sdt: "",
      email: "",
    };

    try {
      const addedCustomer = await addKhachHang(newCustomer);
      setDataSource((prev) => [...prev, addedCustomer]);
      message.success('Customer added successfully');
    } catch (error) {
      message.error('Failed to add customer');
    }
  };

  const onDeleteCustomer = (record: KhachHang) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa khách hàng này?",
      okText: "Có",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteKhachHang(record.maKhachHang!.toString());
          setDataSource((prev) => prev.filter((customer) => customer.maKhachHang !== record.maKhachHang));
          message.success('Customer deleted successfully');
        } catch (error) {
          message.error('Failed to delete customer');
        }
      },
    });
  };

  const onEditCustomer = (record: KhachHang) => {
    setIsEditing(true);
    setEditingCustomer({ ...record });
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingCustomer(null);
  };

  return (
    <Template>
      <div className="App mt-24">
        <h1 className="font-bold text-2xl">Danh sách khách hàng</h1>
        <header className="App-header">
          <Button onClick={onAddCustomer} className="my-5">Add a new Customer</Button>
          <Input
            placeholder="Tìm kiếm khách hàng"
            value={searchText}
            onChange={handleSearch}
            className="mb-5"
          />
          <Table columns={columns} dataSource={filteredDataSource} rowKey="maKhachHang"></Table>
          <Modal
            title="Edit Customer"
            visible={isEditing}
            okText="Save"
            onCancel={resetEditing}
            onOk={async () => {
              if (editingCustomer) {
                try {
                  const updatedCustomer = await editKhachHang(editingCustomer.maKhachHang!.toString(), editingCustomer);
                  setDataSource((prev) => prev.map((customer) => {
                    if (customer.maKhachHang === editingCustomer.maKhachHang) {
                      return updatedCustomer;
                    } else {
                      return customer;
                    }
                  }));
                  resetEditing();
                  message.success('Customer updated successfully');
                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                } catch (error) {
                  message.error('Failed to update customer');
                }
              }
            }}
          >
            <Input
              placeholder="Họ và Tên"
              value={editingCustomer?.hoVaTen}
              onChange={(e) => {
                setEditingCustomer((prev:any) => {
                  return { ...prev!, hoVaTen: e.target.value };
                });
              }}
            />
            <Input
              placeholder="Địa Chỉ"
              value={editingCustomer?.diaChi}
              onChange={(e) => {
                setEditingCustomer((prev:any) => {
                  return { ...prev!, diaChi: e.target.value };
                });
              }}
            />
            <Input
              placeholder="Số Điện Thoại"
              value={editingCustomer?.sdt}
              onChange={(e) => {
                setEditingCustomer((prev:any) => {
                  return { ...prev!, sdt: e.target.value };
                });
              }}
            />
            <Input
              placeholder="Email"
              value={editingCustomer?.email}
              onChange={(e) => {
                setEditingCustomer((prev:any) => {
                  return { ...prev!, email: e.target.value };
                });
              }}
            />
          </Modal>
        </header>
      </div>
    </Template>
  );
}

export default Customer;
