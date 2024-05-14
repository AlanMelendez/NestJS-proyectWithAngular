/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Body, Injectable, UnauthorizedException } from '@nestjs/common';
import {LoginDto, CreateUserDto, RegisterDTO, UpdateAuthDto} from './dto/index';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './entities/user.entity';


import * as bcrypt from 'bcryptjs';
import { JwtPayload } from './interfaces/jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from './interfaces/login-response';


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
    private jwtService: JwtService
   
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

  async login(@Body() loginDto: LoginDto): Promise<LoginResponse>{

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
      user: userReturn,
      token: this.getJwToken({ id: (userReturn._id).toString() })
    }

  }


  async register(@Body() registerDTO: RegisterDTO): Promise<LoginResponse> {
    const  userRegister = await this.create(registerDTO);
    

    return {
      user: userRegister,
      token: this.getJwToken({ id: (userRegister._id).toString() })
    }
 
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
  getJwToken(payload: JwtPayload){
    const token =  this.jwtService.sign(payload);
    return token;
  }
}
