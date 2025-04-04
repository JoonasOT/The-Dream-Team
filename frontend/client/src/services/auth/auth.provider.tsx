/* Lib imports */
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

/* Types */
import { AuthToken } from "../../types/Auth";
import { createPredictions, initML } from "../score/score.service";

type AuthProviderType = {
    isLoggedIn: boolean,
    token: AuthToken | undefined,
    setToken: (newToken?: AuthToken) => void
}

type AuthProviderProps = {
    children?: ReactNode
}

const AuthContext = createContext<AuthProviderType>({ isLoggedIn: false, token: undefined, setToken: () => {} });

const getToken = (): AuthToken | undefined => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: token } : undefined;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    // State to hold the authentication token
    const [token, _setToken] = useState<AuthToken | undefined>(getToken());

    const setToken = (newToken?: AuthToken) => {
        _setToken(newToken);
        window.location.reload();
        if (newToken) {
            initML(newToken)
                .then(() => console.log("[INIT ML]"))
                .then(() => createPredictions(newToken).then(() => console.log("[CREATED PREDICTIONS]")).catch(console.log))
                .catch(console.log);
        }
    };

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token.Authorization);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    const contextValue = useMemo(
        () => ({
            isLoggedIn: token !== undefined,
            token,
            setToken,
        }),
        [token]
    );
    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
