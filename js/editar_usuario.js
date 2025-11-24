document.addEventListener("DOMContentLoaded", carregarDados);

async function carregarDados() {
    const id = localStorage.getItem("idTutor");

    if (!id) {
        alert("Usuário não encontrado!");
        return;
    }

    const res = await fetch(`http://localhost:3000/api/usuarios/${id}`);
    const user = await res.json();

    if (!res.ok) {
        alert("Usuário não encontrado!");
        return;
    }

    // Preencher campos
    document.getElementById("email").value = user.email;
    document.getElementById("nome").value = user.nome;

    // FOTO DO BANCO
    const fotoPreview = document.getElementById("fotoPreview");

    if (user.foto) {
        fotoPreview.src = `data:image/jpeg;base64,${user.foto}`;
    }


    // ===============================
    // PREVIEW DA FOTO AO SELECIONAR
    // ===============================
    const inputFoto = document.getElementById("inputFoto");

    inputFoto.addEventListener("change", () => {
        const file = inputFoto.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            fotoPreview.src = url;  // <<< PREVIEW AQUI
        }
    });


    // ===============================
    // SUBMIT DO FORM
    // ===============================
    document.getElementById("formUsuario").addEventListener("submit", async (e) => {
        e.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value;

        const arquivo = inputFoto.files[0];

        // 1) Salvar dados (nome, email, senha)
        const ok = await salvar(id, nome, email, senha);

        if (!ok) {
            alert("Erro ao salvar dados!");
            return;
        }

        // 2) Se tiver foto nova → upload separado
        if (arquivo) {
            await uploadFoto(id, arquivo);
        }

        alert("Dados atualizados!");
        window.location.href = "tela_principal.html";
    });
}


// ===============================
// PUT sem foto
// ===============================
async function salvar(id, nome, email, senha) {
    const body = { nome, email };
    if (senha) body.senha = senha;

    const res = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    return res.ok;
}


// ===============================
// Upload da foto separado
// ===============================
async function uploadFoto(id, arquivo) {
    const formData = new FormData();
    formData.append("foto", arquivo);

    return fetch(`http://localhost:3000/api/usuarios/${id}/upload`, {
        method: "POST",
        body: formData
    });
}
