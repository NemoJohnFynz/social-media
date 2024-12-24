import React, { useState, useEffect } from 'react';
import Files from "./component/files";
import PictureAndVideo from "./component/pictureAndVideo";
import ListMemberGroup from './component/listMemberGroup';

const ToolGroup = () => {
    return (
        <div className="flex flex-col h-full">
            <div className="bg-white border-b border-l-2 flex justify-between items-center h-[56px]">
                <strong className="text-center w-full">Thông tin nhóm</strong>
            </div>

            <div className="overflow-y-scroll flex-1 custom-scroll">
                <ListMemberGroup />
                <PictureAndVideo />
                <Files />
            </div>


        </div>
    );
};

export default ToolGroup;
