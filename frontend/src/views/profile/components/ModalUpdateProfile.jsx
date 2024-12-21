import React, { useState, useEffect } from "react";

import { profileUserCurrent, updateInformation } from "../../../service/ProfilePersonal";


const ModalUpdateProfile = () => {
    const [dataProfile, setDataProfile] = useState({})
    const [formData, setFormData] = useState({
        birthday: "",
        gender: "",
        address: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const fetchdata = async () => {
            const response = await profileUserCurrent();
            if (response && response.data) {
                setDataProfile(response.data)
            }
        }
        fetchdata()
    }, [])
    useEffect(() => {
        if (dataProfile.birthday || dataProfile.gender || dataProfile.address) {
            setFormData({
                birthday: dataProfile.birthday || "",
                gender: dataProfile.gender || "",
                address: dataProfile.address || ""
            });
        }
    }, [dataProfile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true)
            await updateInformation(formData.birthday, formData.gender, formData.address);
            setIsLoading(false);
            alert('Cập nhật thành công');
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        } finally {
            window.location.reload();
        }
    };
    console.log(dataProfile)
    return (
        <dialog id="my_modal_1" className="modal">
            <div className="modal-box w-11/12 max-w-xl">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-12">
                        <h3 className="font-bold text-2xl  my-5 text-center">Cập nhật thông tin</h3>
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 hover:bg-red-600 hover:text-white">✕</button>
                        </form>

                        <div className="border-b border-gray-900/10 pb-12">

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="col-span-full">
                                    <label htmlFor="birthday" className="block text-sm font-medium leading-6 text-gray-900">
                                        Ngày/tháng/năm sinh
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            name="birthday"
                                            value={formData.birthday}
                                            onChange={handleInputChange}
                                            type="date"
                                            autoComplete="birthday"
                                            className="block w-full rounded-md border-0 py-3 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900">
                                        Giới tính
                                    </label>
                                    <div className="mt-2">
                                        {formData.gender === true ? (
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleInputChange}
                                                autoComplete="country-name"
                                                className="block w-full rounded-md border-0 py-3 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            >
                                                <option value={true}>Nam</option>
                                                <option value={false}>Nữ</option>
                                            </select>
                                        ) : (
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleInputChange}
                                                autoComplete="country-name"
                                                className="block w-full rounded-md border-0 py-3 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            >
                                                <option value={false}>Nữ</option>
                                                <option value={true}>Nam</option>
                                            </select>
                                        )}
                                    </div>
                                </div>
                                <div className="col-span-full">
                                    <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                                        Bạn đang ở
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            name="address"
                                            type="text"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            autoComplete="street-address"
                                            className="block w-full px-2 text-wrap rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                    <div className="modal-action mt-6 flex items-center justify-end gap-4">
                        <form method="dialog">
                            <button type="btn" className="btn text-sm font-semibold rounded-md bg-red-600 px-3 py-2 text-white hover:bg-red-500">
                                Hủy
                            </button>
                        </form>
                        <button type='submit' className="btn bg-sky-600 text-white hover:bg-sky-500">Cập nhật</button>
                    </div>
                </form >

            </div>
        </dialog>

    );
};

export default ModalUpdateProfile;