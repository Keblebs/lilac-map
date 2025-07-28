import { useEffect, useState } from "react";
import { CircleX } from "lucide-react";
import Cookies from "js-cookie"; // caso o token esteja armazenado em cookie
import axios from "axios";

function FileUploader() {
  const [opened, setOpened] = useState(false);
  const [solicitacao, setSolicitacao] = useState({});

  useEffect(() => {
    function abrirForm(e) {
      setOpened(true);
      // document
      //   .querySelector("form")
      //   .querySelectorAll("input, textarea")
      //   .forEach((input) => (input.value = ""));

      // document.querySelector("#assunto").value =
      //   "Boletim de Ocorrência " +
      //   e.detail.filesQtd +
      //   " - " +
      //   new Date().toLocaleDateString("pt-BR");
      axios
        .get(import.meta.env.VITE_GET_ID + e.detail.solicitacao.identificador)
        .then((response) => {
          setSolicitacao({
            id: response?.data[0],
            identificador: e.detail.solicitacao.identificador,
          });
        });

      let solicitacao = e.detail.solicitacao;
      document.querySelector("#nome").value = solicitacao["Nome Completo"];
      console.log(e.detail.solicitacao);
      setSolicitacao(e.detail.solicitacao);
    }

    window.addEventListener("abrirForm", abrirForm);
    return () => window.removeEventListener("abrirForm", abrirForm);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const token = Cookies.get("token"); // ou outro jeito de obter o token

    try {
      const response = await fetch(
        `https://forms-homo.salvador.ba.gov.br/api/flow/anexo-resposta/?solicitacao_id=${solicitacao.identificador}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Type' NÃO DEVE ser definido manualmente com FormData!
          },
          body: formData,
        }
      );

      if (response.ok) {
        alert("Documento enviado com sucesso!");
        setOpened(false);
      } else {
        const erro = await response.text();
        console.error("Erro ao enviar:", erro);
        alert("Erro ao enviar o documento.");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Erro inesperado.");
    }
  };

  return (
    <div
      className={`absolute flex flex-col items-center justify-center w-full h-full top-0 left-0 z-10001 gap-4 ${
        !opened ? "hidden" : ""
      } overflow-auto bg-black/85`}
    >
      {/* <CircleX
        className="absolute top-4 right-4 cursor-pointer"
        size={50}
        color="#ffffff"
        onClick={() => setOpened(false)}
      /> */}
      
      <form
        className="grid grid-cols-2 gap-4 p-4 bg-white rounded-2xl overflow-y-auto relative"
        onSubmit={handleSubmit}
      >
        <a className="absolute top-0 right-0 cursor-pointer hover:bg-red-400  w-10 h-10 flex items-center justify-center font-bold transition-colors duration-100" onClick={() => setOpened(false)}>X</a>

        <input type="hidden" name="solicitacao" value={solicitacao.id || ""} />

        <label className="col-span-2 text-center font-bold text-2xl">
          Boletim de Ocorrência
        </label>

        <div className="flex flex-col">
          <label htmlFor="nome" className="font-semibold text-gray-500">
            Nome Completo da Vítima
          </label>
          <input
            id="nome"
            type="text"
            className="border p-1"
            name="nome"
            required
          ></input>
        </div>

        <div className="flex flex-col">
          <label htmlFor="violencia" className="font-semibold text-gray-500">
            Qual Tipo de Violência Sofrida
          </label>
          <select
            id="violencia"
            className="border p-1"
            name="violencia"
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
            Telefone
          </label>
          <input
            id="telefone"
            type="text"
            name="telefone"
            pattern="\([0-9]{2}\) [0-9]{4,5}-[0-9]{4}"
            placeholder="(00) 00000-0000"
            className="border p-1"
            required
          ></input>
        </div>

        <div className="flex flex-col">
          <label htmlFor="logradouro" className="font-semibold text-gray-500">
            Logradouro
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
            Bairro
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
            Ponto de Referência
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
            <input className="border" type="date" name="data_fato"></input>
            <input className="border" type="time" name="hora_fato"></input>
          </div>
        </div>

        <label className="col-span-2 text-center font-bold text-1xl">
          Informações Complementares
        </label>

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
          <label id="observacoes" htmlFor="observacoes" className="font-semibold text-gray-500">
            Observações
          </label>
          <textarea className="border" name="observacoes" rows="4"></textarea>
        </div>

        <button
          className="p-2 font-bold hover:bg-gray-300 cursor-pointer rounded border col-span-2"
          type="submit"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

export default FileUploader;
