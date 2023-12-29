import { createContext, useState, FC } from "react";

type AuthData = {
  role: string;
  accessToken: string;
};

type AuthContextType = {
  auth: AuthData;
  setAuth: React.Dispatch<React.SetStateAction<AuthData>>;
};

const AuthContext = createContext<AuthContextType>({
  auth: {
    role: "",
    accessToken: "",
  },
  setAuth: () => {},
} as AuthContextType);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthData>({
    role: "",
    accessToken: "",
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
