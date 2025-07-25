import { Navigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

function Auth() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
  }, [searchParams]);
  return <Navigate to="/" />
}

export default Auth;
