import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()


export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, 
    // { expiresIn: "1" }
    )
}

export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_REFRESH, 
    // { expiresIn: "3m" }
    )
}