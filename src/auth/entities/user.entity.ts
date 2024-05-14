import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";



@Schema()
export class User {

    @Prop({ required: true, unique: true})
    email: string;
    
    @Prop({ required: true })
    name: string;

    @Prop({ minlength: 6, required: true})
    password: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ type: [String], default: ['user'] })
    roles: string[];

}


export const UserSchema = SchemaFactory.createForClass(User); //Esto es para que mongoose(back) sepa que es un schema de mongoose.