import express from 'express'
import jwt from 'jsonwebtoken'

// Handle user authentication
const userAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {

  try{
    let token: any = req.headers['x-auth-token'];

    if(!token){
      return res.status(401).json({
        error: {
          msg: "Unauthorized request. Access denied..."
        }
      })
    }

    if(typeof token === "string"){
      let decrypt: any = await jwt.verify(token, process.env.JWT_SECRET_KEY)
      req.headers['user'] = decrypt.user

      next()
    }

  }catch(err){
    res.status(500).json({
      error: {
        msg: "Access denied..."
      }
    })
  }
}

export default userAuth