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
        size={60}
        color="#ffffff"
        onClick={() => setOpened(false)}
      />
      <div>
        <input
            className="flex"
          accept="image/jpeg,image/png,.pdf"
          multiple=""
          type="file"
          autoComplete="off"
        ></input>
      </div>
    </div>
  );
}

export default FileUploader;
