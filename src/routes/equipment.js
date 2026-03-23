import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/:id", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM equipment WHERE id = ?`,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Equipment not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
