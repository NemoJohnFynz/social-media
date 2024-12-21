import { Outlet, Link, useNavigate } from "react-router-dom";
import Navbar from "./navbar/navBar";
import LeftListMenu from "./menu/LeftMenuList";
import authToken from "../components/authToken";
import { useEffect, useState } from "react";
import { profileUserCurrent } from "../service/ProfilePersonal";
import { UserProvider } from "../service/UserContext";
export default function Layout() {

    const navigate = useNavigate();
    useEffect(() => {
        if (!authToken.getToken()) {
            navigate("/login");
            return;
        }
    }, [navigate]);
    return (
        <UserProvider>
            <div className="grid gap-[64px] ">
                <div>
                    <Navbar />
                </div>
                <Outlet />
            </div>
        </UserProvider>
    )
};
