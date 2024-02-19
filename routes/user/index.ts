import express from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import gravatar from "gravatar";

import { IUser } from "../../models/user/IUser";
import { IShipping } from "../../models/shippingInfo/IShipping";
import ShippingSchema from '../../models/shippingInfo/Schema'
import User from "../../models/user/Schema";
import userAuth from "../../middlewares/userAuth";
import adminAuth from "../../middlewares/adminAuth";
import { CustomSession } from "../../app";

const router: express.Router = express.Router();

// Get all users
router.get("/", (req: express.Request, res: express.Response) => {
  res.status(200);
  res.send("Fetched all users");
});

/*
  @usage: Create new user
  @url: http://127.0.0.1:1204/user/create
  @method: POST
  @fields: firstName, lastName, email, password
  @access: PUBLIC
*/
router.post(
  "/create",
  [
    body("firstName").not().isEmpty().withMessage("First name is required."),
    body("lastName").not().isEmpty().withMessage("Last name is required."),
    body("email").isEmail().withMessage("Incorrect email format"),
    body("password").not().isEmpty().withMessage("Password is required."),
  ],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let { firstName, lastName, email, password } = req.body;

      // Check if email exists
      let user: IUser | null = await User.findOne({ email: email });

      if (user) {
        return res.status(400).json({
          error: {
            msg: "Email already exists.",
          },
        });
      }

      // Encrypt password
      let salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);

      // Get avatar url
      let avatar = gravatar.url(email, {
        s: "300",
        r: "pg",
        d: "mm",
      });

      // Register the user
      user = new User({ firstName, lastName, email, password, avatar });
      user = await user.save();

      res.status(201);
      res.json({
        msg: "Sign up successful",
        user,
      });
    } catch (error) {}
  }
);

/*
  @usage: Login user
  @url: http://127.0.0.1:1204/user/login
  @method: POST
  @fields: email, password
  @access: PUBLIC
*/
router.post(
  "/login",
  [
    body("email").not().isEmpty().withMessage("Name is required."),
    body("password").not().isEmpty().withMessage("Password is required."),
  ],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      // Check if email exists
      let user: IUser | null = await User.findOne({ email: email });

      if (!user) {
        return res.status(400).json({
          error: {
            msg: "Invalid email/password",
          },
        });
      }

      // Verify password
      let isMatch: boolean = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          error: {
            msg: "Invalid email/password",
          },
        });
      }

      // Verify if user is an admin
      if (user.isAdmin) {
        (req.session as CustomSession).adminId = user._id;

        req.session.save((err) => {
          if (err) {
            console.log("Error saving session: ", err);
          } else {
            console.log("Session saved successfully: ", req.session);
          }
        });

        return res.status(200).json({
          msg: "Welcome admin",
          firstName: user.firstName,
          lastName: user.lastName,
          email: email,
        });
      }

      // If user is not admin but regular user
      (req.session as CustomSession).userId = user._id;

      req.session.save((err) => {
        if (err) {
          console.log("Error saving session: ", err);
        } else {
          console.log("Session saved successfully: ", req.session);
        }
      });

      res.status(200).json({
        msg: "Login successful",
        firstName: user.firstName,
        lastName: user.lastName,
        email: email,
      });
    } catch (error) {}
  }
);

/*
  @usage: Get authenticated user
  @url: http://127.0.0.1:1204/user/me
  @method: GET
  @access: PRIVATE
*/
router.get(
  "/me",
  userAuth,
  async (req: express.Request, res: express.Response) => {
    try {
      let userId = (req.session as CustomSession).userId;

      let user: IUser | null = await User.findById(userId).select("-password");

      if (!user) {
        return res.status(404).json({
          error: {
            msg: "User record not found.",
          },
        });
      }

      res.status(200).json({
        user,
      });
    } catch (err) {
      res.status(500).json({
        errors: [
          {
            msg: err,
          },
        ],
      });
    }
  }
);

/*
  @usage: Get a user
  @url: http://127.0.0.1:1204/user/:id
  @method: GET
  @access: PUBLIC
*/
router.get("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const userId = req.params.id;

    let user: IUser | null = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({
      errors: [
        {
          msg: err,
        },
      ],
    });
  }
});

/*
  @usage: Get admin dashboard
  @url: http://127.0.0.1:1204/user/admin/dashboard
  @method: GET
  @access: PRIVATE
*/
router.get(
  "/admin/dashboard",
  adminAuth,
  async (req: express.Request, res: express.Response) => {
    try {
      let adminId = (req.session as CustomSession).adminId;

      let admin: IUser | null = await User.findById(adminId).select(
        "-password"
      );

      if (!admin) {
        return res.status(404).json({
          error: {
            msg: "Admin record not found.",
          },
        });
      }

      console.log(admin);

      res.status(200).json({
        admin,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        errors: [
          {
            msg: err,
          },
        ],
      });
    }
  }
);

/*
  @usage: Logout user
  @url: http://127.0.0.1:1204/user/logout
  @method: GET
  @access: PRIVATE
*/
router.post("/logout", userAuth, async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.log("Error logging user out: ", err);
      } else {
        console.log("User logged out successfully");
      }
    });
  } catch (err) {
    console.error("Error logging out:", err);
    return next(new Error("Error logging out"));
  }

  res.status(200).send();
});

/*
  @usage: Logout admin
  @url: http://127.0.0.1:1204/user/admin/logout
  @method: GET
  @access: PRIVATE
*/
router.post("/admin/logout", adminAuth, async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.log("Error logging admin out: ", err);
      } else {
        console.log("Admin logged out successfully");
      }
    });
  } catch (err) {
    console.error("Error logging out:", err);
    return next(new Error("Error logging out"));
  }

  res.status(200).send();
});


/*
  @usage: Add shipping information
  @url: http://127.0.0.1:1204/user/me/shippingInfo
  @method: POST
  @access: PRIVATE
*/

router.post(
  "/me/shippingInfo", userAuth,
  body("firstName").not().isEmpty().withMessage("First name is required."),
  body("lastName").not().isEmpty().withMessage("Last name is required."),
  body("phoneNumber").not().isEmpty().withMessage("Phone number is required"),
  body("address").not().isEmpty().withMessage("Address is required."),
  body("subAddress"),
  body("state").not().isEmpty().withMessage("State is required."),
  body("city").not().isEmpty().withMessage("city is required."),

  async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try{
      const userId = (req.session as CustomSession).userId
      const { firstName, lastName, phoneNumber, address, subAddress, state, city } = req.body

      let shippingInfo = new ShippingSchema({firstName, lastName, phoneNumber, address, subAddress, state, city, userId})

      shippingInfo = await shippingInfo.save()

      res.status(201).json({
        msg: "Shipping info saved successfully...",
        shippingInfo
      })
    }catch(e){

    }

  }
);

export default router;
