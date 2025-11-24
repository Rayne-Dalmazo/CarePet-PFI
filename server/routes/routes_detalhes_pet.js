const express = require("express");
const router = express.Router();
const db = require("../db");

// ===================================================
// SALVAR REMÉDIO (SEM FOTO)
// ===================================================
router.post("/remedio", async (req, res) => {
    try {
        const { id_animal, nome, dosagem, data_inicio } = req.body;

        if (!id_animal) {
            return res.status(400).json({ error: "ID do animal é obrigatório." });
        }

        await db.query(
            "INSERT INTO remedios (id_animais, nome, dosagem, data_inicio) VALUES (?, ?, ?, ?)",
            [id_animal, nome, dosagem, data_inicio]
        );

        res.json({ message: "Remédio salvo com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao salvar remédio" });
    }
});

// ===================================================
// SALVAR VACINA (SEM FOTO)
// ===================================================
router.post("/vacina", async (req, res) => {
    try {
        const { id_animal, nome, data_aplicacao, proxima_dose } = req.body;

        await db.query(
            "INSERT INTO vacinas (id_animais, nome, data_aplicacao, proxima_dose) VALUES (?, ?, ?, ?)",
            [id_animal, nome, data_aplicacao, proxima_dose]
        );

        res.json({ message: "Vacina registrada com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao salvar vacina" });
    }
});


router.post("/exame", async (req, res) => {
    try {
        const { id_animal, nome, data_exame, descricao } = req.body;

        await db.query(
            "INSERT INTO exames (id_animais, nome, data_exame, descricao) VALUES (?, ?, ?, ?)",
            [id_animal, nome, data_exame, descricao]
        );

        res.json({ message: "Exame registrado com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao salvar exame" });
    }
});



router.delete("/remedio/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM remedios WHERE id_remedios = ?", [id]);
        res.json({ message: "Remédio excluído!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Erro ao excluir remédio" });
    }
});


router.delete("/vacina/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM vacinas WHERE id_vacina = ?", [id]);
        res.json({ message: "Vacina excluída!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Erro ao excluir vacina" });
    }
});


router.delete("/exame/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM exames WHERE id_exame = ?", [id]);
        res.json({ message: "Exame excluído!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Erro ao excluir exame" });
    }
});

// ===================================================
// LISTAR REMÉDIOS DO ANIMAL
// ===================================================
router.get("/remedios/:id_animal", async (req, res) => {
    const { id_animal } = req.params;

    try {
        const [rows] = await db.query(
            "SELECT * FROM remedios WHERE id_animais = ?",
            [id_animal]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar remédios" });
    }
});

// ===================================================
// LISTAR VACINAS DO ANIMAL
// ===================================================
router.get("/vacinas/:id_animal", async (req, res) => {
    const { id_animal } = req.params;

    try {
        const [rows] = await db.query(
            "SELECT * FROM vacinas WHERE id_animais = ?",
            [id_animal]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar vacinas" });
    }
});

// ===================================================
// LISTAR EXAMES DO ANIMAL
// ===================================================
router.get("/exames/:idAnimal", async (req, res) => {
  try {
    const { idAnimal } = req.params;
    const [rows] = await db.query("SELECT * FROM exames WHERE id_animais = ?", [idAnimal]);

    return res.json(rows || []); // <- IMPORTANTE
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao carregar exames." });
  }
});



module.exports = router;
