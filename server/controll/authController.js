const db = require("../db");
const bcrypt = require("bcryptjs");

exports.cadastrar = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha)
    return res.status(400).json({ erro: "Preencha todos os campos!" });

  try {
    const hashSenha = await bcrypt.hash(senha, 10);
    const sql = "INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)";

    db.query(sql, [nome, email, hashSenha], (err) => {
      if (err) return res.status(500).json({ erro: "Erro ao cadastrar!" });
      return res.json({ mensagem: "Usuário cadastrado com sucesso!" });
    });

  } catch (err) {
    return res.status(500).json({ erro: "Erro no servidor!" });
  }
};

exports.login = (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha)
    return res.status(400).json({ erro: "Preencha todos os campos!" });

  const sql = "SELECT * FROM usuario WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro no servidor!" });
    if (results.length === 0) return res.status(404).json({ erro: "Usuário não encontrado!" });

    const usuario = results[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) return res.status(401).json({ erro: "Senha incorreta!" });

    return res.json({
      mensagem: "Login bem-sucedido!",
      usuario: { 
        id: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email
      }
    });
  });
};
