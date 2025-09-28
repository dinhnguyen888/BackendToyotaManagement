import { Button, Table, Modal, Input, message } from "antd";
import { useState, useEffect } from "react";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { getAllUsers, createUser, updateUser, deleteUser, Account } from '../service/apitaikhoan'; // Adjust the import path if necessary
import Template from "../template/template";
import { AnyCnameRecord } from "dns";

const AccountList: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<Account[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const accounts = await getAllUsers();
      setDataSource(accounts);
    } catch (error) {
      message.error('Failed to fetch accounts');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredDataSource = dataSource.filter(account =>
    Object.values(account).some(value =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns = [
    {
      key: "1",
      title: "ID",
      dataIndex: "id",
    },
    {
      key: "2",
      title: "Người Dùng",
      dataIndex: "nguoiDung",
    },
    {
      key: "3",
      title: "Mật Khẩu",
      dataIndex: "matKhau",
    },

    {
      key: "4",
      title: "Vai Trò",
      dataIndex: "vaiTro",
    },
    {
      key: "5",
      title: "Actions",
      render: (record: Account) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditAccount(record);
              }}
              style={{ marginRight: 8 }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteAccount(record);
              }}
              style={{ color: "red" }}
            />
          </>
        );
      },
    },
  ];

  const onAddAccount = async () => {
    setIsAdding(true);
    setEditingAccount({
      id: 0,
      nguoiDung: "",
   
      matKhau: "",
      vaiTro: "",
    });
  };

  const onDeleteAccount = (record: Account) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa tài khoản này?",
      okText: "Có",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteUser(record.id!);
          setDataSource((prev) => prev.filter((account) => account.id !== record.id));
          message.success('Account deleted successfully');
        } catch (error) {
          message.error('Failed to delete account');
        }
      },
    });
  };

  const onEditAccount = (record: Account) => {
    setIsEditing(true);
    setEditingAccount({ ...record });
  };

  const resetEditing = () => {
    setIsEditing(false);
    setIsAdding(false)
    setEditingAccount(null);
  };

  const handleAddOk = async () => {
    if (!editingAccount?.nguoiDung || !editingAccount?.matKhau || !editingAccount?.vaiTro) {
      message.error('Please fill in all fields');
      return;
    }

    try {
      const newAccount = await createUser(editingAccount);
      setDataSource((prev) => [...prev, newAccount]);
      message.success('Account added successfully');
      setIsAdding(false);
      resetEditing();
    } catch (error) {
      message.error('Failed to add account');
    }
  };

  const handleEditOk = async () => {
    if (!editingAccount?.nguoiDung || !editingAccount?.matKhau || !editingAccount?.vaiTro) {
      message.error('Please fill in all fields');
      return;
    }

    try {
      const updatedAccount = await updateUser(editingAccount.id!, editingAccount);
      setDataSource((prev) => prev.map((account) => (account.id === updatedAccount.id ? updatedAccount : account)));
      message.success('Account updated successfully');
      resetEditing();
    } catch (error) {
      message.error('Failed to update account');
    }
  };

  return (
    <Template>
      <div className="App mt-24">
        <h1 className="font-bold text-2xl">Danh sách tài khoản</h1>
        <header className="App-header">
          <Button type="primary" onClick={onAddAccount} icon={<PlusOutlined />} className="my-5">
            Add Account
          </Button>
          <Input
            placeholder="Tìm kiếm tài khoản"
            value={searchText}
            onChange={handleSearch}
            className="mb-5"
          />
          <Table columns={columns} dataSource={filteredDataSource} rowKey="id"></Table>
          <Modal
            title={isAdding ? "Add Account" : "Edit Account"}
            visible={isAdding || isEditing}
            okText={isAdding ? "Add" : "Save"}
            onCancel={resetEditing}
            onOk={isAdding ? handleAddOk : handleEditOk}
          >
            <Input
              placeholder="Người Dùng"
              value={editingAccount?.nguoiDung}
              onChange={(e) => {
                setEditingAccount((prev) => {
                  return { ...prev!, nguoiDung: e.target.value };
                });
              }}
              className="mb-2"
            />
           
            <Input
              placeholder="Mật Khẩu"
              value={editingAccount?.matKhau}
              onChange={(e) => {
                setEditingAccount((prev) => {
                  return { ...prev!, matKhau: e.target.value };
                });
              }}
              className="mb-2"
            />
            <Input
              placeholder="Vai Trò"
              value={editingAccount?.vaiTro}
              onChange={(e) => {
                setEditingAccount((prev) => {
                  return { ...prev!, vaiTro: e.target.value };
                });
              }}
              className="mb-2"
            />
          </Modal>
        </header>
      </div>
    </Template>
  );
}

export default AccountList;
