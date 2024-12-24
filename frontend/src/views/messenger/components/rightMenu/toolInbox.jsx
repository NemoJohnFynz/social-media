import Files from "./component/files";
import PictureAndVideo from "./component/pictureAndVideo";

const ToolInbox = () => {
    return (
        <div className="flex flex-col h-full">
            <div

                className={`bg-white border-b flex border-l-2 justify-center items-center h-[56px]`}
            >
                <strong className="w-full text-center text-nowrap">Thông tin hội thoại</strong>
            </div>
            <div className="overflow-y-scroll flex-1 custom-scroll">
                <PictureAndVideo />
                <Files />
                {/* <Files />
                <Files /> */}
            </div>
            
            {/* <div className="p-4 border-t-2 bg-white shadow-sm">
                <strong>Footer content or actions here</strong>
            </div> */}
        </div>

    );
}

export default ToolInbox;