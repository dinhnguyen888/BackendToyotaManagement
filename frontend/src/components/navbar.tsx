import React, { useState } from "react";
import { Button, Avatar } from "antd";
import { ReactComponent as Logo } from '../image/car-svgrepo-com.svg';
import { Link, useNavigate } from "react-router-dom";
import { CarOutlined, DingdingOutlined, DollarOutlined, DotNetOutlined, IdcardOutlined, PieChartOutlined, SettingOutlined, ShopOutlined, ShoppingOutlined, UserOutlined } from "@ant-design/icons";

const Sidebar: React.FC = () => {
    const [clickedItem, setClickedItem] = useState("");

    const handleClick = (itemName: string) => {
        setClickedItem(itemName);
    };

    return (
        <>
            <div className="fixed top-5 bg-gray-50 h-full w-20 my-4  text-center shadow-xl">
                <div className="h-full mx-1 my-4">
                    {/* <div className="text-center items-center flex mx-1 border-b-2">
                        <Logo className="w-10 h-10" />
                        <h1 className="text-sm font-serif uppercase text-white mb-5">
                            Toyota Management
                        </h1>
                    </div> */}
                <Link to='/baocao'>
                    <div
                        className={`w-full h-11 mt-14 text-black rounded-md hover:text-neutral-600  font-bold flex flex-col items-center justify-center ${clickedItem === 'dashboard' ? 'text-sky-600' : ''}`}
                        onClick={() => handleClick('dashboard')}
                    >
                        <PieChartOutlined className="text-2xl" />
                        <h1 className="text-center uppercase text-xs font-mono font-light mt-1">Report</h1>
                    </div>
                </Link>

                <Link to='/danhsach'>
                    <div
                        className={`w-full h-11 mt-5 text-black rounded-md hover:text-neutral-600 font-bold flex flex-col items-center justify-center ${clickedItem === 'sanpham' ? 'text-sky-600' : ''}`}
                        onClick={() => handleClick('sanpham')}
                    >
                        <CarOutlined className="text-2xl" />
                        <h1 className="text-center uppercase text-xs font-mono font-light w-full mt-1">Product</h1>
                    </div>
                </Link>


                <Link to='/daily'>
                    <div
                        className={`w-full h-11 mt-5 text-black rounded-md hover:text-neutral-600 font-bold flex flex-col items-center justify-center ${clickedItem === 'daily' ? 'text-sky-600' : ''}`}
                        onClick={() => handleClick('daily')}
                    >
                    <ShopOutlined className="text-2xl"></ShopOutlined>
                        <h1 className="text-center uppercase text-xs font-mono font-light w-full mt-1">Agency</h1>
                    </div>
                </Link>

                <Link to='/nhanvien'>
                    <div
                        className={`w-full h-11 mt-5 text-black rounded-md hover:text-neutral-600 font-bold flex flex-col items-center justify-center ${clickedItem === 'nhanvien' ? 'text-sky-600' : ''}`}
                        onClick={() => handleClick('nhanvien')}
                    >
                        <IdcardOutlined className="text-2xl" />
                        <h1 className="text-center uppercase text-xs font-mono font-light w-full mt-1">Employee</h1>
                    </div>
                </Link>

                <Link to='/khachhang'>
                    <div
                        className={`w-full h-11 mt-5 text-black rounded-md hover:text-neutral-600 font-bold flex flex-col items-center justify-center ${clickedItem === 'khachhang' ? 'text-sky-600' : ''}`}
                        onClick={() => handleClick('khachhang')}
                    >
                        <UserOutlined className="text-2xl" />
                        <h1 className="text-center uppercase text-xs font-mono font-light w-full mt-1">customer</h1>
                    </div>
                </Link>

                <Link to='/donhang'>
                    <div
                        className={`w-full h-11 mt-5 text-black rounded-md hover:text-neutral-600 font-bold flex flex-col items-center justify-center ${clickedItem === 'donhang' ? 'text-sky-600' : ''}`}
                        onClick={() => handleClick('donhang')}
                    >
                        <ShoppingOutlined  className="text-2xl" />
                        <h1 className="text-center uppercase text-xs font-mono font-light w-full mt-1">order</h1>
                    </div>
                </Link>

                <Link to='/baoduong'>
                    <div
                        className={`w-full h-11 mt-5 text-black rounded-md hover:text-neutral-600 font-bold flex flex-col items-center justify-center ${clickedItem === 'baoduong' ? 'text-sky-600' : ''}`}
                        onClick={() => handleClick('baoduong')}
                    >
                        <SettingOutlined   className="text-2xl" />
                        <h1 className="text-center uppercase text-xs font-mono font-light w-full mt-1">maintain</h1>
                    </div>
                </Link>
                

                </div>
            </div>
        </>
    );
};

const Navbar = () => {
    const [visible,setVisible] =useState<boolean>(false)
    const handleOpenAccount = () =>{
        navigate('/taikhoan')
    }
    const navigate = useNavigate()
    const handleOpenAuthen = () => {
        setVisible(!visible);
      };
    
      const handleLogout = () => {
        if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
          localStorage.removeItem('login');
          navigate('/');
        }
      };
    return(
        <>
            <Sidebar />
            <div className=" bg-slate-900 shadow-2 h-16 w-full text-center fixed float-right">
                <div className="flex justify-between container mx-auto h-full items-center">
                    <DingdingOutlined  className=" ml-1 text-white text-4xl" />
                    <div className="flex items-center  ">
                        <p className="uppercase mr-3 text-pretty text-sm font-mono font-bold  text-blue-300 space-x-2">admin</p>
                        <Avatar className="mr-4 bg-white" onClick={handleOpenAuthen}></Avatar>
                    </div>
                </div>
            </div>  

      {visible && (
        <div className="absolute top-0 right-0 bg-gray-700 p-5 my-16 z-10">
          <button className="text-blue-200 hover:underline" onClick={handleLogout}>
            Đăng xuất
          </button>
          <br />
          <button className="text-green-200 hover:underline" onClick={handleOpenAccount}>
            Quản lý tài khoản
          </button>
        </div>
      )}
        </>
        
    );
};

export default Navbar;
