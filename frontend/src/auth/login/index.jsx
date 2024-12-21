import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authToken from '../../components/authToken';
import NotificationCss from '../../module/cssNotification/NotificationCss';

export default function Login() {
    const [formData, setFormData] = useState({
        numberPhone: '0372830048',
        password: 'Adsads1234@#',
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Form validation
    const validateForm = () => {
        const validationErrors = {};
        if (!formData.numberPhone) validationErrors.numberPhone = 'Bắt buộc nhập số điện thoại';
        if (!formData.password) validationErrors.password = 'Bắt buộc nhập mật khẩu';
        return validationErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await axios.post('http://localhost:3001/user/login', formData);
                if (response.status === 201) {
                    authToken.setToken(response.data.accessToken); // Save token
                    toast.success('Đăng nhập thành công! Chào mừng bạn trở lại.', NotificationCss.Success);
                    setTimeout(() => navigate('/'), 2000); // Redirect after 3 seconds
                } else {
                    toast.error('Đăng nhập thất bại, vui lòng thử lại!', NotificationCss.Fail);
                }
            } catch (error) {
                console.error('Lỗi:', error.response ? error.response.data : error.message);
                toast.error(error.response?.data?.message || 'Đăng nhập thất bại!',NotificationCss.Fail);
            }
        } else {
            setErrors(validationErrors);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <div className='bg-gradient-to-r from-[#24C6DC] to-[#514A9D] h-screen grid place-items-center'>
            <form
                onSubmit={handleSubmit}
                method='POST'
                className='text-black rounded-2xl bg-white px-12 py-8 min-w-[500px]'
            >
                <h1 className='font-bold text-3xl text-center pt-[48px]'>Đăng nhập</h1>

                <div className='mb-4 pt-[24px]'>
                    <label htmlFor="numberPhone" className="block text-gray-700 text-sm font-bold mb-2">Tài khoản</label>
                    <input
                        type="text"
                        name="numberPhone"
                        value={formData.numberPhone}
                        onChange={handleChange}
                        className="bg-white shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Nhập số điện thoại"
                    />
                    {errors.numberPhone && <p style={{ color: 'red' }} className="error">{errors.numberPhone}</p>}
                </div>

                <div className='mb-4'>
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                        Mật khẩu
                        <Link to="#" className="float-right font-normal text-gray-500 hover:text-gray-700">Quên mật khẩu?</Link>
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="bg-white shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Nhập mật khẩu"
                    />
                    {errors.password && <p style={{ color: 'red' }} className="error">{errors.password}</p>}
                </div>

                <button type="submit" className="btn btn-primary w-full mb-8">Đăng nhập</button>

                <div className='flex justify-center items-center mb-2'>
                    <div>hoặc đăng nhập bằng</div>
                </div>
                <div className='grid justify-center mb-4'>
                    <div className='border-2 p-2 rounded-xl border-yellow-400 font-semibold flex items-center gap-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="22.875" viewBox="0 0 488 512">
                            <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                        </svg>
                        GOOGLE
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <span className="inline-block align-baseline">Bạn chưa có tài khoản?</span>
                    <Link to="/register" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                        Đăng ký ngay
                    </Link>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}
