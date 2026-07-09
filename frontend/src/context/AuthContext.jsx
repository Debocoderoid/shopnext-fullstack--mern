import React, { createContext, useState, useCallback, useMemo } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(
        localStorage.getItem("userInfo")
            ? JSON.parse(localStorage.getItem("userInfo"))
            : null
    );

    const login = useCallback((userData) => {
        setUser(userData);
        localStorage.setItem("userInfo", JSON.stringify(userData));
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem("userInfo");
    }, []);

    const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
