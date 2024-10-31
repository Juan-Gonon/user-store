import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";

export class AuthMiddleware{

   static async validateJWT(req: Request, res: Response, next: NextFunction){
      const authorization = req.header('Authorization')

      if (!authorization) return res.status(401).json({error: 'No token provided'})
      if (!authorization.startsWith('Barer ')) return res.status(401).json({error: 'Invalid Bearer Token'})

      const token = authorization.split(' ').at(1) || ''

      try {
         const payload = await JwtAdapter.validateToken(token)
         
      } catch (error) {
         console.log(error)
         res.status(500).json({ error: 'Internal server error'})
      }


   }
}