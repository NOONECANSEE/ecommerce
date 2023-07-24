import { hash } from "bcrypt";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import orderModel from "../models/orderModel.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, question } = req.body;
    // VALIDATION
    if (!name) {
      return res.send({ error: "name is required" });
    }
    if (!email) {
      return res.send({ message: "email is required" });
    }
    if (!password) {
      return res.send({ message: "password is required" });
    }
    if (!phone) {
      return res.send({ message: "phone is required" });
    }
    if (!address) {
      return res.send({ message: "address is required" });
    }
    if (!question) {
      return res.send({ message: "question is required" });
    }
    // check user
    const existingUser = await userModel.findOne({ email });
    // existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already register! Please login",
      });
    }

    // register user
    const hashedPassword = await hashPassword(password);
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      question,
    }).save();
    res.status(201).send({
      success: true,
      message: "Registered Successfully",
      user,
    });
  } catch (err) {
    console.log(err);
    res.send(500).send({
      success: false,
      message: "error in registration",
      err,
    });
  }
};

// POST

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // VALIDATION
    if (!email || !password) {
      res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    // check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "email is not register",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid password",
      });
    }
    // TOKEN
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in login",
      err,
    });
  }
};

// forgotPasswordController

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, question, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is Required" });
    }
    if (!question) {
      res.status(400).send({ message: "Question is Required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is Required" });
    }
    // CHECK EMAIL AND ANSWER
    const user = await userModel.findOne({ email, question });
    // VALIDATION
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email and Question",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Something Went Wrong",
      err,
    });
  }
};

// TEST CONTROLLER
export const testController = (req, res) => {
  try {
    res.send("Protected route");
  } catch (err) {
    console.log(err);
    res.send({ err });
  }
};

// UPDATE PROFILE
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;
    const user = await userModel.findById(req.user._id);
    // PASSWORD CHECK
    if (password && password.length < 6) {
      return res.JSON({
        error: "Password is required and minimum 6 character in Password",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        email: email || user.email,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      success: false,
      message: "Error while updating Profile",
      err,
    });
  }
};
// get order controller
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error while getting products",
      err,
    });
  }
};

// get all orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error while getting products",
      err,
    });
  }
};

// order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};
