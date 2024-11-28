import React from "react"
import logo from "../assets/images/entab.png";
import "../assets/styles/Logo.css"

export const Logo: React.FC = () => {
    return (
        <div className="logo-container">
            <img src={logo} alt="Company Logo" className="logo" />
        </div>
    )
}