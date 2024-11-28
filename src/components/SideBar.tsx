import React, { useState } from "react";
import "../assets/styles/SideBar.css"; // Import the new styles
import { Logo } from "./Logo";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";

const menuItems = [
  { name: "Users", url: "/users" },
  // { name: "PPT", url: "/ppt" },
  { name: "Quiz", url: "/quiz" },
];

export const SideBar: React.FC = () => {
  const currentActive = localStorage.getItem("activeItem");

  console.log(currentActive);

  const [activeItem, setActiveItem] = useState<any>(
    currentActive ? currentActive : menuItems[0]
  );

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="sidebar">
      {/* <Logo /> */}
      <Typography sx={{mt:4,fontWeight:700,fontSize:'1.25rem'}}>HYPER</Typography>
      <ul>
        {menuItems.map((data: any, index: any) => (
          <li key={index}>
            <Link
              style={{ color: activeItem.name === data.name ? "#18bc9c" : "" }}
              onClick={(e) => {
                e.preventDefault(); // Prevent the default behavior
                setActiveItem(data); // Set active item
                localStorage.setItem("activeItem", JSON.stringify(data)); // Store active item
                navigate(data.url); // Manually navigate
              }}
              to={data.url}
            >
              {data.name}
            </Link>
          </li>
        ))}
      </ul>
      <button className="button logout-btn" onClick={logout}>
        logout
      </button>
    </nav>
  );
};
