import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../utils/userStorage";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const user = getCurrentUser();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          successNotice: "Please log in with your account to access the protected student dashboard.",
        }}
      />
    );
  }

  return <>{children}</>;
}
