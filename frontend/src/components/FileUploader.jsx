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
      axios.get(import.meta.env.VITE_GET_ID + e.detail.solicitacao_id).then((response) => {
        setSolicitacao({id: response?.data[0], identificador: e.detail.solicitacao_id});
      })
      setSolicitacao(e.detail.solicitacao_id);
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

      const response = await fetch(`https://forms-homo.salvador.ba.gov.br/api/flow/anexo-resposta/?solicitacao_id=${solicitacao.identificador}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type' NÃO DEVE ser definido manualmente com FormData!
        },
        body: formData,
      });

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
      <CircleX
        className="absolute top-4 right-4 cursor-pointer"
        size={50}
        color="#ffffff"
        onClick={() => setOpened(false)}
      />
      <form
        className="flex flex-col gap-4 p-4 bg-white rounded-2xl w-3/5"
        onSubmit={handleSubmit}
      >
        <input type="hidden" name="solicitacao" value={solicitacao.id}></input>

        <label className="font-semibold text-gray-600" htmlFor="assunto">
          Assunto<span className="text-red-600">*</span>
        </label>
        <input
          id="assunto"
          name="assunto"
          className="p-2 border rounded"
          placeholder="Informe um assunto"
          type="text"
          required
        />
        <label className="font-semibold text-gray-600" htmlFor="descricao">
          Resumo<span className="text-red-600">*</span>
        </label>
        <textarea
          id="resumo"
          name="descricao"
          className="p-2 border rounded"
          placeholder="Digite um resumo"
          rows="6"
          required
        ></textarea>
        <label className="font-semibold text-gray-600" htmlFor="arquivo">
          Documento<span className="text-red-600">*</span>
        </label>
        <input
          id="documento"
          name="arquivo"
          className="flex border rounded p-2"
          accept="image/jpeg,image/png,.pdf"
          type="file"
          autoComplete="off"
          required
        />
        <button
          className="p-2 font-bold hover:bg-gray-300 cursor-pointer rounded border"
          type="submit"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

export default FileUploader;
