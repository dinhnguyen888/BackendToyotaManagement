import { Button, Table, Modal, Input, message } from "antd";
import { useState, useEffect } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAllXe, addXe, editXe, deleteXe, DaiLy } from '../service/apidaily';
import Template from "../template/template";

const Agency: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingAgency, setEditingAgency] = useState<DaiLy | null>(null);
  const [dataSource, setDataSource] = useState<DaiLy[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      const agencies = await getAllXe();
      setDataSource(agencies);
    } catch (error) {
      message.error('Failed to fetch agencies');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredDataSource = dataSource.filter(agency =>
    Object.values(agency).some(value =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns = [
    {
      key: "1",
      title: "Mã Đại Lý",
      dataIndex: "maDaiLy",
    },
    {
      key: "2",
      title: "Tên Đại Lý",
      dataIndex: "tenDaiLy",
    },
    {
      key: "3",
      title: "Địa Chỉ",
      dataIndex: "diaChi",
    },
    {
      key: "4",
      title: "Email",
      dataIndex: "email",
    },
    {
      key: "5",
      title: "Số Điện Thoại",
      dataIndex: "sdt",
    },
    {
      key: "6",
      title: "Actions",
      render: (record: DaiLy) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditAgency(record);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteAgency(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  const onAddAgency = async () => {
    const newAgency: DaiLy = {
      tenDaiLy: "",
      diaChi: "",
      email: "",
      sdt: "",
    };

    try {
      const addedAgency = await addXe(newAgency);
      setDataSource((prev) => [...prev, addedAgency]);
      message.success('Agency added successfully');
    } catch (error) {
      message.error('Failed to add agency');
    }
  };

  const onDeleteAgency = (record: DaiLy) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa đại lý này?",
      okText: "Có",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteXe(record.maDaiLy!.toString());
          setDataSource((prev) => prev.filter((agency) => agency.maDaiLy !== record.maDaiLy));
          message.success('Agency deleted successfully');
        } catch (error) {
          message.error('Failed to delete agency');
        }
      },
    });
  };

  const onEditAgency = (record: DaiLy) => {
    setIsEditing(true);
    setEditingAgency({ ...record });
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingAgency(null);
  };

  return (
    <Template>
      <div className="App mt-24">
        <h1 className="font-bold text-2xl">Danh sách đại lý</h1>
        <header className="App-header">
          <Button onClick={onAddAgency} className="my-5">Add a new Agency</Button>
          <Input
            placeholder="Tìm kiếm đại lý"
            value={searchText}
            onChange={handleSearch}
            className="mb-5"
          />
          <Table columns={columns} dataSource={filteredDataSource} rowKey="maDaiLy"></Table>
          <Modal
            title="Edit Agency"
            visible={isEditing}
            okText="Save"
            onCancel={resetEditing}
            onOk={async () => {
              if (editingAgency) {
                try {
                  const updatedAgency = await editXe(editingAgency.maDaiLy!.toString(), editingAgency);
                  setDataSource((prev) => prev.map((agency) => {
                    if (agency.maDaiLy === editingAgency.maDaiLy) {
                      return updatedAgency;
                    } else {
                      return agency;
                    }
                  }));
                  resetEditing();
                  message.success('Agency updated successfully');
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                } catch (error) {
                  message.error('Failed to update agency');
                }
              }
            }}
          >
            <Input
              placeholder="Tên Đại Lý"
              value={editingAgency?.tenDaiLy}
              onChange={(e) => {
                setEditingAgency((prev) => {
                  return { ...prev!, tenDaiLy: e.target.value };
                });
              }}
            />
            <Input
              placeholder="Địa Chỉ"
              value={editingAgency?.diaChi}
              onChange={(e) => {
                setEditingAgency((prev) => {
                  return { ...prev!, diaChi: e.target.value };
                });
              }}
            />
            <Input
              placeholder="Email"
              value={editingAgency?.email}
              onChange={(e) => {
                setEditingAgency((prev:any) => {
                  return { ...prev!, email: e.target.value };
                });
              }}
            />
            <Input
              placeholder="Số Điện Thoại"
              value={editingAgency?.sdt}
              onChange={(e) => {
                setEditingAgency((prev) => {
                  return { ...prev!, sdt: e.target.value };
                });
              }}
            />
          </Modal>
        </header>
      </div>
    </Template>
  );
}

export default Agency;
