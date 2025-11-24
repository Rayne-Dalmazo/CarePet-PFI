// =============================================================
//   INICIALIZAÇÃO
// =============================================================
document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (!id) {
        alert("Erro: Nenhum animal selecionado.");
        window.location.href = "tela_principal.html";
        return;
    }

    localStorage.setItem("idAnimalEdicao", id);

    await carregarAnimal(id);
    carregarRemedios(id);
    carregarVacinas(id);
    carregarExames(id);
});


// =============================================================
//   CARREGAR DADOS DO ANIMAL
// =============================================================
async function carregarAnimal(id) {
    try {
        const res = await fetch(`http://localhost:3000/api/animal/${id}`);

        const animal = await res.json();

        document.getElementById("nome").value = animal.nome || "";
        document.getElementById("idade").value = animal.idade || "";
        document.getElementById("raca").value = animal.raca || "";
        document.getElementById("sexo").value = animal.sexo || "";
        document.getElementById("porte").value = animal.porte || "";


        document.querySelector(`#castradoGroup .${animal.castrado == 1 ? "sim" : "nao"}`).classList.add("active");
        document.querySelector(`#adotadoGroup .${animal.adotado == 1 ? "sim" : "nao"}`).classList.add("active");

        // FOTO
        if (animal.foto) {
            const preview = document.getElementById("previewFoto");
            preview.src = `data:image/jpeg;base64,${animal.foto}`;
            preview.style.display = "block";
            document.getElementById("textoFoto").style.display = "none";
        }

    } catch (err) {
        console.error(err);
        alert("Erro ao carregar informações.");
    }
}


// =============================================================
//   ALTERAR INFORMAÇÕES DO ANIMAL
// =============================================================
document.getElementById('btnModificar').addEventListener('click', async () => {
    const id = localStorage.getItem("idAnimalEdicao");

    const formData = new FormData();
    formData.append("nome", document.getElementById("nome").value);
    formData.append("idade", document.getElementById("idade").value);
    formData.append("raca", document.getElementById("raca").value);
    formData.append("sexo", document.getElementById("sexo").value);
    formData.append("porte", document.getElementById("porte").value);

    formData.append("castrado", document.querySelector('#castradoGroup .active')?.textContent === "Sim" ? 1 : 0);
    formData.append("adotado", document.querySelector('#adotadoGroup .active')?.textContent === "Sim" ? 1 : 0);

    const foto = document.getElementById("foto").files[0];
    if (foto) formData.append("foto", foto);

    try {
        const res = await fetch(`http://localhost:3000/api/animais/${id}`, {
            method: "PUT",
            body: formData
        });

        const data = await res.json();

        if (res.ok) {
            alert("Informações atualizadas com sucesso!");
            window.location.href = "tela_principal.html";
        } else {
            alert(data.erro || "Erro ao atualizar.");
        }
    } catch (err) {
        console.error(err);
        alert("Erro de conexão.");
    }
});


// =============================================================
//   BOTÕES SIM/NÃO
// =============================================================
function selectOption(el) {
    const group = el.parentElement;
    group.querySelectorAll(".radio-btn").forEach(btn => btn.classList.remove("active"));
    el.classList.add("active");
}


// =============================================================
//   TELA DETALHES (REMÉDIOS, VACINAS, EXAMES)
// =============================================================
function irParaDetalhes(tipo) {
    const box = document.getElementById("conteudoDetalhes");
    box.style.display = "block";

    const layouts = {
        remedios: `
            <h3>Remédios</h3>
            <label>Nome do Remédio:</label>
            <input type="text" id="remedioNome">

            <label>Dosagem:</label>
            <input type="text" id="remedioDose">

            <label>Data de Início:</label>
            <input type="date" id="remedioData">

            <button onclick="salvarRemedio()">Salvar Remédio</button>
        `,
        vacinas: `
            <h3>Vacinação</h3>
            <label>Vacina:</label>
            <input type="text" id="vacinaNome">

            <label>Data Aplicação:</label>
            <input type="date" id="vacinaDataAplicacao">

            <label>Próxima Dose:</label>
            <input type="date" id="vacinaProxima">

            <button onclick="salvarVacina()">Salvar Vacina</button>
        `,
        exames: `
            <h3>Exames</h3>
            <label>Tipo de Exame:</label>
            <input id="exameNome">

            <label>Data:</label>
            <input type="date" id="exameData">

            <label>Descrição:</label>
            <textarea id="exameDesc"></textarea>

            <button onclick="salvarExame()">Salvar Exame</button>
        `
    };

    box.innerHTML = layouts[tipo];

    // Exibir listas corretas
    document.getElementById("remediosList").style.display = "none";
    document.getElementById("vacinasList").style.display = "none";
    document.getElementById("examesList").style.display = "none";

    const idAnimal = localStorage.getItem("idAnimalEdicao");

    if (tipo === "remedios") {
        document.getElementById("remediosList").style.display = "block";
        carregarRemedios(idAnimal);
    }
    if (tipo === "vacinas") {
        document.getElementById("vacinasList").style.display = "block";
        carregarVacinas(idAnimal);
    }
    if (tipo === "exames") {
        document.getElementById("examesList").style.display = "block";
        carregarExames(idAnimal);
    }
}


