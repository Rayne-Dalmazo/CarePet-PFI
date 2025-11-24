document.getElementById("recuperarForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const msg = document.getElementById("msg");

  const resposta = await fetch("http://localhost:3000/api/usuarios/verificar-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });

  const data = await resposta.json();

  if (resposta.ok) {
    localStorage.setItem("emailRecuperacao", email);
    window.location.href = "../front/senha.html";
  }

  msg.textContent = data.mensagem || data.erro;
  msg.style.color = resposta.ok ? "green" : "red";
});
