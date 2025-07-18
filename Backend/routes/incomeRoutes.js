const express = require("express");
const { Protect } = require("../middleware/authMiddleware");
const {
  addIncome,
  getAllIncome,
  deletIncome,
  updateIncome,
  downloadIncomeExcel,
} = require("../controllers/incomeController");

const router = express.Router();

router.post("/", Protect, addIncome);
router.post("/add", Protect, addIncome);
router.get("/", Protect, getAllIncome);
router.get("/get", Protect, getAllIncome);
router.put("/:id", Protect, updateIncome);
router.delete("/:id", Protect, deletIncome);
router.get("/download-excel", Protect, downloadIncomeExcel);

module.exports = router;
