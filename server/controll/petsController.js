const db = require("../db");

exports.cadastrarAnimal = (req, res) => {
  const { id_usuario, nome, idade, raca, sexo, porte, castrado, adotado } = req.body;
  const foto = req.file ? req.file.buffer : null;

  if (!id_usuario || !nome) {
    return res.status(400).json({ erro: "Campos obrigatórios ausentes!" });
  }

  const sql = `
    INSERT INTO animais (id_usuario, nome, idade, raca, sexo, porte, castrado, adotado, foto)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [id_usuario, nome, idade, raca, sexo, porte, castrado, adotado, foto], (err) => {
    if (err) {
      console.error("Erro ao cadastrar animal:", err);
      return res.status(500).json({ erro: "Erro ao cadastrar animal" });
    }
    res.json({ mensagem: "Animal cadastrado com sucesso!" });
  });
};
