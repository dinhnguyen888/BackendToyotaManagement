import { Button, Table, Modal, Input, message } from "antd";
import { useState, useEffect } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAllXe, addXe, editXe, deleteXe, Xe } from '../service/apixe';
import Template from "../template/template";
import UploadFile from "../components/uploadfile";

const Product: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Xe | null>(null);
  const [addingProduct, setAddingProduct] = useState<Xe | null>(null);
  const [dataSource, setDataSource] = useState<Xe[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [upload, setUpload] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const products = await getAllXe();
      setDataSource(products);
    } catch (error) {
      message.error('Failed to fetch products');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredDataSource = dataSource.filter(product =>
    Object.values(product).some(value =>
      (value?.toString() ?? "").toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns = [
    {
      key: "1",
      title: "ID",
      dataIndex: "maXe",
    },
    {
      key: "2",
      title: "Tên Xe",
      dataIndex: "tenXe",
    },
    {
      key: "3",
      title: "Ưu Đãi",
      dataIndex: "uuDai",
    },
    {
      key: "4",
      title: "Giá Bán",
      dataIndex: "giaBan",
    },
    {
      key: "5",
      title: "Thông Số Kỹ Thuật",
      dataIndex: "thongSoKiThuat",
    },
    {
      key: "6",
      title: "Loại Xe",
      dataIndex: "loaiXe",
    },
    {
      key: "7",
      title: "Thumbnail",
      dataIndex: "thumbnail",
      render: (text: string) => <img src={text} alt="Car Thumbnail" style={{ width: 100 }} />,
    },
    {
      key: "8",
      title: "Mô Tả",
      dataIndex: "moTa",
    },
    {
      key: "9",
      title: "Số Lượng",
      dataIndex: "soLuong",
    },
    {
      key: "10",
      title: "Mã Đại Lý",
      dataIndex: "maDaiLy",
    },
    {
      key: "11",
      title: "Actions",
      render: (record: Xe) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditProduct(record);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteProduct(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  const onAddProduct = () => {
    setIsAdding(true);
    setAddingProduct({
      uuDai: 0,
      tenXe: "",
      maDaiLy: 0,
      giaBan: 0,
      thongSoKiThuat: "",
      loaiXe: "",
      thumbnail: "",
      moTa: "",
      soLuong: 0,
    });
  };

  const onDeleteProduct = (record: Xe) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      okText: "Có",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteXe(record.maXe!.toString());
          setDataSource((prev) => prev.filter((product) => product.maXe !== record.maXe));
          message.success('Product deleted successfully');
        } catch (error) {
          message.error('Failed to delete product');
        }
      },
    });
  };

  const onEditProduct = (record: Xe) => {
    setIsEditing(true);
    setEditingProduct({ ...record });
    setThumbnailUrl(record.thumbnail);
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingProduct(null);
    setThumbnailUrl(null);
  };

  const resetAdding = () => {
    setIsAdding(false);
    setAddingProduct(null);
    setThumbnailUrl(null);
  };

  const handleFileChange = () => {
    setUpload(!upload);
  };

  const handleFileUpload = (fileUrl: string) => {
    if (isEditing && editingProduct) {
      setEditingProduct((prev) => ({ ...prev!, thumbnail: fileUrl }));
      setThumbnailUrl(fileUrl);
    } else if (isAdding && addingProduct) {
      setAddingProduct((prev) => ({ ...prev!, thumbnail: fileUrl }));
      setThumbnailUrl(fileUrl);
    }
    setUpload(false);
  };

  const handleEditOk = async () => {
    if (editingProduct) {
      try {
        const updatedProduct = await editXe(editingProduct.maXe!.toString(), editingProduct);
        setDataSource((prev) => prev.map((product) => (product.maXe === editingProduct.maXe ? updatedProduct : product)));
        resetEditing();
        message.success('Product updated successfully');
        window.location.reload()
      } catch (error) {
        message.error('Failed to update product');
      }
    }
  };

  const handleAddOk = async () => {
    if (addingProduct) {
      try {
        const addedProduct = await addXe(addingProduct);
        setDataSource((prev) => [...prev, addedProduct]);
        resetAdding();
        message.success('Product added successfully');
      } catch (error) {
        message.error('Failed to add product');
      }
    }
  };

  return (
    <Template>
      <div className="App mt-24">
        <h1 className="font-bold text-2xl">Danh sách sản phẩm</h1>
        <header className="App-header">
          <Button onClick={onAddProduct} className="my-5">Add a new Product</Button>
          <Input
            placeholder="Tìm kiếm sản phẩm"
            value={searchText}
            onChange={handleSearch}
            className="mb-5"
          />
          <Table columns={columns} dataSource={filteredDataSource} rowKey="maXe" />
          <Modal
            title="Edit Product"
            visible={isEditing}
            okText="Save"
            onCancel={resetEditing}
            onOk={handleEditOk}
          >
            <Input
              placeholder="Tên Xe"
              value={editingProduct?.tenXe}
              onChange={(e) => setEditingProduct((prev) => ({ ...prev!, tenXe: e.target.value }))}
            />
            <Input
              placeholder="Ưu Đãi"
              value={editingProduct?.uuDai.toString()}
              onChange={(e) => setEditingProduct((prev) => ({ ...prev!, uuDai: parseFloat(e.target.value) }))}
            />
            <Input
              placeholder="Giá Bán"
              value={editingProduct?.giaBan.toString()}
              onChange={(e) => setEditingProduct((prev) => ({ ...prev!, giaBan: parseFloat(e.target.value) }))}
            />
            <Input
              placeholder="Thông Số Kỹ Thuật"
              value={editingProduct?.thongSoKiThuat}
              onChange={(e) => setEditingProduct((prev) => ({ ...prev!, thongSoKiThuat: e.target.value }))}
            />
            <Input
              placeholder="Loại Xe"
              value={editingProduct?.loaiXe}
              onChange={(e) => setEditingProduct((prev) => ({ ...prev!, loaiXe: e.target.value }))}
            />
            <Button onClick={handleFileChange}>Chọn file</Button>
            {thumbnailUrl && <img src={thumbnailUrl} alt="Thumbnail" style={{ width: 100, marginTop: 10 }} />}
            <Input
              placeholder="Mô Tả"
              value={editingProduct?.moTa}
              onChange={(e) => setEditingProduct((prev) => ({ ...prev!, moTa: e.target.value }))}
            />
            <Input
              placeholder="Số Lượng"
              value={editingProduct?.soLuong.toString()}
              onChange={(e) => setEditingProduct((prev) => ({ ...prev!, soLuong: parseInt(e.target.value) }))}
            />
            <Input
              placeholder="Mã Đại Lý"
              value={editingProduct?.maDaiLy.toString()}
              onChange={(e) => setEditingProduct((prev) => ({ ...prev!, maDaiLy: parseInt(e.target.value) }))}
            />
          </Modal>
          <Modal
            title="Add Product"
            visible={isAdding}
            okText="Add"
            onCancel={resetAdding}
            onOk={handleAddOk}
          >
            <Input
              placeholder="Tên Xe"
              value={addingProduct?.tenXe}
              onChange={(e) => setAddingProduct((prev) => ({ ...prev!, tenXe: e.target.value }))}
            />
            <Input
              placeholder="Ưu Đãi"
              value={addingProduct?.uuDai.toString()}
              onChange={(e) => setAddingProduct((prev) => ({ ...prev!, uuDai: parseFloat(e.target.value) }))}
            />
            <Input
              placeholder="Giá Bán"
              value={addingProduct?.giaBan.toString()}
              onChange={(e) => setAddingProduct((prev) => ({ ...prev!, giaBan: parseFloat(e.target.value) }))}
            />
            <Input
              placeholder="Thông Số Kỹ Thuật"
              value={addingProduct?.thongSoKiThuat}
              onChange={(e) => setAddingProduct((prev) => ({ ...prev!, thongSoKiThuat: e.target.value }))}
            />
            <Input
              placeholder="Loại Xe"
              value={addingProduct?.loaiXe}
              onChange={(e) => setAddingProduct((prev) => ({ ...prev!, loaiXe: e.target.value }))}
            />
            <Button onClick={handleFileChange}>Chọn file</Button>
            {thumbnailUrl && <img src={thumbnailUrl} alt="Thumbnail" style={{ width: 100, marginTop: 10 }} />}
            <Input
              placeholder="Mô Tả"
              value={addingProduct?.moTa}
              onChange={(e) => setAddingProduct((prev) => ({ ...prev!, moTa: e.target.value }))}
            />
            <Input
              placeholder="Số Lượng"
              value={addingProduct?.soLuong.toString()}
              onChange={(e) => setAddingProduct((prev) => ({ ...prev!, soLuong: parseInt(e.target.value) }))}
            />
            <Input
              placeholder="Mã Đại Lý"
              value={addingProduct?.maDaiLy.toString()}
              onChange={(e) => setAddingProduct((prev) => ({ ...prev!, maDaiLy: parseInt(e.target.value) }))}
            />
          </Modal>
        </header>
      </div>
      <Modal
        title="Upload File"
        visible={upload}
        onCancel={() => setUpload(false)}
        footer={null}
        style={{ height: 400 }} 
        bodyStyle={{ height: 350 }}
      >
        <UploadFile onUpload={handleFileUpload} />
      </Modal>
    </Template>
  );
}

export default Product;
