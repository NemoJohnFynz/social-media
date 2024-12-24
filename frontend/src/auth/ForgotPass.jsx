import React, { useState } from 'react';
import bg from './background_auth.jpg';
import { forgotPassword, resetPassword, verifyOTP } from '../service/ForgotPassword';

export default function ForgotPass() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpVisible, setOtpVisible] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [verifyButtonVisible, setVerifyButtonVisible] = useState(true);

    const handleChange = (e) => setEmail(e.target.value);
    const handleOtpChange = (e) => setOtp(e.target.value);
    const handlePasswordChange = (e) => setNewPassword(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await forgotPassword(email);
        if (response) {
            alert('OTP đã được gửi đến email của bạn');
            setOtpVisible(true);
        } else {
            alert('Email không tồn tại');
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const response = await verifyOTP(email, otp);
        if (response) {
            alert('OTP đã được xác thực');
            setPasswordVisible(true);
            setVerifyButtonVisible(false);
        } else {
            alert('Mã OTP không đúng');
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        const response = await resetPassword(email, otp, newPassword);
        if (response) {
            alert('Mật khẩu đã được thay đổi');
            window.location.href = '/login';
        } else {
            alert('Có lỗi xảy ra, vui lòng thử lại sau');
        }
    };

    return (
        <div
            className="h-screen flex items-center justify-center"
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="max-w-md w-full bg-white bg-opacity-90 rounded-xl shadow-2xl backdrop-blur-md p-8 transform transition-transform duration-300">
                <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-6">Quên mật khẩu?</h2>
                <p className="text-center text-gray-600 mb-8">
                    Nhập email của bạn để nhận mã OTP và đặt lại mật khẩu.
                </p>
                <form className="space-y-6">
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 bg-gray-100 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="example@example.com"
                        />
                    </div>

                    {/* OTP Input */}
                    {otpVisible && (
                        <div>
                            <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2">
                                Mã OTP
                            </label>
                            <input
                                id="otp"
                                type="text"
                                value={otp}
                                onChange={handleOtpChange}
                                className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 bg-gray-100 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Nhập mã OTP"
                            />
                            {verifyButtonVisible && (
                                <button
                                    onClick={handleVerify}
                                    className="w-full py-3 mt-4 text-white font-semibold bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-lg hover:from-purple-600 hover:to-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                                >
                                    Xác thực OTP
                                </button>
                            )}
                        </div>
                    )}

                    {/* New Password Input */}
                    {passwordVisible && (
                        <div>
                            <label
                                htmlFor="newPassword"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Mật khẩu mới
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 bg-gray-100 rounded-lg shadow-inner focus:ring-2 focus:ring-green-500 focus:outline-none"
                                placeholder="Nhập mật khẩu mới"
                            />
                            <button
                                onClick={handleReset}
                                className="w-full py-3 mt-4 text-white font-semibold bg-gradient-to-r from-green-500 to-teal-500 rounded-lg shadow-lg hover:from-green-600 hover:to-teal-600 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
                            >
                                Đặt lại mật khẩu
                            </button>
                        </div>
                    )}

                    {/* Send OTP Button */}
                    {!otpVisible && !passwordVisible && (
                        <button
                            onClick={handleSubmit}
                            className="w-full py-3 text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                        >
                            Gửi mã OTP
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}
