import express from 'express'
import jwt from 'jsonwebtoken'


// Handle admin authentication
const adminAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try{
    let token: any = req.headers['x-admin-token']

    if(!token){
      return res.status(401).json({
        error: {
          msg: "Unauthorized request. Access denied..."
        }
      })
    }

    if(typeof token === "string"){
      let decodeToken: any = await jwt.verify(token, process.env.ADMIN_TOKEN_SECRET)
      req.headers['admin'] = decodeToken.admin

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

export default adminAuth