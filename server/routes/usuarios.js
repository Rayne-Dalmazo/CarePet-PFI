const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");

const db = require("../db");
const router = express.Router();

// =========================================
//  CONFIGURAÇÃO DO MULTER (upload em buffer)
// =========================================
const upload = multer();

// =========================================
//  CADASTRO
// =========================================
router.post("/cadastro", async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos!" });
  }

  try {
    const hashSenha = await bcrypt.hash(senha, 10);
    const sql = "INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)";

    db.query(sql, [nome, email, hashSenha], (err) => {
      if (err) return res.status(500).json({ erro: "Erro ao cadastrar!" });
      return res.json({ mensagem: "Usuário cadastrado com sucesso!" });
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: "Erro no servidor!" });
  }
});

// =========================================
//  LOGIN
// =========================================
router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Preencha email e senha!" });
  }

  const sql = "SELECT * FROM usuario WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro no servidor" });

    if (results.length === 0) {
      return res.status(401).json({ erro: "Usuário não encontrado!" });
    }

    const usuario = results[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: "Senha incorreta!" });
    }

    res.json({
      mensagem: "Login realizado!",
      usuario: {
        id: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  });
});

// =========================================
//  VERIFICAR SE EMAIL EXISTE
// =========================================
router.post("/verificar-email", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ erro: "Informe o email!" });
  }

  const sql = "SELECT id_usuario FROM usuario WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro no servidor" });

    if (results.length === 0) {
      return res.status(404).json({ erro: "Email não encontrado!" });
    }

    return res.json({ mensagem: "Email encontrado!" });
  });
});


// =========================================
//  ALTERAR SENHA SEM TOKEN
// =========================================
router.put("/alterar-senha", async (req, res) => {
  const { email, novaSenha } = req.body;

  if (!email || !novaSenha) {
    return res.status(400).json({ erro: "Envie email e nova senha!" });
  }

  try {
    const hash = await bcrypt.hash(novaSenha, 10);

    const sql = "UPDATE usuario SET senha = ? WHERE email = ?";
    db.query(sql, [hash, email], (err, result) => {
      if (err) return res.status(500).json({ erro: "Erro ao atualizar senha" });

      if (result.affectedRows === 0) {
        return res.status(404).json({ erro: "Email não encontrado!" });
      }

      res.json({ mensagem: "Senha alterada com sucesso!" });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro no servidor!" });
  }
});




// =========================================
//  PEGAR USUÁRIO POR ID
// =========================================
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT id_usuario AS id, nome, email, foto FROM usuario WHERE id_usuario = ?";

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro no servidor" });

    if (results.length === 0)
      return res.status(404).json({ erro: "Usuário não encontrado" });

    const usuario = results[0];

    if (usuario.foto) {
      usuario.foto = Buffer.from(usuario.foto).toString("base64");
    }

    res.json(usuario);
  });
});

// =========================================
//  ATUALIZAR USUÁRIO (nome, email, foto base64)
// =========================================
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, foto } = req.body;

  const campos = [];
  const valores = [];

  if (nome) {
    campos.push("nome = ?");
    valores.push(nome);
  }

  if (email) {
    campos.push("email = ?");
    valores.push(email);
  }

  // Atualizar senha se veio preenchida
  if (senha && senha.trim() !== "") {
    const hashSenha = await bcrypt.hash(senha, 10);
    campos.push("senha = ?");
    valores.push(hashSenha);
  }

  // Atualizar foto (base64 -> buffer)
  if (foto) {
    const bufferFoto = Buffer.from(foto, "base64");
    campos.push("foto = ?");
    valores.push(bufferFoto);
  }

  if (campos.length === 0) {
    return res.status(400).json({ erro: "Nenhum dado enviado para atualização" });
  }

  const sql = `UPDATE usuario SET ${campos.join(", ")} WHERE id_usuario = ?`;
  valores.push(id);

  db.query(sql, valores, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao atualizar!" });
    }
    res.json({ mensagem: "Atualizado com sucesso!" });
  });
});


// =========================================
//  UPLOAD FOTO (multipart/form-data)
// =========================================
router.post("/:id/upload", upload.single("foto"), (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ erro: "Nenhuma foto enviada!" });
  }

  const foto = req.file.buffer;

  const sql = "UPDATE usuario SET foto = ? WHERE id_usuario = ?";
  db.query(sql, [foto, id], (err) => {
    if (err) {
      console.error("Erro ao salvar foto:", err);
      return res.status(500).json({ erro: "Erro ao salvar foto do usuário" });
    }

    res.json({ mensagem: "Foto enviada com sucesso!" });
  });
});

module.exports = router;
