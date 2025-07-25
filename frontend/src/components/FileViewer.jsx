import { useEffect, useState } from "react";
import { CircleX } from "lucide-react";

function FileViewer() {
  const [opened, setOpened] = useState(false);
  const [file, setFile] = useState("");

  useEffect(() => {
    function abrirAnexo(e) {
      setOpened(true);
      console.log(e.detail);
      setFile(e.detail.anexo);
      // Faça algo com os dados recebidos
    }

    window.addEventListener("abrirAnexo", abrirAnexo);

    return () => {
      window.removeEventListener("abrirAnexo", abrirAnexo);
    };
  }, []);
  return (
    <div
      className={`absolute flex flex-col items-center justify-center w-full h-full top-0 left-0 z-10001 gap-4 ${
        !opened ? "hidden" : ""
      } overflow-auto bg-black/85`}
    >
      <CircleX className="absolute top-4 right-4 cursor-pointer" size={50} color="#ffffff" onClick={() => setOpened(false)} />
      <img
        className="max-w-[700px]"
        src={"https://forms-homo.salvador.ba.gov.br/uploads/" + file[0]}
        allowFullScreen={true}
      ></img>
      <label className="text-white font-bold text-3xl">
        Assunto: {file[1]}
      </label>
    </div>
  );
}

export default FileViewer;
