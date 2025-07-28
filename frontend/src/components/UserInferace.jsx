import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import verifyAuths from "../hooks/verifyAuths";
import { useNavigate } from "react-router-dom";

function UserInterface() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = Cookies.get("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const check = async () => {
      setLoading(true);
      const auths = await verifyAuths(token);
      if (auths) {
        setUser(auths);
      }
      setLoading(false);
    };

    check();
  }, [token]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!token) {
    return (
      <div>
        <button>Login</button>
      </div>
    );
  }

  console.log(user);

  return (
    <div className="absolute top-2 left-2 z-9999 p-2 bg-white rounded">
      {user?.dados ? (
        <div>
          <p>{user.dados[0].nome}</p>
          <button
            onClick={() => {
              Cookies.remove("token");
              window.location.href = (import.meta.env.VITE_LOGOUT);
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <p>Usuário não autenticado.</p>
      )}
    </div>
  );
}

export default UserInterface;
