const express = require("express");
const router = express.Router();
const {
  getRates,
  convertCurrency,
} = require("../controllers/currencyController");

router.get("/rates/:base", getRates);
router.get("/convert", convertCurrency);

module.exports = router;
