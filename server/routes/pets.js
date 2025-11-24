const express = require("express");
const multer = require("multer");
const router = express.Router();
const db = require("../db");

const upload = multer();

// ============================================================
// CADASTRAR ANIMAL
// ============================================================
router.post("/animal", upload.single("foto"), (req, res) => {
  const { id_usuario, nome, idade, raca, sexo, porte, castrado, adotado } = req.body;

  const foto = req.file ? req.file.buffer : null;

  if (!id_usuario || !nome) {
    return res.status(400).json({ erro: "Campos obrigatórios ausentes!" });
  }

  const sql = `
    INSERT INTO animais 
    (id_usuario, nome, idade, raca, sexo, porte, castrado, adotado, foto)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      id_usuario,
      nome,
      idade || null,
      raca || null,
      sexo || null,
      porte || null,
      parseInt(castrado) || 0,
      parseInt(adotado) || 0,
      foto
    ],
    (err, resultado) => {
      if (err) {
        console.error("Erro ao cadastrar animal:", err);
        return res.status(500).json({ erro: "Erro ao cadastrar animal" });
      }

      res.json({
        mensagem: "Animal cadastrado com sucesso!",
        id_animal: resultado.insertId   // 🔥 aqui está o ID que faltava
      });
    }
  );
});


// ============================================================
// LISTAR ANIMAIS DE UM USUÁRIO (CONVERTENDO FOTO BASE64)
// ============================================================
router.get("/animais/:id_usuario", (req, res) => {
  const { id_usuario } = req.params;

  const sql = "SELECT * FROM animais WHERE id_usuario = ?";

  db.query(sql, [id_usuario], (err, resultados) => {
    if (err) {
      console.error("Erro ao buscar animais:", err);
      return res.status(500).json({ erro: "Erro ao buscar animais" });
    }

    // 🔥 Converter foto Buffer -> Base64
    const animaisConvertidos = resultados.map(animal => ({
      ...animal,
      foto: animal.foto ? animal.foto.toString("base64") : null
    }));

    res.json(animaisConvertidos);
  });
});

// ============================================================
// EXCLUIR ANIMAL
// ============================================================
router.delete("/animais/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM animais WHERE id_animais = ?";

  db.query(sql, [id], (err, resultado) => {
    if (err) {
      console.error("Erro ao excluir animal:", err);
      return res.status(500).json({ erro: "Erro ao excluir animal" });
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Animal não encontrado!" });
    }

    res.json({ mensagem: "Animal excluído com sucesso!" });
  });
});


// ============================================================
// BUSCAR UM ANIMAL COMPLETO (COM REMÉDIOS, VACINAS E EXAMES)
// ============================================================
router.get("/animal/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // BUSCA DADOS DO ANIMAL
    const [animal] = await db.promise().query(
      "SELECT * FROM animais WHERE id_animais = ?",
      [id]
    );

    if (animal.length === 0) {
      return res.status(404).json({ erro: "Animal não encontrado!" });
    }

    const pet = animal[0];

    // FOTO EM BASE64
    if (pet.foto) {
      pet.foto = pet.foto.toString("base64");
    }

    // BUSCAR REMÉDIOS
    const [remedios] = await db.promise().query(
      "SELECT * FROM remedios WHERE id_animais = ?",
      [id]
    );

    // BUSCAR VACINAS
    const [vacinas] = await db.promise().query(
      "SELECT * FROM vacinas WHERE id_animais = ?",
      [id]
    );

    // BUSCAR EXAMES
    const [exames] = await db.promise().query(
      "SELECT id_exame, nome, data_exame, descricao FROM exames WHERE id_animais = ?",

      [id]
    );

  

    res.json({
      ...pet,
      remedios,
      vacinas,
      exames
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar animal" });
  }
});





// ============================================================
// ATUALIZAR ANIMAL
// ============================================================
router.put("/animais/:id", upload.single("foto"), (req, res) => {
  const { id } = req.params;
  const { nome, idade, raca, sexo, porte, castrado, adotado } = req.body;

  const foto = req.file ? req.file.buffer : null;

  const sql = `
    UPDATE animais 
    SET nome = ?, idade = ?, raca = ?, sexo = ?, porte = ?, castrado = ?, adotado = ?, foto = COALESCE(?, foto)
    WHERE id_animais = ?
  `;

  db.query(
    sql,
    [
      nome,
      idade || null,
      raca || null,
      sexo || null,
      porte || null,
      parseInt(castrado) || 0,
      parseInt(adotado) || 0,
      foto,
      id
    ],
    (err, resultado) => {
      if (err) {
        console.error("Erro ao atualizar animal:", err);
        return res.status(500).json({ erro: "Erro ao atualizar animal" });
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ erro: "Animal não encontrado!" });
      }

      res.json({ mensagem: "Animal atualizado com sucesso!" });
    }
  );
});

module.exports = router;
