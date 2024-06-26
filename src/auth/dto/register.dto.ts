import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDTO {

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @MinLength(6)
    password: string;

    
    // isActive: boolean;
    // roles: string[];
}
