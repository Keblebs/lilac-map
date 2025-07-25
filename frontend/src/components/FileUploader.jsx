import { useEffect, useState } from "react";
import { CircleX } from "lucide-react";

function FileUploader() {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    function abrirForm(e) {
      setOpened(true);
    }

    window.addEventListener("abrirForm", abrirForm);

    return () => {
      window.removeEventListener("abrirForm", abrirForm);
    };
  }, []);
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
      <form className="flex flex-col gap-4 p-4 bg-white rounded-2xl w-3/5">
        <label className="font-semibold text-gray-600" for="assunto">
          Assunto<label className="text-red-600">*</label>
        </label>
        <input
          id="assunto"
          name="assunto"
          className="p-2 border rounded"
          placeholder="Informe um assunto"
          type="text"
          required
        />
        <label className="font-semibold text-gray-600" for="resumo">
          Resumo<label className="text-red-600">*</label>
        </label>
        <textarea
          id="resumo"
          name="resumo"
          className="p-2 border rounded"
          placeholder="Digite um resumo"
          rows="6"
          required
        ></textarea>
        <label className="font-semibold text-gray-600" for="documento">
          Documento<label className="text-red-600">*</label>
        </label>
        <div></div>
        <input
          id="documento"
          name="documento"
          className="flex border rounded p-2"
          accept="image/jpeg,image/png,.pdf"
          multiple=""
          type="file"
          autoComplete="off"
          required
        ></input>
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
