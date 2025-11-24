// =============================================================
// ELEMENTOS DA TELA
// =============================================================
const nomeTutor = document.getElementById("nomeTutor");
const fotoTutor = document.getElementById("fotoTutor");
const inputFoto = document.getElementById("inputFoto");
const listaAnimais = document.getElementById("listaAnimais");
const btnAdicionar = document.getElementById("btnAdicionar");
const btnProntuario = document.getElementById("btnProntuario");

// =============================================================
// ID DO TUTOR (salvo após login)
// =============================================================
const idTutor = localStorage.getItem("idTutor");
console.log("ID recebido do localStorage:", idTutor);

if (!idTutor || idTutor === "undefined" || idTutor === "null") {
  alert("Erro: usuário não logado!");
  localStorage.removeItem("idTutor");
  window.location.href = "../front/login.html";
}

// =============================================================
// CONFIG API
// =============================================================
const API_BASE = "http://localhost:3000/api";

// =============================================================
// Função util: tenta múltiplas URLs até obter status OK
// =============================================================
async function tryUrls(method, urls, options = {}) {
  for (const url of urls) {
    try {
      const res = await fetch(url, { method, ...options });

      if (res.ok) return { res, url };

      console.warn(`Falha (${res.status}) em: ${method} ${url}`);

      if (res.status !== 404) return { res, url };
    } catch (err) {
      console.warn(`Erro ao tentar ${url}:`, err);
    }
  }
  return null;
}

// =============================================================
// CARREGAR TUTOR
// =============================================================
async function carregarTutor() {
  const urls = [
    `${API_BASE}/usuarios/${idTutor}`  // ÚNICA rota válida
  ];

  try {
    const attempt = await tryUrls("GET", urls);
    if (!attempt) {
      nomeTutor.textContent = "Erro ao carregar tutor";
      return;
    }

    const { res } = attempt;
    const data = await res.json();
    console.log("Tutor carregado:", data);

    nomeTutor.textContent = data.nome || "Nome não encontrado";

    if (data.foto) {
      fotoTutor.src = `data:image/jpeg;base64,${data.foto}`;
    }
  } catch (err) {
    console.error("Erro ao carregar tutor:", err);
    nomeTutor.textContent = "Erro ao carregar tutor";
  }
}

// =============================================================
// ENVIAR FOTO DO TUTOR
// =============================================================
async function enviarFotoTutor(arquivo) {
  if (!arquivo) return;

  const formData = new FormData();
  formData.append("foto", arquivo);

  const urls = [
    `${API_BASE}/usuarios/${idTutor}/foto`,
    `${API_BASE}/usuarios/foto/${idTutor}`,
    `${API_BASE}/usuario/${idTutor}/foto`,
    `${API_BASE}/usuarios/uploadFoto/${idTutor}`,
    `${API_BASE}/uploads/usuarios/${idTutor}`,
    `${API_BASE}/usuarios/${idTutor}/upload`
  ];

  try {
    const attempt = await tryUrls("POST", urls, { body: formData });

    if (!attempt) {
      alert("Erro ao enviar foto (rota não encontrada)");
      return;
    }

    const { res, url } = attempt;
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("Erro no upload:", url, res.status, body);
      alert("Erro ao enviar foto!");
      return;
    }

    console.log("Foto enviada para:", url);

    // Exibir prévia da foto enviada
    const reader = new FileReader();
    reader.onload = e => (fotoTutor.src = e.target.result);
    reader.readAsDataURL(arquivo);
  } catch (err) {
    console.error("Erro ao enviar foto:", err);
    alert("Erro ao enviar foto!");
  }
}

// =============================================================
// CARREGAR ANIMAIS DO TUTOR
// =============================================================
async function carregarAnimais() {
  try {
    const res = await fetch(`http://localhost:3000/api/animais/${idTutor}`);
    if (!res.ok) throw new Error("Erro ao carregar animais");

    const animais = await res.json();
    console.log("Animais carregados:", animais);

    listaAnimais.innerHTML = "";

    if (!animais || animais.length === 0) {
      listaAnimais.innerHTML = "<p>Nenhum animal cadastrado</p>";
      return;
    }

    animais.forEach(animal => {
  
      console.log("Animal recebido:", animal); // <<< AQUI, logo no início

       const card = document.createElement("div");
         card.classList.add("card-animal");
      const foto = animal.foto
        ? `data:image/jpeg;base64,${animal.foto}`
        : "../imagens/padrao_pet.png";

      card.innerHTML = `
      <div class="card-info">
         <img src="${foto}" alt="Foto do animal">
      <div class="card-text">
          <strong>${animal.nome || "Sem nome"}</strong>
          <span>${animal.raca || ""}</span>
      </div>
    </div>
         <div class="card-actions">
  <button class="btn-visualizar" data-id="${animal.id_animais}">Visualizar</button>
  <button class="btn-editar" data-id="${animal.id_animais}">Editar</button>
  <button class="btn-excluir" data-id="${animal.id_animais}">Excluir</button>
</div>

`;

      listaAnimais.appendChild(card);
    });
  } catch (err) {
    console.error("Erro ao carregar animais:", err);
    listaAnimais.innerHTML = "<p>Erro ao carregar animais</p>";
  }
}

// EXCLUIR ANIMAL
// =============================================================
async function excluirAnimal(idAnimal) {
  try {
    const res = await fetch(`http://localhost:3000/api/animais/${idAnimal}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      throw new Error("Erro ao excluir animal");
    }

    alert("Animal excluído!");
    carregarAnimais(); // recarrega a lista
  } catch (err) {
    console.error(err);
    alert("Erro ao excluir animal");
  }
}


// =============================================================
// EVENTOS
// =============================================================
inputFoto.addEventListener("change", e => {
  enviarFotoTutor(e.target.files[0]);
});

btnAdicionar.addEventListener("click", () => {
  window.location.href = "../front/prontuario.html";
});

btnSair.addEventListener("click", () => {
  window.location.href = "../front/login.html";
});

btnUsuario.addEventListener("click", () => {
  window.location.href = "../front/editar_usuario.html";
}); 


listaAnimais.addEventListener("click", (e) => {
  const btn = e.target;

  if (btn.classList.contains("btn-excluir")) {
    const idAnimal = btn.getAttribute("data-id");

    if (confirm("Tem certeza que deseja excluir este animal?")) {
      excluirAnimal(idAnimal);
    }
  }

  if (btn.classList.contains("btn-editar")) {
    const idAnimal = btn.getAttribute("data-id");
    window.location.href = `../front/editar_animal.html?id=${idAnimal}`;
  }

  if (btn.classList.contains("btn-visualizar")) {
    const idAnimal = btn.getAttribute("data-id");
    window.location.href = `../front/visualizar.html?id=${idAnimal}`;
  }
});


// =============================================================
// INICIAR
// =============================================================
carregarTutor();
carregarAnimais();

