/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './entities/user.entity';


import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';


export interface UserReturn  {
  email: string;
  username: string;
  isActive: boolean;
  roles: string[];
  _id: Types.ObjectId;

}

@Injectable()
export class AuthService {


  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
   
  ){}


   async create(createAuthDto: CreateUserDto): Promise<UserReturn> {

    try{
     
        const { password, ...userData } = createAuthDto;

        const newUser = new this.userModel({
          ...userData,
          password: bcrypt.hashSync(password, 10)
        });

        await newUser.save();

        var userReturn: UserReturn = {
          email: newUser.email,
          username: newUser.name,
          isActive: newUser.isActive,
          roles: newUser.roles,
          _id: newUser._id
        }

        return userReturn;

        
 
    }catch(err){
      if(err.code === 11000){
        throw new BadRequestException('Email already exists');
      }
    }

  }

  async login(@Body() loginDto: LoginDto) {

    const { email, password } = loginDto;

    //Verify if user exists with email in the database.
    const user = await this.userModel.findOne({ email });

    if(!user){
      throw new UnauthorizedException('Invalid credentials -  Verify email or password');
    }

    if(!bcrypt.compareSync(password, user.password)){
      throw new UnauthorizedException('Invalid credentials -  Verify email or password');
    }

    const userReturn: UserReturn = {
      email: user.email,
      username: user.name,
      isActive: user.isActive,
      roles: user.roles,
      _id: user._id
    } as UserReturn;
    

    console.log(userReturn)

    return {
      data: userReturn,
      token: 'token-valido papa'
    }

    
    // return loginDto;

  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
