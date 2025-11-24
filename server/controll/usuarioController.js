const db = require("../db");

exports.buscarUsuario = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT id_usuario AS id, nome, foto FROM usuario WHERE id_usuario = ?";

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro no servidor" });
    if (results.length === 0) return res.status(404).json({ erro: "Usuário não encontrado" });

    const usuario = results[0];

    if (usuario.foto) {
      usuario.foto = Buffer.from(usuario.foto).toString("base64");
    }

    res.json(usuario);
  });
};
