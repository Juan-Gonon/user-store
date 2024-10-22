import { bcryptAdapter, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import {
    CustomError,
    RegisterUserDto,
    UserEntity,
    LoginUserDTO,
} from "../../domain";

export class AuthService {
    //DI
    constructor() {}

    public async registerUser(registerUserDto: RegisterUserDto) {
        const existUser = await UserModel.findOne({
            email: registerUserDto.email,
        });

        if (existUser) throw CustomError.badRequest("Email already exist");
        try {
            const user = new UserModel(registerUserDto);

            user.password = bcryptAdapter.hash(registerUserDto.password);
            await user.save();
            const { password, ...userEntity } = UserEntity.fromObject(user);

            return { user: userEntity, token: "ABC" };
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
}
