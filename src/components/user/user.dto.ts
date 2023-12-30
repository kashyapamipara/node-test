import { Allow, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AddUserBodyDTO {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string;

    @Allow()
    readonly contactNumber: string;

    @IsString()
    @IsNotEmpty()
    readonly role: string;
}

export class UserLoginBodyDTO {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    readonly password: string;
}
