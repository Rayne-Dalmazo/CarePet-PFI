let animalGlobal = null;

/* ======================================================
   CARREGAR ANIMAL
====================================================== */
async function carregarAnimal() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const resposta = await fetch(`http://localhost:3000/api/animal/${id}`);
    animalGlobal = await resposta.json();


    // FOTO DO ANIMAL
if (animalGlobal.foto) {
    document.getElementById("fotoAnimal").src =
        `data:image/jpeg;base64,${animalGlobal.foto}`;
} else {
    document.getElementById("fotoAnimal").src =
        "../imagens/pet-default.png";
}


    // CAMPOS DO TOPO
    document.getElementById("nome").textContent = animalGlobal.nome || "—";
    document.getElementById("raca").textContent = animalGlobal.raca || "—";
    document.getElementById("porte").textContent = animalGlobal.porte || "—";
    document.getElementById("idade").textContent = animalGlobal.idade || "—";
    document.getElementById("sexo").textContent = animalGlobal.sexo || "—";
    document.getElementById("castrado").textContent = animalGlobal.castrado ? "Sim" : "Não";
    document.getElementById("adotado").textContent = animalGlobal.adotado ? "Sim" : "Não";

    // LIMPAR ÁREA INFERIOR
    document.getElementById("conteudo-area").innerHTML = "";
}

function formatarData(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("pt-BR");
}

/* ======================================================
   ABA: VACINAS
====================================================== */
function mostrarVacinas() {
    const vacinas = animalGlobal.vacinas || [];

    if (!vacinas.length) {
        document.getElementById("conteudo-area").innerHTML = `
            <h2 class="titulo">Vacinas</h2>
            <p>Nenhuma vacina registrada.</p>
        `;
        return;
    }

    let html = `<h2 class="titulo">Vacinas</h2>`;

    vacinas.forEach(v => {
        html += `
             <div class="item">
            <p><strong>Nome:</strong> ${v.nome}</p>
            <p><strong>Próxima dose:</strong> ${formatarData(v.proxima_dose)}</p>
            <hr>
        </div>
        `;
    });

    document.getElementById("conteudo-area").innerHTML = html;
}


/* ======================================================
   ABA: EXAMES
====================================================== */
function mostrarExames() {
    const exames = animalGlobal.exames || [];

    if (!exames.length) {
        document.getElementById("conteudo-area").innerHTML = `
            <h2 class="titulo">Exames</h2>
            <p>Nenhum exame registrado.</p>
        `;
        return;
    }

    let html = `<h2 class="titulo">Exames</h2>`;

   exames.forEach(e => {
    html += `
        <div class="campo">
            <label>${e.nome}:</label>
            <p class="valor">${e.descricao}</p>
            <p><strong>Data do exame:</strong> ${formatarData(e.data_exame)}</p>
        </div>
    `;
});

    document.getElementById("conteudo-area").innerHTML = html;
}

/* ======================================================
   ABA: REMÉDIOS
====================================================== */
function mostrarRemedios() {
    const lista = animalGlobal.remedios || [];
    const area = document.getElementById("conteudo-area");
    area.innerHTML = "";

    if (lista.length === 0) {
        area.innerHTML = `
            <h2 class="titulo">Remédios</h2>
            <p>Nenhum remédio registrado.</p>
        `;
        return;
    }

    let html = `<h2 class="titulo">Remédios</h2>`;

    lista.forEach(remedio => {
        html += `
            <div class="campo">
               <p><b>Nome:</b> ${remedio.nome}</p>
                <p><b>Dose:</b> ${remedio.dosagem || "—"}</p>
                <p><b>Data:</b> ${remedio.data_inicio ? remedio.data_inicio.split("T")[0] : "—"}</p>
                <hr>
            </div>
        `;
    });

    area.innerHTML = html;
}



/* ======================================================
   CLIQUES NOS ÍCONES
====================================================== */
document.addEventListener("click", (e) => {
    const icone = e.target.closest(".icon");
    if (!icone) return;

    const view = icone.dataset.view;

    if (view === "vacinas") mostrarVacinas();
    if (view === "exames") mostrarExames();
    if (view === "remedios") mostrarRemedios(animalGlobal.remedios || []);

});


// Carregar dados
carregarAnimal();
