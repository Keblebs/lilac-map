import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "./Spinner";
import { Eye } from "lucide-react";
import InputFile from "./InputFile";

function RightPanel() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelData, setPanelData] = useState({});
  const [files, setFiles] = useState([]);
  const [filesInLoading, setFilesInLoading] = useState(false);
  const [mainMenu, setMainMenu] = useState(true);

  useEffect(() => {
    function panelOpen(e) {
      setPanelOpen(true);
      let fields = {};
      fields.protocolo = e.detail?.data.protocolo;
      fields.status = e.detail?.data.status;
      fields.created_at = e.detail?.data.created_at;
      fields.identificador = e.detail?.data.identificador;
      Object.values(e.detail?.data.respostas[0]).forEach((value) => {
        fields[value.titulo] = value.resposta;
      });
      setPanelData(fields);
      setMainMenu(true);
      // Faça algo com os dados recebidos
    }

    function panelClose(e) {
      setPanelOpen(false);
      // Faça algo com os dados recebidos
    }

    window.addEventListener("marcadorClicado", panelOpen);
    window.addEventListener("mapaClicado", panelClose);

    return () => {
      window.removeEventListener("marcadorClicado", panelOpen);
      window.removeEventListener("mapaClicado", panelClose);
    };
  }, []);

  async function fileMenu(e) {
    setMainMenu(false);
    setFilesInLoading(true);
    await axios
      .get(`${import.meta.env.VITE_GET_FILES}${panelData.protocolo}`)
      .then((response) => {
        setFiles(response.data);
      });
    setFilesInLoading(false);
  }

  return (
    <div
      className={`rightPanel absolute top-2 right-2 w-[350px] z-9999 bg-white p-2 rounded-md border ${
        panelOpen ? "block" : "hidden"
      }`}
    >
      {/*Another moment*/}
      {/* <img src="https://forms.salvador.ba.gov.br/uploads/documentos/8b3e37d036ee412d9c38de201c501f20.png" className="w-[200px]"/> */}
      <div className="flex gap-2 flex-col">
        <div className="grid grid-cols-2 gap-2 self-center">
          <div className="flex flex-col">
            <label className="text-gray-400 font-medium">Violência</label>
            <label className="font-semibold text-gray-700 text-2xl">
              {panelData[
                Object.keys(panelData).find((key) => key.includes("Violência"))
              ]?.toUpperCase()}
            </label>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-400 font-medium">
              Data de Abertura
            </label>
            <label className="font-semibold text-gray-700 text-md">
              {new Date(panelData.created_at).toLocaleString("pt-BR")}
            </label>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-400 font-medium">Status</label>
            <label className="font-semibold text-gray-700 text-md">
              {panelData.status}
            </label>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-400 font-medium">Protocolo</label>
            <label className="font-semibold text-gray-700 text-md">
              {panelData.protocolo}
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 border-b justify-evenly">
          <button
            className={`p-2 font-bold hover:bg-gray-300 cursor-pointer ${
              mainMenu ? "bg-gray-300 border" : ""}`}
            onClick={() => setMainMenu(true)}
          >
            Visão Geral
          </button>
          <button
            className={`p-2 font-bold hover:bg-gray-300 cursor-pointer ${
              mainMenu ? "" : "bg-gray-300 border"}`}
            onClick={async (e) => await fileMenu(e)}
          >
            Anexos
          </button>
        </div>
        {mainMenu && Object.keys(panelData).length > 0 ? (
          <>
            {Object.entries(panelData).map(
              ([key, value]) =>
                !["protocolo", "status", "created_at", "identificador"].includes(key) &&
                !key.includes("Violência") && (
                  <div key={key} className="rounded-md border-b p-1">
                    <strong className="text-[#ca1c3c]">{key}: </strong>
                    {value}
                  </div>
                )
            )}
          </>
        ) : filesInLoading ? (
          <>
            <div>Carregando anexos</div>
            <Spinner />
          </>
        ) : files.length > 0 ? (
          <div>
            {files.map((file, index) => (
              <div
                key={index}
                className="rounded-md border-b p-1 justify-between cursor-pointer flex flex-col gap-2"
              >
                <div
                  className="p-1 justify-between cursor-pointer flex"
                  onClick={() => {
                    const evento = new CustomEvent("abrirAnexo", {
                      detail: { anexo: file },
                    });
                    window.dispatchEvent(evento);
                  }}
                >
                  <span className="ml-2 font-semibold">{file[1]}</span>
                  <Eye className="cursor-pointer mr-2" size={32} />
                </div>
              </div>
            ))}

            {/* Botão fora do map */}
            <InputFile solicitacao_id={panelData.identificador}/>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label>Nenhum anexo encontrado</label>
            <InputFile solicitacao_id={panelData.identificador} />
          </div>
        )}
      </div>
    </div>
  );
}

export default RightPanel;
