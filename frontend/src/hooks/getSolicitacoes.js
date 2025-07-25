import axios from 'axios';

export async function getSolicitacoes() {
    // console.log(slug, key);
    // if (!slug || !key) {
    //     console.log('Chave ou slug não informados');
    //     return
    // }
    const response = await axios.get(`https://forms-homo.salvador.ba.gov.br/api/flow/integracao-externa/solicitacao/?chave_integracao=d1bdc7f5-951b-4180-9417-849d7754ff1e&fluxo=spmj-botao-lilas20`);
    return response.data;
}