const postModel = require("../models/postModel");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// create post
const createPostController = async (req, res) => {
  try {
    const { title, description } = req.body;
    //validate
    if (!title || !description) {
      return res.status(500).send({
        success: false,
        message: "Please Provide All Fields",
      });
    }

    let documentUrl = "";
    
    // Upload document to cloudinary if exists
    if (req.file) {
      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "nss_documents",
        });
        
        documentUrl = result.secure_url;
        
        // Remove file from local storage after upload
        fs.unlinkSync(req.file.path);
      } catch (error) {
        console.log("Cloudinary upload error:", error);
        return res.status(500).send({
          success: false,
          message: "Error uploading document to cloud",
          error,
        });
      }
    }

    const post = await postModel({
      title,
      description,
      document: documentUrl,
      postedBy: req.auth._id,
    }).save();
    
    res.status(201).send({
      success: true,
      message: "Post Created Successfully",
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Create Post API",
      error,
    });
  }
};

// GET ALL POSTS
const getAllPostsContoller = async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .populate("postedBy", "_id name")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "All Posts Data",
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In GETALLPOSTS API",
      error,
    });
  }
};

// get user posts
const getUserPostsController = async (req, res) => {
  try {
    const userPosts = await postModel.find({ postedBy: req.auth._id });
    res.status(200).send({
      success: true,
      message: "user posts",
      userPosts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in User POST API",
      error,
    });
  }
};

// delete post
const deletePostController = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postModel.findById(id);
    
    // Delete document from Cloudinary if exists
    if (post.document) {
      try {
        // Extract public_id from the URL
        const publicId = post.document.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`nss_documents/${publicId}`);
      } catch (error) {
        console.log("Error deleting from cloudinary:", error);
      }
    }
    
    await postModel.findByIdAndDelete({ _id: id });
    
    res.status(200).send({
      success: true,
      message: "Your Post been deleted!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in delete post api",
      error,
    });
  }
};

//UPDATE POST
const updatePostController = async (req, res) => {
  try {
    const { title, description } = req.body;
    //post find
    const post = await postModel.findById({ _id: req.params.id });
    //validation
    if (!title || !description) {
      return res.status(500).send({
        success: false,
        message: "Please Provide post title or description",
      });
    }
    
    let documentUrl = post.document;
    
    // Update document if new one is uploaded
    if (req.file) {
      try {
        // Delete old document from Cloudinary if exists
        if (post.document) {
          try {
            // Extract public_id from the URL
            const publicId = post.document.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`nss_documents/${publicId}`);
          } catch (err) {
            console.log("Error deleting old document:", err);
          }
        }
        
        // Upload new document
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "nss_documents",
        });
        
        documentUrl = result.secure_url;
        
        // Remove file from local storage after upload
        fs.unlinkSync(req.file.path);
      } catch (error) {
        console.log("Cloudinary upload error:", error);
        return res.status(500).send({
          success: false,
          message: "Error uploading document to cloud",
          error,
        });
      }
    }
    
    const updatedPost = await postModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        title: title || post?.title,
        description: description || post?.description,
        document: documentUrl
      },
      { new: true }
    );
    
    res.status(200).send({
      success: true,
      message: "Post Updated Successfully",
      updatedPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update post api",
      error,
    });
  }
};

module.exports = {
  createPostController,
  getAllPostsContoller,
  getUserPostsController,
  deletePostController,
  updatePostController,
};
