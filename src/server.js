import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import customersRouter from "./routes/customers.js";
import locationsRouter from "./routes/locations.js";
import equipmentRouter from "./routes/equipment.js";
import invoicesRouter from "./routes/invoices.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/customers", customersRouter);
app.use("/locations", locationsRouter);
app.use("/equipment", equipmentRouter);
app.use("/invoices", invoicesRouter);

app.use(errorHandler);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
