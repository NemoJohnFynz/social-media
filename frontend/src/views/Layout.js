import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./navbar/navBar";
import LeftListMenu from "./menu/LeftMenuList";
import authToken from "../components/authToken";
import { useEffect } from "react";
import { UserProvider } from "../service/UserContext";

export default function Layout() {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated
        if (!authToken.getToken()) {
            navigate("/login");
            return;
        }

        // WebSocket setup
        // const handleOpen = () => {
        //     console.log("WebSocket connection establishedsssssssssssssssss");
        //     socket.send("Connection establishedssssssssssssssssssssssssssss");
        // };

        // const handleMessage = (event) => {
        //     console.log("Message from server socket:", event);
        // };

        // const handleError = (error) => {
        //     console.error("WebSocket error:", error);
        // };

        // socket.addEventListener("open", handleOpen);
        // socket.addEventListener("newmessage", handleMessage);
        // socket.addEventListener("friendrequest", handleMessage);
        // socket.addEventListener("error", handleError);

        // // Cleanup WebSocket listeners on component unmount
        // return () => {
        //     socket.removeEventListener("open", handleOpen);
        //     socket.removeEventListener("newmessage", handleMessage);
        //     socket.removeEventListener("friendrequest", handleMessage);
        //     socket.removeEventListener("error", handleError);
        // };
    }, [navigate]);

    return (
        <UserProvider>
            <div className="grid gap-[64px] " style={{ minWidth: '1100px' }} >
                <div>
                    <Navbar />
                </div>
                <Outlet />
            </div>
        </UserProvider>
    );
}
