import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
// router object

const router = express.Router();

// REGISTER || POST METHOD
router.post("/register", registerController);

// LOGIN || POST METHOD
router.post("/login", loginController);

// FORGOT PASSWORD
router.post("/forgot-password", forgotPasswordController);

// TEST ROUTE
router.get("/test", requireSignIn, isAdmin, testController);

// PROTECT USER ROUTE
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// PROTECT ADMIN ROUTE
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// UPDATE PROFILE
router.put("/profile", requireSignIn, updateProfileController);

// ORDERS
router.get("/orders", requireSignIn, getOrdersController);
// ALL ORDERS
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);
export default router;
