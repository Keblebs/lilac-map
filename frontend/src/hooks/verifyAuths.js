// hooks/verifyAuths.js
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

async function verifyAuths(token) {
    function login() {
        window.location.replace(import.meta.env.VITE_LOGIN);
    }

    try {
        const body = { access_token: token };
        const res = await axios.post(import.meta.env.VITE_CHECAR_CIDADAO, body);

        if (res?.data?.logado) {
            const headers = { Authorization: `Bearer ${token}` };

            const [perfilRes, permsRes] = await Promise.all([
                axios.get(import.meta.env.VITE_PERFIL_CIDADAO, { headers }),
                axios.get(import.meta.env.VITE_CHECAR_PERMISSOES, { headers })
            ]);

            return {
                dados: perfilRes.data,
                permissoes: permsRes.data
            };
        } else {
            login();
        }

        return null;
    } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        login();
        return null;
    }
}

export default verifyAuths;
