import { Request, Response } from "express";

export class AuthController{

    // DI
    constructor(){}

    register = (req : Request, res: Response) => {
        res.json('Register user')
    }
    loginUser = (req : Request, res: Response) => {
        res.json('Login user')
    }
    validateEmail = (req : Request, res: Response) => {
        res.json('validate Email')
    }

}