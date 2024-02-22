import express from "express";
import { body, validationResult } from "express-validator";

import userAuth from "../../middlewares/userAuth";
import upload from "../../middlewares/uploadProduct";
import { IProduct } from "../../models/product/IProduct";
import Product from "../../models/product/ProductSchema";
import { ICart } from "../../models/cart/ICart";
import Cart from "../../models/cart/Schema";
import { CustomSession } from "../../app";

const router: express.Router = express.Router();

/*
  @usage: Get all products
  @url: http://127.0.0.1:1204/product
  @access: PUBLIC
  @method: get
*/
router.get("/", async (req: express.Request, res: express.Response) => {
  let product: IProduct[] | null = await Product.find({});

  if (!product) {
    return res.status(400).json({ msg: "No product not found." });
  }
  res.status(200).json({ product });
});

/*
  @usage: Get product by the id
  @url: http://127.0.0.1:1204/product/:id
  @access: PUBLIC
  @method: get
*/
router.get("/:id", async (req: express.Request, res: express.Response) => {
  const productId = req.params.id;

  let product: IProduct | null = await Product.findById(productId);

  if (!product) {
    return res.status(400).json({ msg: "Product not found." });
  }

  res.status(200).json({ product });
});

/*
  @usage: To create new product
  @url: http://127.0.0.1:1204/product/create
  @access: PUBLIC
  @fields: product name, description, price, base quantity, quantity, coverimage, otherImages(limit: 3), type
  @method: post
*/
router.post(
  "/create",
  body("name").not().isEmpty().withMessage("Product name is required"),
  body("description").not().isEmpty().withMessage("Please enter a description"),
  body("price").not().isEmpty().withMessage("Please enter a price"),
  body("baseQuantity")
    .not()
    .isEmpty()
    .withMessage("Please enter available quantity"),
  body("type").not().isEmpty().withMessage("Please select product type"),
  userAuth,
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let { name, description, price, baseQuantity, type } = req.body;
      let coverImage: string;
      let otherImages: string[];

      if (!otherImages) {
        otherImages = [];
      }

      // Check if a file is uploaded
      if (!req.files && !req.files["coverImage"]) {
        return res
          .status(400)
          .json({ msg: "Please upload a cover image for the product." });
      }

      coverImage = req.files["coverImage"][0].path;

      for (const obj of req.files["otherImages"]) {
        console.log(obj);

        otherImages.push(obj.path);
      }

      let product: IProduct | null = new Product({
        name,
        description,
        price,
        baseQuantity,
        coverImage,
        otherImages,
        type,
      });

      product = await product.save(); // Save product

      res.status(201).json({
        msg: "Product uploaded successfully",
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        msg: err,
      });
    }
  }
);

/*
  @usage: Add product to cart
  @url: http://127.0.0.1:1204/product/:id/addtocart
  @access: PRIVATE
  @method: post
*/
router.post(
  "/:id/addtocart",
  body("purchaseQuantity").not().isEmpty().withMessage("Quantity is required"),
  userAuth,
  async (req: express.Request, res: express.Response) => {
    const productId = req.params.id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try{

      const { purchaseQuantity } = req.body;

      let product: IProduct | null = await Product.findById(productId);

      if (!product) {
        return res.status(400).json({ msg: "Product not found." });
      }

      const totalItems = []

      let item = {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: purchaseQuantity,
        type: product.type
      }

      totalItems.push(item)

      function calcTotalPrice(items){
        let totalPrice = 0;

        for(const item of items){
          totalPrice += (parseInt(item.price) * parseInt(item.quantity))
        }

        return totalPrice
      }

      let cart: ICart | null = await Cart.findOne({userId: (req.session as CustomSession).userId})

      // If no existing cart for that user, create a new cart
      if(!cart){

        let cart: ICart | null = new Cart({
          productId,
          quantity: purchaseQuantity,
          price: parseInt(product.price) * purchaseQuantity,
          userId: (req.session as CustomSession).userId,
          items: totalItems,
          totalPrice: calcTotalPrice(totalItems)
        })

        await cart.save().then((cart) => {  
  
          req.session.save(err => {
            if(err){
              console.log("Error saving session: ", err)
            }else{
              console.log("Session saved successfully: ", req.session)
            }
          })
        })

        return res.status(200).json({
          msg: "Cart updated successfully",
          cart
        });

      }
      else{

        // If there is an existing cart
        cart.items.push(item)

        cart.totalPrice = calcTotalPrice(cart.items)

        cart.save().then((updatedCart) => {

          res.status(200).json({
            msg: "Cart updated successfully",
            updatedCart
          });
        }).catch(err => {
          console.log("Error updating cart: ", err)
        })
      }

    }catch(err){
      console.log(err)
    }
  }
);

export default router;
