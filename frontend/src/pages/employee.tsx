import { Button, Table, Modal, Input, message } from "antd";
import { useState, useEffect } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAllUsers, addUser, editUser, deleteUser, NhanVien } from '../service/apinhanvien';
import Template from "../template/template";

const Employee: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingEmployee, setEditingEmployee] = useState<NhanVien | null>(null);
  const [dataSource, setDataSource] = useState<NhanVien[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const employees = await getAllUsers();
      setDataSource(employees);
    } catch (error) {
      message.error('Failed to fetch employees');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredDataSource = dataSource.filter(employee =>
    Object.values(employee).some(value =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns = [
    {
      key: "1",
      title: "ID",
      dataIndex: "maNhanVien",
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
      title: "Lương",
      dataIndex: "luong",
    },
    {
      key: "6",
      title: "Hiệu Suất Làm Việc",
      dataIndex: "hieuSuatLamViec",
    },
    {
      key: "7",
      title: "Chức Vụ",
      dataIndex: "chucVu",
    },
    {
      key: "8",
      title: "Lịch Làm Việc",
      dataIndex: "lichLamViec",
    },
    {
      key: "9",
      title: "Actions",
      render: (record: NhanVien) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditEmployee(record);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteEmployee(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  const onAddEmployee = async () => {
    const newEmployee: NhanVien = {
      hoVaTen: "",
      diaChi: "",
      sdt: "",
      luong: "",
      hieuSuatLamViec: "",
      chucVu: "",
      lichLamViec: "",
    };

    try {
      const addedEmployee = await addUser(newEmployee);
      setDataSource((prev) => [...prev, addedEmployee]);
      message.success('Employee added successfully');
    } catch (error) {
      message.error('Failed to add employee');
    }
  };

  const onDeleteEmployee = (record: NhanVien) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa nhân viên này?",
      okText: "Có",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteUser(record.maNhanVien!.toString());
          setDataSource((prev) => prev.filter((employee) => employee.maNhanVien !== record.maNhanVien));
          message.success('Employee deleted successfully');
        } catch (error) {
          message.error('Failed to delete employee');
        }
      },
    });
  };

  const onEditEmployee = (record: NhanVien) => {
    setIsEditing(true);
    setEditingEmployee({ ...record });
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingEmployee(null);
  };

  return (
    <Template>
      <div className="App mt-24">
        <h1 className="font-bold text-2xl">Danh sách nhân viên</h1>
        <header className="App-header">
          <Button onClick={onAddEmployee} className="my-5">Add a new Employee</Button>
          <Input
            placeholder="Tìm kiếm nhân viên"
            value={searchText}
            onChange={handleSearch}
            className="mb-5"
          />
          <Table columns={columns} dataSource={filteredDataSource} rowKey="maNhanVien"></Table>
          <Modal
            title="Edit Employee"
            visible={isEditing}
            okText="Save"
            onCancel={resetEditing}
            onOk={async () => {
              if (editingEmployee) {
                try {
                  const updatedEmployee = await editUser(editingEmployee.maNhanVien!, editingEmployee);
                  setDataSource((prev) => prev.map((employee) => {
                    if (employee.maNhanVien === editingEmployee.maNhanVien) {
                      return updatedEmployee;
                    } else {
                      return employee;
                    }
                  }));
                  resetEditing();
                  message.success('Employee updated successfully');
                  setTimeout(() => {
                    window.location.reload();
                  }, 800);
                } catch (error) {
                  message.error('Failed to update employee');
                }
              }
            }}
          >
            <Input
              placeholder="Họ và Tên"
              value={editingEmployee?.hoVaTen}
              onChange={(e) => {
                setEditingEmployee((prev) => {
                  return { ...prev!, hoVaTen: e.target.value };
                });
              }}
            />
            <Input
              placeholder="Địa Chỉ"
              value={editingEmployee?.diaChi}
              onChange={(e) => {
                setEditingEmployee((prev) => {
                  return { ...prev!, diaChi: e.target.value };
                });
              }}
            />
            <Input
              placeholder="Số Điện Thoại"
              value={editingEmployee?.sdt}
              onChange={(e) => {
                setEditingEmployee((prev) => {
                  return { ...prev!, sdt: e.target.value };
                });
              }}
            />
            <Input
              placeholder="Lương"
              value={editingEmployee?.luong}
              onChange={(e) => {
                setEditingEmployee((prev) => {
                  return { ...prev!, luong: e.target.value };
                });
              }}
            />
            <Input
              placeholder="Hiệu Suất Làm Việc"
              value={editingEmployee?.hieuSuatLamViec}
              onChange={(e) => {
                setEditingEmployee((prev) => {
                  return { ...prev!, hieuSuatLamViec: e.target.value };
                });
              }}
            />
            <Input
              placeholder="Chức Vụ"
              value={editingEmployee?.chucVu}
              onChange={(e) => {
                setEditingEmployee((prev) => {
                  return { ...prev!, chucVu: e.target.value };
                });
              }}
            />
            <Input
              placeholder="Lịch Làm Việc"
              value={editingEmployee?.lichLamViec}
              onChange={(e) => {
                setEditingEmployee((prev) => {
                  return { ...prev!, lichLamViec: e.target.value };
                });
              }}
            />
          </Modal>
        </header>
      </div>
    </Template>
  );
}

export default Employee;
