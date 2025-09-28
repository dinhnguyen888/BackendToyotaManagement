import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Button, Avatar, message, Modal, Form, Input, InputNumber } from 'antd';
import { DingdingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { getAllXe, Xe, editXe } from '../../service/apixe';
import { getAllKhachHang, KhachHang, addKhachHang } from '../../service/apikhachhang';
import { DonDatHang, addDonDatHang } from '../../service/apidondathang';

const { Meta } = Card;

const ProductShowcase: React.FC = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState<boolean>(true);
  const [products, setProducts] = useState<Xe[]>([]);
  const [selectedQuantities, setSelectedQuantities] = useState<{ [key: string]: number }>({});
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [customerInfo, setCustomerInfo] = useState<KhachHang | null>(null);
  const [allCustomers, setAllCustomers] = useState<KhachHang[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getAllXe();
        setProducts(productsData);
      } catch (error) {
        message.error('Failed to fetch products');
      }
    };

    const fetchCustomers = async () => {
      try {
        const customersData = await getAllKhachHang();
        setAllCustomers(customersData);
      } catch (error) {
        message.error('Failed to fetch customers');
      }
    };

    fetchProducts();
    fetchCustomers();
  }, []);

  const handleOpenAuthen = () => {
    setVisible(!visible);
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      localStorage.removeItem('login');
      localStorage.removeItem('email');
      navigate('/');
    }
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setSelectedQuantities({
      ...selectedQuantities,
      [productId]: quantity,
    });
  };

  const handleBuy = async (product: Xe) => {
    const maKhachHang = localStorage.getItem('maKhachHang');
    // const email = localStorage.getItem('email');
    // if ((!maKhachHang && email) || (!maKhachHang && !email) ) {
    //   setIsModalVisible(true);
    // } else {
      const quantity = selectedQuantities[product.maXe!] || 1;
      const totalPrice = product.giaBan * quantity;

      const donDatHangData: DonDatHang = {
        maDonHang: 0,
        maKhachHang: parseInt(maKhachHang!, 10),
        maXe: product.maXe!,
        ngayDatHang: new Date().toISOString(),
        datCoc: 0,
        chinhSachBaoHanh: 'bảo hành 6 tháng',
        tongTien: totalPrice,
        soLuong: quantity,
        tinhTrangDonHang: 0,
        xe: {
          maXe: product.maXe!,
          uuDai: product.uuDai.toString(),
          giaBan: product.giaBan,
          tenXe: product.tenXe,
          maDaiLy: product.maDaiLy,
          thongSoKiThuat: product.thongSoKiThuat,
          loaiXe: product.loaiXe,
          thumbnail: product.thumbnail,
          moTa: product.moTa,
          soLuong: product.soLuong
        }
      };

      try {
        console.log("Sending order data to API", donDatHangData);
        await addDonDatHang(donDatHangData);

        const updatedProduct = { ...product, soLuong: product.soLuong - quantity };
        console.log("Updating product quantity", updatedProduct);
        await editXe(product.maXe as string, updatedProduct);

        const updatedProducts = products.map(p =>
          p.maXe === product.maXe ? updatedProduct : p
        );

        setProducts(updatedProducts);
        message.success('Mua thành công');
      } catch (error) {
        console.error("Error occurred while processing the order", error);
        message.error('Vì để tránh nhầm lẫn, bạn vui lòng vào Lịch sử mua để xóa đơn hàng nếu bạn muốn mua 2 xe cùng loại trở lên');
      }
    
  };

  const handleOk = async (values: { hoVaTen: string; diaChi: string; sdt: string }) => {
    const email = localStorage.getItem('email');
    if (email) {
      const existingCustomer = allCustomers.find(customer => customer.hoVaTen === values.hoVaTen);
      if (existingCustomer) {
        setCustomerInfo(existingCustomer);
        localStorage.setItem('maKhachHang', existingCustomer.maKhachHang!.toString());
        setIsModalVisible(false); 
        message.success('Thông tin khách hàng đã được xác nhận');
      } else {
        const customerData: KhachHang = { ...values, email };
        try {
          const addedCustomer = await addKhachHang(customerData);
          setCustomerInfo(addedCustomer);
          localStorage.setItem('maKhachHang', addedCustomer.maKhachHang!.toString());
          setIsModalVisible(false); 
          message.success('Thông tin khách hàng đã được lưu');
        } catch (error) {
          console.error("Error adding customer", error);
          message.error('Lưu thông tin khách hàng thất bại');
        }
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOpenHistory = () => {
    navigate('/lichsumua');
  };

  const handleOpenInfoModal = () => {
    setIsModalVisible(true);
  };

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
      {visible === false && (
        <div className="absolute top-0 right-0 bg-gray-700 p-5 my-16 z-10">
          <button className="text-blue-200 hover:underline" onClick={handleLogout}>
            Đăng xuất
          </button>
          <br />
          <button className="text-green-200 hover:underline" onClick={handleOpenHistory}>
            Xem lịch sử mua
          </button>
          <br />
          <button className="text-yellow-200 hover:underline" onClick={handleOpenInfoModal}>
            Thêm thông tin
          </button>
        </div>
      )}
      <div style={{ padding: '30px' }} className="w-7/12 mx-auto">
        <Row gutter={16}>
          {products.map((product) => (
            <Col span={8} key={product.maXe} style={{ marginBottom: '20px' }} >
              <Card hoverable cover={<img alt={product.tenXe} src={product.thumbnail} />}>
                <Meta title={product.tenXe} />
                <br/>
                <Meta className='h-36' description={`${product.moTa} `}/>
                <p className='text-center font-bold text-lg my-1'> Số lượng: {product.soLuong}</p>
                <p className='text-center font-bold text-lg text-red-600 my-1'> Giá: {product.giaBan} tỷ</p>
                <InputNumber
                  min={1}
                  max={product.soLuong}
                  defaultValue={1}
                  onChange={(value: any) => handleQuantityChange(product.maXe!.toString(), value)}
                  className="my-2 mx-11 h-14 w-14"
                />
                <Button
                  className="my-5 mx-11 bg-blue-400 text-white"
                  onClick={() => handleBuy(product)}
                  disabled={product.soLuong < 1}
                >
                  {product.soLuong > 0 ? "Buy" : "Sold Out"}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <Modal
        title="Nhập thông tin khách hàng"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form onFinish={handleOk}>
          <Form.Item label="Họ và tên" name="hoVaTen" rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Địa chỉ" name="diaChi" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="sdt" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Lưu thông tin
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default ProductShowcase;
