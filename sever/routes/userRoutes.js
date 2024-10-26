const express = require("express");
const {
  registerController,
  loginController,
  updateUserController,
  getAllUsersController,
  requireSingIn,
} = require("../controllers/userController");

const router = express.Router();

// REGISTER || POST
router.post("/register", registerController);

// LOGIN || POST
router.post("/login", loginController);

// UPDATE USER || PUT
router.put("/update-user", requireSingIn, updateUserController);

// GET ALL USERS || GET
router.get("/all-users",requireSingIn, getAllUsersController);

module.exports = router;
