import { Navigate, Outlet } from "react-router-dom";

type RootLayoutProps = {
  allowedRole: string;
};

const notExpiredToken = (token: string): boolean => {
  const tokenPayload = JSON.parse(atob(token.split(".")[1]));
  const expirationTime = tokenPayload.exp;
  const currentTime = Math.floor(Date.now() / 1000);

  return expirationTime > currentTime;
};

const RootLayout = ({ allowedRole }: RootLayoutProps) => {
  const auth = localStorage.getItem("user_data");
  
  if (auth) {
    const userData = JSON.parse(auth);
    const role = userData.role;
    const accessToken = userData.accessToken;

    if(notExpiredToken(accessToken) && role === allowedRole ){
      return <Outlet />
    } else{
      localStorage.clear()
      return <Navigate to="/login" />
    }
    
  }else{
    return <Navigate to="/login" />;
  }

};

export default RootLayout;
