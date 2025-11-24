function selectOption(el) {
    const group = el.parentElement;
    group.querySelectorAll(".radio-btn").forEach(btn => btn.classList.remove("active"));
    el.classList.add("active");
}

function parseSimNao(valor) {
    return valor === "Sim" ? 1 : 0;
}

// PREVIEW DA FOTO
document.getElementById("foto").addEventListener("change", function () {
    const arquivo = this.files[0];

    if (arquivo) {
        const preview = document.getElementById("previewFoto");
        const texto = document.getElementById("textoFoto");

        preview.src = URL.createObjectURL(arquivo);
        preview.style.display = "block";
        texto.style.display = "none";
    }
});

// BOTÃO CADASTRAR / FINALIZAR
const botao = document.querySelector('.finalizar');

botao.addEventListener('click', async () => {

    // Se o botão já estiver em modo "finalizar", só redireciona
    if (botao.dataset.finalizado === "true") {
        window.location.href = "../front/tela_principal.html";
        return;
    }

    const idTutor = localStorage.getItem("idTutor");

    if (!idTutor) {
        alert("Erro: usuário não logado!");
        window.location.href = "../front/login.html";
        return;
    }

    const formData = new FormData();
    formData.append("id_usuario", idTutor);
    formData.append("nome", document.getElementById('nome').value.trim());
    formData.append("idade", document.getElementById('idade').value.trim());
    formData.append("raca", document.getElementById('raca').value.trim());
    formData.append("sexo", document.getElementById('sexo').value);
    formData.append("porte", document.getElementById('porte').value);

    const castradoTXT = document.querySelector('#castradoGroup .active')?.textContent || "Não";
    const adotadoTXT = document.querySelector('#adotadoGroup .active')?.textContent || "Não";

    formData.append("castrado", parseSimNao(castradoTXT));
    formData.append("adotado", parseSimNao(adotadoTXT));

    const foto = document.getElementById('foto').files[0];
    if (foto) formData.append("foto", foto);

    try {
        const res = await fetch("http://localhost:3000/api/animal", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.erro || "Erro ao cadastrar animal");
            return;
        }

        const idAnimal = data.id_animal;

        if (!idAnimal) {
            alert("Erro: servidor não retornou ID do animal.");
            return;
        }

        localStorage.setItem("idAnimalAtual", idAnimal);

        // MOSTRAR ÍCONES
        document.querySelector(".icones-secao").style.display = "flex";

        // MUDAR BOTÃO PARA FINALIZAR
        botao.textContent = "Finalizar";
        botao.dataset.finalizado = "true";

        alert("Animal cadastrado! Agora você pode inserir Vacinas, Remédios e Exames, ou finalizar.");

    } catch (err) {
        console.error(err);
        alert("Falha ao conectar com o servidor.");
    }

});

function irParaDetalhes(tipo) {
    const idAnimal = localStorage.getItem("idAnimalAtual");

    if (!idAnimal) {
        alert("Cadastre o pet antes de continuar!");
        return;
    }

    localStorage.setItem("tipoDetalhe", tipo);
    localStorage.setItem("idAnimalEdicao", idAnimal);

    window.location.href = "../front/detalhes_pet.html";
}
