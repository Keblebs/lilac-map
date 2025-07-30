import { useEffect, useState } from "react";
import { CircleX } from "lucide-react";
import Cookies from "js-cookie"; // caso o token esteja armazenado em cookie
import axios from "axios";
import verifyAuths from "../hooks/verifyAuths";

function FileUploader() {
  const [opened, setOpened] = useState(false);
  const [solicitacao, setSolicitacao] = useState({});
  const [filesQtd, setFilesQtd] = useState(0);

  useEffect(() => {
    function abrirForm(e) {
      setOpened(true);
      axios
        .get(import.meta.env.VITE_GET_ID + e.detail.solicitacao.identificador)
        .then((response) => {
          setSolicitacao({
            id: response?.data[0],
            identificador: e.detail.solicitacao.identificador,
          });
        });

      let solicitacao = e.detail.solicitacao;
      setFilesQtd(e.detail.filesQtd)
      document.querySelector("#nome").value = solicitacao["Nome Completo"];
      setSolicitacao(e.detail.solicitacao);
    }

    window.addEventListener("abrirForm", abrirForm);
    return () => window.removeEventListener("abrirForm", abrirForm);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    let descricao = ''
    formData.entries().forEach(([key, value]) => {
      if (key == 'solicitacao' || key == 'arquivo') return
      console.log(key, value);
      descricao += `${key}=${value};`
    })

    const token = Cookies.get("token"); // ou outro jeito de obter o token
    let newFormData = new FormData();
    newFormData.append("solicitacao", solicitacao.id);
    newFormData.append("assunto", `BEOC ${filesQtd + 1} ${new Date().toLocaleDateString("pt-BR")}`);
    newFormData.append("descricao", descricao);
    newFormData.append("arquivo", formData.get("arquivo"));
    try {
      await fetch(
        `${import.meta.env.VITE_ANEXAR_INTERNO}${solicitacao.identificador}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Type' NÃO DEVE ser definido manualmente com FormData!
          },
          body: newFormData,
        }
      );
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Erro inesperado.");
    }
    setOpened(false)
  };

  return (
    <div
      className={`absolute flex flex-col items-center justify-center w-full h-full top-0 left-0 z-10001 gap-4 ${
        !opened ? "hidden" : ""
      } overflow-auto bg-black/85 p-5`}
    >
      {/* <CircleX
        className="absolute top-4 right-4 cursor-pointer"
        size={50}
        color="#ffffff"
        onClick={() => setOpened(false)}
      /> */}

      <form
        className="w-3/5 m-auto p-2 bg-white rounded-2xl overflow-y-auto"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-2 gap-4  relative h-full w-full p-1 overflow-y-auto">
          <a
          className="absolute top-0 right-0 cursor-pointer hover:bg-red-400  w-10 h-10 flex items-center justify-center font-bold transition-colors duration-100"
          onClick={() => setOpened(false)}
        >
          <CircleX size={30} color="#000000" />
        </a>

        <input type="hidden" name="solicitacao" value={solicitacao.id || ""} />
        {/* <img className="absolute top-5 left-5 w-20 h-20 flex items-center justify-center font-bold transition-colors duration-100" src="https://forms-homo.salvador.ba.gov.br/uploads/documentos/6cae515fa9a8415f9adb956541ced641.png"></img> */}

        <div className="col-span-2 text-center font-bold grid grid-cols-4">
          <img
            className="w-20 h-20 flex items-center justify-center font-bold transition-colors duration-100"
            src="https://forms-homo.salvador.ba.gov.br/uploads/documentos/6cae515fa9a8415f9adb956541ced641.png"
          ></img>
          <label className="text-2xl col-span-2">
            <label className="text-xl">BEOC<br/></label>
            
            Boletim Eletrônico de Ocorrência de Campo
          </label>
        </div>

        <div className="flex flex-col">
          <label htmlFor="nome_vitima" className="font-semibold text-gray-500">
            Nome Completo da Vítima<label className="text-red-600">*</label>
          </label>
          <input
            id="nome_vitima"
            type="text"
            className="border p-1"
            name="nome_vitima"
            required
          ></input>
        </div>

        <div className="flex flex-col">
          <label htmlFor="nome_agressor" className="font-semibold text-gray-500">
            Nome Completo do Agressor<label className="text-red-600">*</label>
          </label>
          <input
            id="nome_agressor"
            type="text"
            className="border p-1"
            name="nome_agressor"
            required
          ></input>
        </div>

        <div className="flex flex-col">
          <label htmlFor="violencia" className="font-semibold text-gray-500">
            Qual Tipo de Violência Sofrida
            <label className="text-red-600">*</label>
          </label>
          <select
            id="violencia"
            className="border p-1"
            name="violencia"
            required
            defaultValue={""}
          >
            <option value="">Selecione...</option>
            <option value={"Física"}>Física</option>
            <option value={"Sexual"}>Sexual</option>
            <option value={"Psícológica"}>Psícológica</option>
            <option value={"Moral"}>Moral</option>
            <option value={"Patrimonial"}>Patrimonial</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="telefone" className="font-semibold text-gray-500">
            Telefone<label className="text-red-600">*</label>
          </label>
          <input
            id="telefone"
            type="text"
            name="telefone"
            // pattern="\([0-9]{2}\) [0-9]{4,5}-[0-9]{4}"
            placeholder="(00) 00000-0000"
            className="border p-1"
            required
          ></input>
        </div>

        <div className="flex flex-col">
          <label htmlFor="logradouro" className="font-semibold text-gray-500">
            Logradouro<label className="text-red-600">*</label>
          </label>
          <input
            id="logradouro"
            type="text"
            name="logradouro"
            className="border p-1"
            required
          ></input>
        </div>

        <div className="flex flex-col">
          <label htmlFor="bairro" className="font-semibold text-gray-500">
            Bairro<label className="text-red-600">*</label>
          </label>
          <input
            id="bairro"
            type="text"
            className="border p-1"
            name="bairro"
            required
          ></input>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="numero_residencial"
            className="font-semibold text-gray-500"
          >
            Número Residêncial
          </label>
          <input
            id="numero_residencial"
            type="text"
            className="border p-1"
            name="numero_residencial"
          ></input>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="ponto_referencia"
            className="font-semibold text-gray-500"
          >
            Ponto de Referência<label className="text-red-600">*</label>
          </label>
          <input
            id="ponto_referencia"
            type="text"
            className="border p-1"
            name="ponto_referencia"
            required
          ></input>
        </div>

        <div className="flex flex-col">
          <label htmlFor="hora_fato" className="font-semibold text-gray-500">
            Hora do Fato
          </label>
          <div className="flex gap-2">
            <input className="border p-1" type="date" name="data_fato"></input>
            <input className="border p-1" type="time" name="hora_fato"></input>
          </div>
        </div>

        <label className="col-span-2 text-center font-bold text-1xl">
          Informações Adicionais
        </label>

        <div className="flex flex-col">
          <label htmlFor="agente" className="font-semibold text-gray-500">
            Nome do Agente Responsável<label className="text-red-600">*</label>
          </label>
          <input
            id="agente"
            type="text"
            className="border p-1"
            name="agente"
            required
          ></input>
        </div>

        <div className="flex flex-col">
          <label htmlFor="vrt" className="font-semibold text-gray-500">
            VRT
          </label>
          <input id="vrt" type="text" className="border p-1" name="vrt"></input>
        </div>

        <div className="flex flex-col col-span-2">
          <label
            htmlFor="encaminhamento"
            className="font-semibold text-gray-500"
          >
            Qual foi o encaminhamento da vítima
            <label className="text-red-600">*</label>
          </label>
          <select
            id="encaminhamento"
            className="border p-1"
            name="encaminhamento"
            required
            defaultValue={""}
          >
            <option value="">Selecione...</option>
            <option value={"Hospital"}>Hospital</option>
            <option value={"CMB"}>CMB</option>
            <option value={"UPA"}>UPA</option>
            <option value={"Delegacia"}>Delegacia</option>
            <option value={"Guanição PM"}>Guanição PM</option>
            <option value={"Não Houve"}>Não Houve</option>
          </select>
        </div>

        <div className="col-span-2 flex gap-5">
          <label id="feminicio" htmlFor="feminicio">
            Houve Feminício?
          </label>
          <input type="checkbox" name="feminicio"></input>
        </div>

        <div className="col-span-2 flex gap-5">
          <label id="ambulancia" htmlFor="ambulancia">
            Foi necessária ambulância médica?
          </label>
          <input type="checkbox" name="ambulancia"></input>
        </div>

        <div className="col-span-2 flex gap-5">
          <label id="deslocamento_delegacia" htmlFor="deslocamento_delegacia">
            Houve deslocamento para delegacia?
          </label>
          <input type="checkbox" name="deslocamento_delegacia"></input>
        </div>

        <div className="col-span-2 flex gap-5">
          <label id="deslocamento_saude" htmlFor="deslocamento_saude">
            Houve deslocamento para unidade de saúde?
          </label>
          <input type="checkbox" className="" name="deslocamento_saude"></input>
        </div>

        <div className="col-span-2 flex flex-col">
          <label
            id="observacoes"
            htmlFor="observacoes"
            className="font-semibold text-gray-500"
          >
            Observações
          </label>
          <textarea className="border" name="observacoes" rows="4"></textarea>
        </div>

        <div className="col-span-2 flex flex-col">
          <input
            id="documento"
            name="arquivo"
            className="flex border p-2"
            accept="image/jpeg,image/png,.pdf"
            type="file"
            multiple
            autoComplete="off"
            required
          />
        </div>

        <button
          className="p-2 font-bold hover:bg-gray-300 cursor-pointer rounded border col-span-2"
          type="submit"
        >
          Enviar
        </button>
        </div>
        
      </form>
    </div>
  );
}

export default FileUploader;
