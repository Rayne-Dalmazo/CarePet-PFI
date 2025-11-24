const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Rotas importadas
const usuariosRouter = require("./routes/usuarios");
const petsRouter = require("./routes/pets");
const detalhesPetRouter = require("./routes/routes_detalhes_pet.js");

// PASTAS ESTÁTICAS
app.use("/front", express.static(path.join(__dirname, "../front")));
app.use("/css", express.static(path.join(__dirname, "../css")));
app.use("/js", express.static(path.join(__dirname, "../js")));
app.use("/imagens", express.static(path.join(__dirname, "../imagens")));

// Página inicial → login
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../front/login.html"));
});

// Rotas da API
app.use("/api/usuarios", usuariosRouter);
app.use("/api", petsRouter);
app.use("/api", detalhesPetRouter);



// Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
