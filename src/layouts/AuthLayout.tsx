import { AuthProvider, useAuth } from "@/hooks/useAuth";
import React from "react";
import { useNavigate, useOutlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const AuthLayout: React.FC = ({}) => {
  const outlet = useOutlet();
  return (
    <AuthProvider>
      <div className="h-screen w-screen flex items-center justify-center font-poppins text-xl">
        {outlet}
        <ToastContainer />
      </div>
    </AuthProvider>
  );
};
export default AuthLayout;
