const JWT = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
var { expressjwt: jwt } = require("express-jwt");

//middleware
const requireSingIn = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

//register
const registerController = async (req, res) => {
  try {
    const { name, email, password, year, team, position } = req.body;  //123456

    // Validation
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Name is required",
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }
    if (!password || password.length < 6) {
      return res.status(400).send({
        success: false,
        message:
          "Password is required and should be at least 6 characters long",
      });
    }
    if (!year) {
      return res.status(400).send({
        success: false,
        message: "Year is required",
      });
    }
    if (!team) {
      return res.status(400).send({
        success: false,
        message: "Team is required",
      });
    }

    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "User already registered with this email",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password); //12345 chgkxnhmgbvn,ghmbgh 

    // Set role and position with default values
    const userRole = "Volunteer"; // Default role as 'Volunteer'
    const userPosition = position ? position : "Volunteer"; // Default position if not provided

    // Create and save the new user
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      year,
      team,
      role: userRole, // Set default role
      position: userPosition, // Set provided or default position
      attendance: 0, // Default value
      hours: 0, // Default value
      eventsAttended: [], // Default as empty array for events attended
    }).save();

    return res.status(201).send({
      success: true,
      message: "Registration successful, please login",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Register API",
      error,
    });
  }
};


//login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User not found",
      });
    }

    // Match password
    const match = await comparePassword(password, user.password);  
    if (!match) {
      return res.status(500).send({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Generate JWT token
    const token = await JWT.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Remove password from the user object before sending response
    user.password = undefined;

    // Send response with token and user info (including role)
    res.status(200).send({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        position: user.position, // Add position to response
        year: user.year, // Add year to response
        team: user.team, // Add team to response
        attendance: user.attendance, // Add attendance to response
        hours: user.hours, // Add hours to response
        eventsAttended: user.eventsAttended, // Include role in response
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in login API",
      error,
    });
  }
};


//update user
const updateUserController = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    //user find
    const user = await userModel.findOne({ email });
    //password validate
    if (password && password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password is required and should be 6 character long",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    //updated useer
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      {
        name: name || user.name,
        password: hashedPassword || user.password,
      },
      { new: true }
    );
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Profile Updated Please Login",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In User Update Api",
      error,
    });
  }
};

// get all users controller
const getAllUsersController = async (req, res) => {
  try {
    // Fetch all users from the database, excluding their passwords
    const users = await userModel.find();
    res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      users,
    });
  } catch (error) {
    console.log("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message, // More specific error message
    });
  }
};



module.exports = {
  requireSingIn,
  registerController,
  loginController,
  updateUserController,
  getAllUsersController,
};
