import React, { createContext, useContext, ReactNode, useState } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string, schoolName: string, schoolCode: string, userName: string, logo: string) => void;
    logout: () => void;
    token: string | null;
    schoolName: string | null;
    schoolCode: string | null;
    userName: string | null;
    logo: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return localStorage.getItem("authToken") ? true : false;
    });
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem("authToken");
    });
    const [schoolName, setSchoolName] = useState<string | null>(() => {
        return localStorage.getItem("schoolName");
    });
    const [schoolCode, setSchoolCode] = useState<string | null>(() => {
        return localStorage.getItem("schoolCode");
    });
    const [userName, setUserName] = useState<string | null>(() => {
        return localStorage.getItem("userName");
    });

    const [logo, setLogo] = useState<string | null>(() => {
        return localStorage.getItem("logo");
    });


    const login = (token: string, schoolName: string, schoolCode: string, userName: string, logo: string) => {
        setToken(token);
        setSchoolName(schoolName);
        setSchoolCode(schoolCode);
        setUserName(userName);
        setLogo(logo);
        localStorage.setItem("authToken", token);
        localStorage.setItem("schoolName", schoolName);
        localStorage.setItem("schoolCode", schoolCode);
        localStorage.setItem("userName", userName);
        localStorage.setItem("logo", logo);
        setIsAuthenticated(true);
    }

    const logout = () => {
        setToken(null);
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, token, schoolName, schoolCode, userName, logo }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context; // Return the context
};