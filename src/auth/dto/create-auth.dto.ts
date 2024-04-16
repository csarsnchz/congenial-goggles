import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class CreateAuthDto {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @IsOptional()
    @MinLength(10)
    fullName: string;

    @IsBoolean()
    isActive: boolean;

    @IsString({ each: true })
    @IsArray()
    roles: string[];
}
