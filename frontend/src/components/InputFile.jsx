function InputFile({solicitacao_id}) {
  return (
    <button
      className="mt-2 p-2 font-bold hover:bg-gray-300 cursor-pointer border rounded w-full"
      onClick={() => {
        const evento = new CustomEvent("abrirForm", {
          detail: {
            solicitacao_id: solicitacao_id,
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