// =============================================================
//   SALVAR REMÉDIO, VACINA, EXAME
// =============================================================
async function salvarRemedio() {
    const idAnimal = localStorage.getItem("idAnimalEdicao");

    const body = {
        id_animal: idAnimal,
        nome: document.getElementById("remedioNome").value,
        dosagem: document.getElementById("remedioDose").value,
        data_inicio: document.getElementById("remedioData").value,
    };

    if (!body.nome || !body.dosagem || !body.data_inicio)
        return alert("Preencha todos os campos!");

    await enviarPOST("remedio", body, carregarRemedios);


}

async function salvarVacina() {
    const idAnimal = localStorage.getItem("idAnimalEdicao");

    const body = {
        id_animal: idAnimal,
        nome: document.getElementById("vacinaNome").value,
        data_aplicacao: document.getElementById("vacinaDataAplicacao").value,
        proxima_dose: document.getElementById("vacinaProxima").value
    };

    if (!body.nome || !body.data_aplicacao)
        return alert("Preencha todos os campos!");

    await enviarPOST("vacina", body, carregarVacinas);

}

async function salvarExame() {
    const idAnimal = localStorage.getItem("idAnimalEdicao");

    const body = {
        id_animal: idAnimal,
        nome: document.getElementById("exameNome").value,
        data_exame: document.getElementById("exameData").value,
        descricao: document.getElementById("exameDesc").value
    };

    if (!body.nome || !body.data_exame)
        return alert("Preencha nome e data!");

    await enviarPOST("exame", body, carregarExames);


}


// =============================================================
//   FUNÇÃO POST GENÉRICA
// =============================================================
async function enviarPOST(endpoint, body, callback) {
    const res = await fetch(`http://localhost:3000/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (res.ok) {
        alert("Salvo com sucesso!");
        callback(localStorage.getItem("idAnimalEdicao"));
    } else {
        alert("Erro ao salvar!");
    }
}


// =============================================================
//   FUNÇÃO LISTAR (GENÉRICA)
// =============================================================
async function carregarLista(tipo, idAnimal, template) {
    try {
        const res = await fetch(`http://localhost:3000/api/${tipo}/${idAnimal}`);

        if (!res.ok) {
            console.error(`Erro na rota /${tipo}:`, res.status);
            return;
        }

        let dados;
try {
    dados = await res.json();
} catch {
    dados = [];
}


        // 🔥 Se backend mandou objeto, transforma em array:
        if (dados && !Array.isArray(dados)) {
            dados = [dados];
        }

        const listaId = {
            remedios: "remediosList",
            vacinas: "vacinasList",
            exames: "examesList"
        }[tipo];

        const lista = document.getElementById(listaId);
        lista.innerHTML = "";

        dados.forEach(item => {
            lista.innerHTML += template(item);
        });

    } catch (err) {
        console.error("Erro:", err);
    }
}


// =============================================================
//   CARREGAR LISTAS ESPECÍFICAS
// =============================================================
async function carregarRemedios(id) {
    carregarLista("remedios", id, item => `
        <li>
            <strong>${item.nome}</strong> — ${item.dosagem}
            <button onclick="excluirItem('remedio', ${item.id_remedios})">Excluir</button>

        </li>
    `);
}


async function carregarVacinas(id) {
    carregarLista("vacinas", id, item => `
        <li>
            <strong>${item.nome}</strong> — aplic. ${item.data_aplicacao}
            <button onclick="excluirItem('vacina', ${item.id_vacinas})">Excluir</button>

        </li>
    `);
}

async function carregarExames(id) {
    carregarLista("exames", id, item => `
        <li>
            <strong>${item.nome}</strong> — ${item.data_exame}
            <button onclick="excluirItem('exame', ${item.id_exames})">Excluir</button>

        </li>
    `);
}



// =============================================================
//   EXCLUIR ITEM
// =============================================================
function excluirItem(tipo, id) {
    if (!id) {
        console.error("ID inválido na exclusão:", id);
        return;
    }

    // Rotas do DELETE no backend (singular)
    const rotasDelete = {
        remedio: "remedio",
        vacina: "vacina",
        exame: "exame"
    };

    const rota = rotasDelete[tipo];

    if (!rota) {
        console.error("Tipo de exclusão inválido:", tipo);
        return;
    }

    fetch(`http://localhost:3000/api/${rota}/${id}`, {
        method: "DELETE"
    })
    .then(res => {
        if (!res.ok) throw new Error("Erro ao excluir");
        return res.text();
    })
    .then(() => {
        const idAnimal = localStorage.getItem("idAnimalEdicao");

        // Atualiza somente a lista certa
        if (tipo === "remedio") carregarRemedios(idAnimal);
        if (tipo === "vacina") carregarVacinas(idAnimal);
        if (tipo === "exame") carregarExames(idAnimal);
    })
    .catch(err => console.error("Erro ao excluirItem:", err));
}
