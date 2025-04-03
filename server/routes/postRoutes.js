const express = require("express");
const { requireSingIn } = require("../controllers/userController");
const {
  createPostController,
  getAllPostsContoller,
  getUserPostsController,
  deletePostController,
  updatePostController,
} = require("../controllers/postController");
const upload = require("../helpers/documentUpload");

//router object
const router = express.Router();

// CREATE POST || POST
router.post(
  "/create-post", 
  requireSingIn, 
  upload.single("document"), 
  createPostController
);

//GET ALL POSTs
router.get("/get-all-post", getAllPostsContoller);

//GET USER POSTs
router.get("/get-user-post", requireSingIn, getUserPostsController);

//DELEET POST
router.delete("/delete-post/:id", requireSingIn, deletePostController);

//UPDATE POST
router.put(
  "/update-post/:id", 
  requireSingIn, 
  upload.single("document"),
  updatePostController
);

//export
module.exports = router;
