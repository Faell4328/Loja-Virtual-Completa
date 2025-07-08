import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import passwordRecoveryService from '../../services/email/passwordRecoveryService';
import serverSendingPattern from '../serverSendingPattern';
import passwordConfirmationService from '../../services/email/passwordConfirmationService';

export async function passwordRecoveryController(req: Request, res: Response){
    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        serverSendingPattern(res, null, errors.errors[0].msg, null, null);
        return;
    }

    const returnService = await passwordRecoveryService(req.body.email);

    if(returnService.error == true){
        serverSendingPattern(res, null, returnService.data, null, null);
        return;
    }else{
        serverSendingPattern(res, null, null, returnService.data, null);
        return;
    }
}

export async function passwordRecoveryConfirmationController(req: Request, res: Response){
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

    const returnService = await passwordConfirmationService(req.params.hash, password1);

    if(returnService.error == true){
        serverSendingPattern(res, returnService.redirect, returnService.data, null, null);
        return;
    }

    serverSendingPattern(res, null, null, returnService.data, null);
    return;
}