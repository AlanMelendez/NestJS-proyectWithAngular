import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [

    ConfigModule.forRoot(),

    MongooseModule.forFeature([
      //Expose any mongoose schemas here
      {
        name: User.name, //The name of the model
        schema: UserSchema //The schema to be used
      }
    ]),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },

    }),
  ]
})
export class AuthModule {}
