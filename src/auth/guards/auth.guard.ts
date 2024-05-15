/* eslint-disable @typescript-eslint/no-unused-vars */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload';
import { User } from '../entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  /**
   *
   */
  constructor(private JwtService: JwtService, private authService: AuthService) {
    
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest(); // get the request object.
    const token = this.extractToken(request); // extract the token from the request object.

    if (!token) {
      throw new UnauthorizedException('Unauthorized - Not exists Bearer Token.'); // if there is no token, throw an unauthorized exception.
    }
    
    //? verify the token and get the payload.
    try {
      const payload = await this.JwtService.verifyAsync<JwtPayload>(
        token, // the token to verify.
        { secret: process.env.JWT_SECRET } // the secret key to verify the token.
      );

      const user = await this.authService.findOne(payload.id); // get the user from the database using the id from the payload.


      if (!user) {
        throw new UnauthorizedException('Unauthorized - User not found.'); // if the user is not found, throw an unauthorized exception.
      }
      if(!user.isActive){
        throw new UnauthorizedException('Unauthorized - User is not active.'); // if the user is not active, throw an unauthorized exception.
      }


      request.user = user; // set the user property of the request object to the payload.
      request.token = token; // set the token property of the request object to the token.

   
    } catch (error) {
      throw new UnauthorizedException('Unauthorized - Invalid Token.'); // if the token is invalid, throw an unauthorized exception.
    }
    return true; // if there is a token, return true.

  
  }


  private extractToken(request: Request): string | undefined {

    const [type, token] = request.headers['authorization']?.split(' ') ?? []; // get the token from the authorization header and split it into type and token.
     return type === 'Bearer' && token ? token : undefined; // if the type is Bearer and there is a token, return the token, otherwise return undefined.
  }
}
