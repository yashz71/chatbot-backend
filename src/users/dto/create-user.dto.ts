import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    username: string;
  
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;
   
    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;

   
  
}
