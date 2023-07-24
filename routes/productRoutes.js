import express from "express";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
import {
  brainTreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  searchProductController,
  similarProductController,
  updateProductController,
} from "../controllers/productController.js";
import formadiable from "express-formidable";

const router = express.Router();

// routes

// CREATE PRODUCTS
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formadiable(),
  createProductController
);

// GET PRODUCTS
router.get("/get-product", getProductController);

// SINGLE PRODUCTS
router.get("/get-product/:slug", getSingleProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//delete product
router.delete("/delete-product/:pid", deleteProductController);

// update products
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formadiable(),
  updateProductController
);

// filter route
router.post("/product-filters", productFiltersController);

// PRODUCT COUNT
router.get("/product-count", productCountController);

// //product per page
router.get("/product-list/:page", productListController);

// search route
router.get("/search/:keyword", searchProductController);

// similar product
router.get("/similar-product/:pid/:cid", similarProductController);

// category wise product
router.get("/product-category/:slug", productCategoryController);

// payment routes
router.get("/braintree/token", braintreeTokenController);
//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);
export default router;
