import { Outlet } from "react-router-dom";
import LeftMessenger from "./components/LeftMessenger";
export default function LayoutMessenger() {
    return (
        <div className="h-screen flex flex-row bg-gray-100 text-black" style={{ marginTop: '-68px', paddingTop: '68px' }}>
            <div className='w-1/4 h-full'>
            {/* {chanecontainer ? 'w-1/4 h-full' : 'w-full h-full'} */}
                <LeftMessenger />
                {/* bt_chanetransfer={() => setTransfer(!transfer)}  */}
            </div>
            <div className="w-full">
                <Outlet />
            </div>
        </div>
    )
};
