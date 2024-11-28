import React, { useEffect } from "react";
import { SideBar } from "../components/SideBar";
import "../assets/styles/DashboardContainer.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
    children: React.ReactNode;
}

export const DashboardContainer: React.FC<LayoutProps> = ({ children }) => {

    return (
        <div className="layout">
            <SideBar/>
            <div className="content">
                
                {children}
            </div>
        </div>
    )
}