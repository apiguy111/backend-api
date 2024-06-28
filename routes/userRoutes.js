const {
  createUser,
  updateUser,
  deleteUser,
  getUser,
  patchUser,
  getAllUsers,
} = require("../controllers/userController");
const express = require("express");
const { verifyUser } = require("../middleware/auth");
const router = express.Router();

router.post("/", createUser);
router.put("/:id", verifyUser, updateUser);
router.patch("/:id", verifyUser, patchUser);
router.delete("/:id", verifyUser, deleteUser);
router.get("/find/:id", getUser);
router.get("/users", getAllUsers);

module.exports = router;
