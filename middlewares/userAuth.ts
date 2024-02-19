import express from 'express'
import jwt from 'jsonwebtoken'
import { CustomSession } from '../app'

// Handle user authentication
const userAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {

  if(!req.session){
    return res.status(404).json({
      msg: "Unauthorized request. Access denied..."
    })
  }

  try{

    const user = (req.session as CustomSession).userId

    if(!user){
      return res.status(401).json({
        error: {
          msg: "Unauthorized request. Access denied..."
        }
      })
    }

    next()

  }catch(err){
    res.status(500).json({
      error: {
        msg: "Access denied..."
      }
    })
  }
}

export default userAuth