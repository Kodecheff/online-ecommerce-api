import express from 'express'
import jwt from 'jsonwebtoken'
import { CustomSession } from '../app'


// Handle admin authentication
const adminAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {

  if(!req.session){
    return res.status(404).json({
      msg: "Unauthorized request. Access denied..."
    })
  }

  try{

    const admin = (req.session as CustomSession).adminId

    if(!admin){
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

export default adminAuth