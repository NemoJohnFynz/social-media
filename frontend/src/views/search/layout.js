import { Outlet } from "react-router-dom";

export default function LayoutSearch() {
    const handChaneSearch = () => {
    }
    return (
        <div className="flex row">
            <div className="flex flex-col shadow-md shadow-slate-500 w-1/5 min-h-screen fixed items-center px-4">
                <div className="w-full border-b border-b-gray-400 py-4 text-2xl">
                    <strong>Kết quả tìm kiếm</strong>
                </div>
                <div className="flex flex-col w-full pt-3">
                    <strong className="pb-2">Bộc lọc</strong>
                    <button className="w-full p-3 pl-5 rounded-2xl text-start hover:bg-blue-100 ">
                        <strong>Tất cả</strong>
                    </button>
                    <button className="w-full p-3 pl-5 rounded-2xl text-start hover:bg-blue-100">
                        <strong>Bài viết</strong>
                    </button>
                    <button className="w-full p-3 pl-5 rounded-2xl text-start hover:bg-blue-100">
                        <strong>Mọi người</strong>
                    </button>
                </div>
            </div>
            <div className="ml-[20%] w-[80%] sm:px-20 md:px-40 lg:px-60">
                <Outlet />
            </div>
        </div>
    )
};
