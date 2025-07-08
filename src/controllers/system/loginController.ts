import { Request, Response } from 'express';

import loginService from '../../services/system/loginService';
import { validationResult } from 'express-validator';
import Cookie from '../../services/system/cookie';
import serverSendingPattern from '../serverSendingPattern';

export default async function loginController(req: Request, res: Response){

    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        serverSendingPattern(res, null, errors.errors[0].msg, null, null);
        return;
    }

    const { email, password } = req.body
    
    const returnService = await loginService(email, password);

    if(returnService.error == true){
        serverSendingPattern(res, returnService.redirect, returnService.data, null, null);
        return;
    }
    else{
        Cookie.setCookie(res, returnService.data.token, returnService.data.expiration);

        const { name, email, phone, role } = returnService.data;
        serverSendingPattern(res, '/', null, 'Login realizado', { name, email, phone, role });
        return;
    }

}