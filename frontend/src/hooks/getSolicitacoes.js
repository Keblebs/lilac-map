import axios from 'axios';

export async function getSolicitacoes() {
    // console.log(slug, key);
    // if (!slug || !key) {
    //     console.log('Chave ou slug não informados');
    //     return
    // }
    const response = await axios.get(import.meta.env.VITE_CARREGAR_SOLICITACOES);
    console.log(import.meta.env.VITE_CARREGAR_SOLICITACOES)
    return response.data;
}