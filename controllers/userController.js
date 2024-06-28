const { User } = require("../models/userModel");
const jwt = require("jsonwebtoken");

module.exports.createUser = async (req, res, next) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    let newUser;
    newUser = new User(req.body);
    const savedUser = await newUser.save();

    if (!savedUser) {
      throw new Error("Failed to save user");
    }

    const token = jwt.sign(
      { id: newUser._id, name: newUser.name },
      process.env.JWT
    );

    const { ...otherDetails } = savedUser._doc || {};

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })

      .status(200)
      .json(otherDetails);
  } catch (err) {
    console.error("Error creating user:", err);
    res
      .status(500)
      .json({ error: "An error occurred while creating the user" });
    next(err);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, overwrite: true }
    );

    if (!updatedUser) {
      throw new Error("Failed to update user");
    }

    const { ...otherDetails } = updatedUser._doc;

    res.status(200).json(otherDetails);
  } catch (err) {
    console.error("Error updating user:", err);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user" });
    next(err);
  }
};

module.exports.patchUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("Failed to update user");
    }

    const { ...otherDetails } = updatedUser._doc;

    res.status(200).json(otherDetails);
  } catch (err) {
    console.error("Error updating user:", err);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user" });
    next(err);
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json("User not found");
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error("Error listing users:", err);
    res.status(500).json({ error: "An error occurred while fetching users" });
    next(err);
  }
};
