import { useState, useEffect } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { InboxIcon, UserGroupIcon, UsersIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { Button, Typography, Box, IconButton, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

import AllFriend from "./leftMenu/allFriend";
import AllGroup from "./leftMenu/allGroup";
import AllInbox from "./leftMenu/allInbox";
import ToolInbox from "./rightMenu/toolInbox";
import ToolGroup from "./rightMenu/toolGroup";

import { MessengerContext } from "../layoutMessenger";

const RightMessenger = () => {
    const { content } = useContext(MessengerContext);
    const [alignment, setAlignment] = useState("inbox");
    const navigate = useNavigate(); // React Router navigation function
    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    const renderContent = () => {
        switch (content) {
            case "inbox":
                return <ToolInbox />;
            case "group":
                return <ToolGroup />;
            default:
                return <ToolInbox />;
        }
    };
    return (
        <div className=" h-full flex flex-col bg-gray-100">
            {/* Nội dung động */}

            <div className=" min-w-80 h-full">
                {renderContent()}
            </div>
        </div>
    );
};

export default RightMessenger;
