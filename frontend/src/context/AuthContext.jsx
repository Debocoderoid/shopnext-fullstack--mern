import React, { createContext, useState } from "react";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    const login = (userData) => {
        setUser(userData)
        localStorage.setItem("userInfo")
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("userInfo")
    }

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}