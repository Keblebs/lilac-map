import { Navigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

function Auth() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    let body = {
      code: code,
      redirect_uri: import.meta.env.VITE_CALLBACK_URL,
      client_id: import.meta.env.VITE_CLIENT_ID,
      client_secret: import.meta.env.VITE_CLIENT_SECRET,
    }

    try {
      let response = axios.post(import.meta.env.VITE_VALIDAR_CIDADAO, body).then((response) => {
        Cookies.set('token', response?.data?.access_token, { expires: 1 });
      });
    } catch (error) {
      console.log(error);
    }

  }, [searchParams]);
  return <Navigate to="/" />
}

export default Auth;
