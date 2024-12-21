import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
    const [formData, setFormData] = useState({
        numberPhone: '',
        firstName: '',
        lastName: '',
        address: '',
        gender: '',
        birthday: '',
        password: '',
        // confirmPassword: '',
    });
    // const user = async () = await axios
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});

    const validateForm = () => {

        if (!formData.password) errors.password = 'Bắt buộc nhập mật khẩu';
        if (formData.password.length < 8) {
            errors.password = 'Mật khẩu quá ngắn';
        }
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Mật khẩu không khớp nhau';
        }
        return errors;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            try {
                const { confirmPassword, ...dataToSubmit } = formData;
                const response = await axios.post('http://localhost:3001/user/register', dataToSubmit);

                if (response.status === 201) {
                    alert('Đăng ký thành công!');
                    navigate('/login')
                }

                // Xử lý thành công (ví dụ: chuyển hướng sang trang khác)
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    // Check for specific error message from the API
                    if (error.response.status === 409) {
                        alert('Số điện thoại đã tồn tại, vui lòng sử dụng số điện thoại khác.');
                    }
                } else {
                    alert('Đăng ký thất bại, vui lòng thử lại!');
                }
                console.error('Lỗi:', error.response ? error.response.data : error.message);
            }
        } else {
            setErrors(validationErrors);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    return (
        <div className='bg-gradient-to-r from-[#514A9D] to-[#24C6DC] h-screen grid place-items-center'>
            <form method='POST'
                onSubmit={handleSubmit}
                className='text-black rounded-2xl bg-white px-10 py-8'
            >
                <h1 className='font-bold text-3xl text-center pt-[15px]'>Đăng ký</h1>
                <div className='flex gap-20 mt-6 mb-4'>
                    <input
                        type="text"
                        name="lastName"
                        className="bg-white shadow appearance-none border rounded w-full py-4 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Họ"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="firstName"
                        className="bg-white shadow appearance-none border rounded w-full py-4 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Tên"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='grid gap-3'>
                    <input
                        type="tel"
                        name="numberPhone"
                        className="bg-white shadow appearance-none border rounded w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Số điện thoại"
                        value={formData.numberPhone}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="date"
                        name="birthday"
                        className='border-black bg-white shadow appearance-none border rounded w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline'
                        value={formData.birthday}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="address"
                        className="bg-white shadow appearance-none border rounded w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Địa chỉ"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                    <select
                        name='gender'
                        className="bg-white shadow appearance-none border rounded w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                    >
                        <option disabled value="">Giới tính</option>
                        <option value="true">Nam</option>
                        <option value="false">Nữ</option>
                    </select>
                    <input
                        type="password"
                        name="password"
                        className="bg-white shadow appearance-none border rounded w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Mật khẩu"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                    <input
                        type="password"
                        name="confirmPassword"
                        className="bg-white shadow appearance-none border rounded w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Nhập lại mật khẩu"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    {errors.confirmPassword && (
                        <p style={{ color: 'red' }}>{errors.confirmPassword}</p>
                    )}
                    <button type="submit" className="btn btn-primary w-full mb-3 text-white">
                        Đăng ký
                    </button>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <span className="inline-block align-baseline">Bạn đã có tài khoản?</span>
                    <Link to="/login" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                        Đăng nhập ngay
                    </Link>
                </div>
            </form>
        </div>
    );
}
