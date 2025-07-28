function AnexoResposta() {
  return (
    <>
      <input
        type="hidden"
        name="solicitacao"
        value={solicitacao.id || ""}
      ></input>

      <label className="font-semibold text-gray-600" htmlFor="assunto">
        Assunto<span className="text-red-600">*</span>
      </label>
      <input
        id="assunto"
        name="assunto"
        className="p-2 border rounded"
        placeholder="Informe um assunto"
        defaultValue={"Ocorrência " + new Date().toLocaleDateString("pt-BR")}
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
        multiple
        autoComplete="off"
        required
      />
    </>
  );
}

export default AnexoResposta;
