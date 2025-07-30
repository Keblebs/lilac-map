import verifyAuths  from "../hooks/verifyAuths";
import Cookies from "js-cookie";

function InputFile({solicitacao, filesQtd}) {
  return (
    <button
      className="mt-2 p-2 font-bold hover:bg-gray-300 cursor-pointer border rounded w-full"
      onClick={async ()  => {
        let auth = await verifyAuths(Cookies.get("token"));
        console.log(auth);
        if (!auth) {
          return;
        }
        const evento = new CustomEvent("abrirForm", {
          detail: {
            solicitacao: solicitacao,
            filesQtd: filesQtd
          },
        });
        window.dispatchEvent(evento);
      }}
    >
      Novo BEOC
    </button>
  );
}

export default InputFile;
