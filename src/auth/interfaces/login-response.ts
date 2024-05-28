import { UserReturn } from "../auth.service";

export interface LoginResponse {

    user: UserReturn;
    token: string;


    //metodo que retorna el token
    
}