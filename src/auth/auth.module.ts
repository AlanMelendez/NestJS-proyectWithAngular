import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    MongooseModule.forFeature([
      //Expose any mongoose schemas here
      {
        name: User.name, //The name of the model
        schema: UserSchema //The schema to be used
        // schema: {
        //   email: { type: String, required: true, unique: true },
        //   name: { type: String, required: true },
        //   password: { type: String, required: true, minlength: 6 },
        //   isActive: { type: Boolean, default: true },
        //   roles: { type: [String], default: ['user'] },
        // },
      }
    ]),
  ]
})
export class AuthModule {}
