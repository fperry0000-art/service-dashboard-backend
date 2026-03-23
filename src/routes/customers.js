import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const search = (req.query.search || "").trim();
    const sql = `
      SELECT id, business_name, payment_terms, tax_status, billing_email
      FROM customers_new
      WHERE ? = ''
         OR business_name LIKE CONCAT('%', ?, '%')
      ORDER BY business_name ASC
      LIMIT 100
    `;
    const [rows] = await pool.query(sql, [search, search]);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, business_name, payment_terms, tax_status, billing_email, organization_type, notes
       FROM customers_new
       WHERE id = ?`,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/locations", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, location_name, address1, city, state, zip,
              service_contact_name, service_contact_phone, service_contact_email
       FROM locations
       WHERE customer_id = ?
       ORDER BY location_name ASC, city ASC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;
