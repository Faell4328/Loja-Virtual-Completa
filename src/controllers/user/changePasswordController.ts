import { Request, Response } from 'express';

import { validationResult } from "express-validator";
import serverSendingPattern from "../serverSendingPattern";
import { changePasswordService } from '../../services/user/changePasswordService';


export async function changePasswordController(req: Request, res: Response){
    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        serverSendingPattern(res, null, errors.errors[0].msg, null, null);
        return
    }

    const { password1, password2 } = req.body;

    if(password1 != password2){
        serverSendingPattern(res, null, 'As senhas estão diferentes', null, null);
        return;
    }

    const returnService = await changePasswordService(req.userId, req.cookies['token'], password1);

    if(returnService.error == true){
        serverSendingPattern(res, returnService.redirect, returnService.data, null, null);
        return;
    }

    serverSendingPattern(res, null, null, returnService.data, null);
    return;
}