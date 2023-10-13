import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = (props) => {
  const jwtToken = localStorage.getItem("jwtToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!jwtToken || jwtToken === "null") {
      navigate("/login", { replace: true });
    }
  }, [jwtToken]);

  return <>{props.component}</>;
};

export default ProtectedRoute;
