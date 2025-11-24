document.getElementById("cadastroForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = localStorage.getItem("emailRecuperacao");
  const novaSenha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;
  const msg = document.getElementById("msg");

  if (novaSenha !== confirmarSenha) {
    msg.textContent = "As senhas não coincidem!";
    msg.style.color = "red";
    return;
  }

  const resposta = await fetch("http://localhost:3000/api/usuarios/alterar-senha", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, novaSenha })
  });

  const data = await resposta.json();

  msg.textContent = data.mensagem || data.erro;
  msg.style.color = resposta.ok ? "green" : "red";

  if (resposta.ok) {
    setTimeout(() => (window.location.href = "login.html"), 1500);
  }
});
