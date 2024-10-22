import { bcryptAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import {
    CustomError,
    RegisterUserDto,
    UserEntity,
    LoginUserDTO,
} from "../../domain";
import { EmailService } from "./email.service";

export class AuthService {
    //DI
    constructor(
        private readonly emailService: EmailService
    ) {}

    public async registerUser(registerUserDto: RegisterUserDto) {
        const existUser = await UserModel.findOne({
            email: registerUserDto.email,
        });

        if (existUser) throw CustomError.badRequest("Email already exist");
        try {
            const user = new UserModel(registerUserDto);

            user.password = bcryptAdapter.hash(registerUserDto.password);
            await user.save();

            await this.sendEmailValidationLink(user.email)

            const { password, ...userEntity } = UserEntity.fromObject(user);
            const token = await JwtAdapter.generateToken({ id: user.id })

            if( !token ) throw CustomError.internalServer('Error while creating JWT')

            return { user: userEntity, token };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    public async loginUser(loginUserDto: LoginUserDTO) {
        try {
            const user = await UserModel.findOne({
                email: loginUserDto.email,
            });

            if (!user) throw CustomError.badRequest("User does not exist");

            const isMatching = bcryptAdapter.compare(
                loginUserDto.password,
                user.password
            );

            if (!isMatching) throw CustomError.badRequest("Invalid user");

            const { password, ...userEntity} = UserEntity.fromObject(user!);
            const token = await JwtAdapter.generateToken({ id: user.id })

            if( !token ) throw CustomError.internalServer('Error while creating JWT')

            return {
                user: userEntity,
                token
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    private sendEmailValidationLink = async(email: string) => {
        const token = await JwtAdapter.generateToken({ email })

        if(!token) throw CustomError.internalServer('Error getting token')

        const link = `${envs.WEBSERVER_URL}/auth/validate-email/${token}`;

        const html = `
        <h1> Validate your email </h1>
        <p> Click on the following link to validate your email </p>
        <a href="${link}" >Validate your email: ${email} </a>
        `

        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html
        }

        const isSent = await this.emailService.sendEmail(options)

        if(!isSent) throw CustomError.internalServer('Error sending email')

        return true
    }
}
