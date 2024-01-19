import express from 'express'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import gravatar from 'gravatar'
import jwt from 'jsonwebtoken'


import { IUser } from '../../models/user/IUser'
import User from '../../models/user/Schema'
import userAuth from '../../middlewares/userAuth'
import adminAuth from '../../middlewares/adminAuth'

const router: express.Router = express.Router()


// Get all users
router.get('/', (req: express.Request, res: express.Response) => {

  res.status(200)
  res.send("Fetched all users")
})


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

    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array()})
    }
    

    try {
      let { firstName, lastName, email, password } = req.body;

      // Check if email exists
      let user: IUser | null = await User.findOne({email: email})

      if(user){
        return res.status(400).json({
          error: {
            msg: "Email already exists."
          }
        })
      }

      // Encrypt password
      let salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);

      // Get avatar url
      let avatar = gravatar.url(email, {
        s: '300',
        r: 'pg',
        d: 'mm'
      })

      // Register the user
      user = new User({firstName, lastName, email, password, avatar})
      user = await user.save()

      res.status(201);
      res.json({
        msg: "Sign up successful",
        user
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

    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array()})
    }
  

    try {
      const { email, password } = req.body;

      // Check if email exists
      let user: IUser | null = await User.findOne({email: email})

      if(!user){
        return res.status(400).json({
          error: {
            msg: "Invalid email/password"
          }
        })
      }

      // Verify password
      let isMatch: boolean = await bcrypt.compare(password, user.password)

      if(!isMatch){
        return res.status(401).json({
          error: {
            msg: "Invalid email/password"
          }
        })
      }


      // Verify if user is an admin
      if(user.isAdmin){
        // Create admin token
        let payload: any = {
          admin: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          }
        }

        let secretkey: string | undefined = process.env.ADMIN_TOKEN_SECRET 

        if(secretkey){
          let token = await jwt.sign(payload, secretkey)

          return res.status(200).json({
            msg: "Welcome admin",
            firstName: user.firstName,
            lastName: user.lastName,
            email: email,
            token
          });
        }
      }

      // Create user token
      let payload: any = {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      }

      let secretkey: string | undefined = process.env.JWT_SECRET_KEY

      if(secretkey){
        let token = await jwt.sign(payload, secretkey)

        res.status(200);
        res.json({
          msg: "Login successful",
          firstName: user.firstName,
          lastName: user.lastName,
          email: email,
          token
        });
      }
        
    } catch (error) {}
  }
);

/*
  @usage: Get authenticated user
  @url: http://127.0.0.1:1204/user/me
  @method: GET
  @access: PRIVATE
*/
router.get('/me', userAuth, async (req: express.Request, res: express.Response) => {

  try{
    let tokenUser: any = req.headers['user'] 

    let user:IUser | null = await User.findById(tokenUser._id).select('-password')

    if(!user){
      return res.status(404).json({
        error: {
          msg: "User record not found."
        }
      })
    }

    res.status(200).json({
      user
    })

  }catch(err) {
    res.status(500).json({
      errors: [
        {
          msg: err
        }
      ]
    })
  }
})

/*
  @usage: Get a user
  @url: http://127.0.0.1:1204/user/:id
  @method: GET
  @access: PUBLIC
*/
router.get('/:id', async (req: express.Request, res: express.Response) => {

  try{
    const userId = req.params.id

    let user:IUser | null = await User.findById(userId).select('-password')

    if(!user){
      return res.status(404).json({
        msg: "User not found"
      })
    }

    res.status(200).json({user})

  }catch(err) {
    res.status(500).json({
      errors: [
        {
          msg: err
        }
      ]
    })
  }
})


/*
  @usage: Get admin dashboard
  @url: http://127.0.0.1:1204/user/admin/dashboard
  @method: GET
  @access: PRIVATE
*/
router.get('/admin/dashboard', adminAuth, async (req: express.Request, res: express.Response) => {
  try{
    let adminUser: any = req.headers['admin'] 

    console.log(adminUser)

    let admin:IUser | null = await User.findById(adminUser._id).select('-password')

    if(!admin){
      return res.status(404).json({
        error: {
          msg: "Admin record not found."
        }
      })
    }

    console.log(admin)

    res.status(200).json({
      admin
    })

  }catch(err) {
    console.log(err)
    res.status(500).json({
      errors: [
        {
          msg: err
        }
      ]
    })
  }
})

export default router;