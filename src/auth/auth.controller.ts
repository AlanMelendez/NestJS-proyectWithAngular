/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import {LoginDto, CreateUserDto, RegisterDTO, UpdateAuthDto} from './dto/index';
import { AuthGuard } from './guards/auth.guard';
import { User } from './entities/user.entity';
import { LoginResponse } from './interfaces/login-response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() req: Request){
    //  const user  = req['user']; 
     
    //  return user;

    return this.authService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('checkToken')
  checkToken(@Request() req: Request): LoginResponse{
    const user  = req['user']; 
    return {
      user: user,
      // token: req['token']
      token: this.authService.getJwToken({id: user._id})
    }
  }


  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @Post('/register')
  register(@Body() registerDTO: RegisterDTO) {
    return this.authService.register(registerDTO);
  }
}
