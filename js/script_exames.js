document.getElementById('formExame').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id_animal = localStorage.getItem('id_animal');
  if (!id_animal) {
    alert("Nenhum animal selecionado!");
    return;
  }

  const formData = new FormData();
  formData.append("id_animal", id_animal);
  formData.append("nome", document.getElementById('nomeExame').value);
  formData.append("data_exame", document.getElementById('dataExame').value);
  formData.append("descricao", document.getElementById('descricao').value);
  formData.append("foto", document.getElementById('fotoExame').files[0]);

  try {
    const res = await fetch("http://localhost:3000/exame", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (res.ok) {
      alert("Exame cadastrado com sucesso!");
      window.location.href = "../front/prontuario.html";
    } else {
      alert(data.erro || "Erro ao cadastrar exame");
    }
  } catch (erro) {
    console.error(erro);
    alert("Erro ao conectar com o servidor!");
  }
});
