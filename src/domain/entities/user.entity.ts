import { CustomError } from "../errors/custom.error"

interface UserEntityP {
    id: string,
    name: string,
    email: string,
    emailValidated: boolean,
    password: string,
    role: string[],
    img?: string
}

export class UserEntity implements UserEntityP {
    id: string
    name: string
    email: string
    emailValidated: boolean
    password: string
    role: string[]
    img?: string | undefined

    constructor({ id, name, email, emailValidated, password, img, role }: UserEntityP){
        this.id = id
        this.name = name
        this.email = email
        this.emailValidated = emailValidated
        this.password = password
        this.role = role
        this.img = img
    }
 

    static fromObject(Object: { [key: string]: any }){
        const { id, _id, name, email, emailValidated, password, role, img } = Object

        if(!_id && !id){
            throw CustomError.badRequest('Missing id')
        }

        if ( !name ) throw CustomError.badRequest('Missing name')
        if ( !email  ) throw CustomError.badRequest('Missing email')
        if ( emailValidated === undefined ) throw CustomError.badRequest('Missing emailValidated')
        if ( !password ) throw CustomError.badRequest('Missing password')
        if ( !role ) throw CustomError.badRequest('Missing role')

        return new UserEntity({ id: id || _id, name, email, emailValidated, password, role, img })
    }
}