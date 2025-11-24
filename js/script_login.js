document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        const resposta = await fetch("http://localhost:3000/api/usuarios/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, senha }),
        });

        const dados = await resposta.json();

        console.log("RESPOSTA DO BACKEND:", dados);

        if (resposta.ok) {
            alert("Login realizado com sucesso!");

           localStorage.setItem("idTutor", dados.usuario.id);
           localStorage.setItem("usuario", JSON.stringify(dados.usuario)); // opcional, se quiser usar depois


            // 👇 Caminho certo
            window.location.href = "/front/tela_principal.html";
        } else {
            alert(dados.erro || dados.mensagem || "Erro ao fazer login.");
        }

    } catch (erro) {
        console.error("Erro na requisição:", erro);
        alert("Não foi possível conectar ao servidor.");
    }
});
