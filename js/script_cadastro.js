document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cadastroForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const confirmarSenha = document.getElementById("confirmarSenha").value.trim();

    if (!nome || !email || !senha || !confirmarSenha) {
      alert("⚠️ Preencha todos os campos.");
      return;
    }

    if (!validarEmail(email)) {
      alert("⚠️ Digite um e-mail válido.");
      return;
    }

    if (senha.length < 6) {
      alert("⚠️ A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("⚠️ As senhas não coincidem.");
      return;
    }

    try {
      // ROTA CORRETA
      const res = await fetch("http://localhost:3000/api/usuarios/cadastro", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Usuário cadastrado com sucesso!");
        form.reset();

        // REDIRECIONAR PARA O LOGIN
        window.location.href = "../front/login.html";
      } else {
        alert(data.erro || "Erro ao cadastrar usuário.");
      }

    } catch (err) {
      alert("❌ Erro ao conectar com o servidor.");
      console.error(err);
    }
  });

  function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.toLowerCase());
  }
});
