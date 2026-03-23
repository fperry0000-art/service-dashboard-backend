import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT i.id, i.invoice_number, i.invoice_date, i.total, i.balance_due, i.paid_status,
              c.business_name, l.location_name
       FROM invoices i
       JOIN customers_new c ON c.id = i.customer_id
       JOIN locations l ON l.id = i.location_id
       ORDER BY i.invoice_date DESC, i.id DESC
       LIMIT 100`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const [[invoice]] = await pool.query(
      `SELECT * FROM invoices WHERE id = ?`,
      [req.params.id]
    );

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    const [items] = await pool.query(
      `SELECT * FROM invoice_items WHERE invoice_id = ? ORDER BY id ASC`,
      [req.params.id]
    );

    res.json({ invoice, items });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  const {
    invoice_number,
    customer_id,
    location_id,
    invoice_date,
    due_date,
    service_requested,
    work_performed,
    subtotal = 0,
    tax = 0,
    total = 0,
    deposit = 0,
    balance_due = 0
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO invoices (
        invoice_number, customer_id, location_id, invoice_date, due_date,
        service_requested, work_performed, subtotal, tax, total, deposit, balance_due
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        invoice_number,
        customer_id,
        location_id,
        invoice_date,
        due_date,
        service_requested,
        work_performed,
        subtotal,
        tax,
        total,
        deposit,
        balance_due
      ]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/items", async (req, res, next) => {
  const { item_type, description, quantity = 1, item_code = null, unit_price = 0, line_total = 0 } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO invoice_items (
        invoice_id, item_type, description, quantity, item_code, unit_price, line_total
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.params.id, item_type, description, quantity, item_code, unit_price, line_total]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
});

export default router;
