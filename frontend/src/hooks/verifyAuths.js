// hooks/verifyAuths.js
import axios from 'axios';

async function verifyAuths(token) {
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
        }

        return null;
    } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        return null;
    }
}

export default verifyAuths;
