import { regularExps } from "../../../config";

interface LoginUser {
    email: string;
    password: string;
}

export class LoginUserDTO {
    private constructor(
        public readonly email: string,
        public readonly password: string
    ) {}
    static login(user: LoginUser): [string?, LoginUserDTO?] {
        const { email, password } = user;

        if (!email) return ["Missing email"];
        if (!regularExps.email.test(email)) return ["Email is not valid"];
        if (!password) return ["Missing password"];
        if (password.length < 6) return ["Password to short"];

        return [undefined, new LoginUserDTO(email, password)];
    }
}
