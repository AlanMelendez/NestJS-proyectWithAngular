/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {


  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
   
  ){}


   async create(createAuthDto: CreateUserDto): Promise<User> {

    try{
        const newUser = new this.userModel(createAuthDto);

    return await newUser.save();

    }catch(err){
      if(err.code === 11000){
        throw new BadRequestException('Email already exists');
      }
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
}
