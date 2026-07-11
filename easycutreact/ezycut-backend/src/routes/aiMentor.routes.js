const express = require("express");
const router = express.Router();
const { getRecommendation } = require("../controllers/aiMentor.controller");
 
// If your other customer-only routes use an auth middleware, import and
// apply it here too, e.g.:
// const { protect } = require("../middleware/auth.middleware");
// router.post("/recommend", protect, getRecommendation);
 
router.post("/recommend", getRecommendation);
 
module.exports = router;