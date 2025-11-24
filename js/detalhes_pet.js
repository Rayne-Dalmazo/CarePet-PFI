// ===============================================
// PEGAR O TIPO DA CATEGORIA (remedios / vacinas / exames)
// ===============================================


const tipo = localStorage.getItem("tipoDetalhe");
// console.log("Categoria escolhida:", tipo);

// ELEMENTOS DA TELA
const secRemedios = document.getElementById("card-remedios");
const secVacinas = document.getElementById("card-vacinas");
const secExames = document.getElementById("card-exames");


const btnSalvarRemedio = document.getElementById("btnSalvarRemedio");
const remedioNome = document.getElementById("remedioNome");
const remedioDosagem = document.getElementById("remedioDosagem");
const remedioDataInicio = document.getElementById("remedioDataInicio");


const btnSalvarVacina = document.getElementById("btnSalvarVacina");
const vacinaNome = document.getElementById("vacinaNome");
const vacinaDataAplicacao = document.getElementById("vacinaDataAplicacao");
const vacinaProximaDose = document.getElementById("vacinaProximaDose");

const btnSalvarExame = document.getElementById("btnSalvarExame");
const exameNome = document.getElementById("exameNome");
const exameData = document.getElementById("exameData");
const exameDescricao = document.getElementById("exameDescricao");


// ===============================================
// MOSTRAR A SEÇÃO CORRETA
// ===============================================
function mostrarSecao() {
    secRemedios.style.display = "none";
    secVacinas.style.display = "none";
    secExames.style.display = "none";

    if (tipo === "remedios") secRemedios.style.display = "block";
    if (tipo === "vacinas") secVacinas.style.display = "block";
    if (tipo === "exames") secExames.style.display = "block";
}

mostrarSecao();

// ===============================================
// SALVAR REMÉDIO
// ===============================================
btnSalvarRemedio?.addEventListener("click", async () => {
    
    
    const idDoAnimal = localStorage.getItem("idAnimalEdicao");

   
    if (!idDoAnimal) {
        return alert("Erro: ID do animal não encontrado. Volte e selecione-o novamente.");
    }
    if (!remedioNome.value || !remedioDosagem.value || !remedioDataInicio.value) {
        return alert("Preencha todos os campos obrigatórios de Remédio.");
    }

   const dataToSend = {
        id_animal: idDoAnimal,
        nome: remedioNome.value.trim(),
        dosagem: remedioDosagem.value.trim(),
        data_inicio: remedioDataInicio.value
    };

    try {
       const r = await fetch("http://localhost:3000/api/remedio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataToSend),
});


        
const dataRes = await r.json(); 

        if (r.ok) {
            alert(dataRes.message || "Remédio salvo com sucesso!");
        } else {
            // Se houver erro, mostre a mensagem que o backend enviou!
            alert(`Falha ao salvar remédio: ${dataRes.error || "Erro desconhecido do servidor."}`);
        }

    } catch (err) {
        console.error("Falha na conexão ou erro inesperado:", err);
        alert("Falha ao conectar com o servidor. Verifique o console para mais detalhes.");
    }

  
    
});


// ===============================================
// SALVAR VACINA
// ===============================================
btnSalvarVacina?.addEventListener("click", async () => {
    
  
    const idDoAnimal = localStorage.getItem("idAnimalEdicao");



    if (!idDoAnimal) {
        return alert("Erro: ID do animal não encontrado. Volte e selecione-o novamente.");
    }
    if (!vacinaNome.value || !vacinaDataAplicacao.value) {
        return alert("Preencha os campos obrigatórios de Vacina.");
    }

    const data = {
        id_animal: idDoAnimal, // Usa o ID correto
        nome: vacinaNome.value.trim(),
        data_aplicacao: vacinaDataAplicacao.value,
        proxima_dose: vacinaProximaDose.value
    };

    try {
        const r = await fetch("http://localhost:3000/api/vacina", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
});

        const dataRes = await r.json();
        
        if (r.ok) {
            alert(dataRes.message || "Vacina registrada com sucesso!");
        } else {
            alert(`Erro ao salvar vacina: ${dataRes.error || "Erro desconhecido."}`);
        }

    } catch (err) {
        console.error("Falha na conexão:", err);
        alert("Falha ao conectar com o servidor.");
    }
});

// ===============================================
// SALVAR EXAME
// ===============================================
btnSalvarExame?.addEventListener("click", async () => {
    
    const idDoAnimal = localStorage.getItem("idAnimalEdicao");

    if (!idDoAnimal) {
        return alert("Erro: ID do animal não encontrado. Volte e selecione-o novamente.");
    }
    if (!exameNome.value || !exameData.value) {
        return alert("Preencha os campos obrigatórios de Exame.");
    }

    const dataToSend = {
        id_animal: idDoAnimal,
        nome: exameNome.value.trim(),
        data_exame: exameData.value,
        descricao: exameDescricao.value.trim()
    };

    try {
        const r = await fetch("http://localhost:3000/api/exame", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToSend)
        });

        const dataRes = await r.json();

        if (r.ok) {
            alert(dataRes.message || "Exame registrado com sucesso!");
        } else {
            alert(`Erro ao salvar exame: ${dataRes.error || "Erro desconhecido."}`);
        }

    } catch (err) {
        console.error("Falha na conexão:", err);
        alert("Falha ao conectar com o servidor.");
    }
});
function proximo(tipo) {
    localStorage.setItem("tipoDetalhe", tipo);
    window.location.href = "detalhes_pet.html";
}
