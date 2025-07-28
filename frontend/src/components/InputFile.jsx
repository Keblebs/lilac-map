import verifyAuths  from "../hooks/verifyAuths";
import Cookies from "js-cookie";

function InputFile({solicitacao, filesQtd}) {
  return (
    <button
      className="mt-2 p-2 font-bold hover:bg-gray-300 cursor-pointer border rounded w-full"
      onClick={() => {
        verifyAuths(Cookies.get("token"));
        const evento = new CustomEvent("abrirForm", {
          detail: {
            solicitacao: solicitacao,
            filesQtd: filesQtd || 1
          },
        });
        window.dispatchEvent(evento);
      }}
    >
      Novo Anexo
    </button>
  );
}

export default InputFile;
