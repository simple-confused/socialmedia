import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "./constant";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [loggedUser, setLoggedUser] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${USER_API_END_POINT}/user`, { withCredentials: true })
      .then((response) => {
        setLoggedUser(response.data.user);
      })
      .catch((error) => {
        navigate("/");
        // console.error(error);
      });
  }, []);

  return <>{children}</>;
};

export default ProtectedRoute;
