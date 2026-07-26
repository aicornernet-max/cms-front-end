import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import { getMe, logout as logoutApi } from "../api/auth.api";

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: string;
}

interface AuthContextType {
    user: AuthUser | null;
    authenticated: boolean;
    loading: boolean;
    refreshUser: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);


    const refreshUser = async () => {
        try {
            const response = await getMe();

            setUser(response.data.data);
            setAuthenticated(true);
        } catch {
            setUser(null);
            setAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await logoutApi();
        } finally {
            setUser(null);
            setAuthenticated(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                authenticated,
                loading,
                refreshUser,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}