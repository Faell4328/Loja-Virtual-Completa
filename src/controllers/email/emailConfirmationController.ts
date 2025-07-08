import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import Cookie from '../../services/system/cookie';
import serverSendingPattern from '../serverSendingPattern';
import { emailConfirmationService, resendEmailConfirmationService } from '../../services/email/emailConfirmationService';

export async function resendEmailConfirmationController(req: Request, res: Response){
    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        serverSendingPattern(res, null, errors.errors[0].msg, null, null);
        return
    }

    const serviceReturn: string = await resendEmailConfirmationService(req.body.email);

    if(serviceReturn === 'Foi reenviado para seu email'){
        serverSendingPattern(res, null, null, serviceReturn, null);
        return
    }

    serverSendingPattern(res, null, serviceReturn, null, null);
    return;
}

interface serviceReturnProps{
    status: string;
    token: string | null;
    expiration: Date | null
}

export async function emailConfirmationController(req: Request, res: Response){
    const serviceReturn: string | serviceReturnProps = await emailConfirmationService(req.params.hash);

    if(typeof(serviceReturn) === 'string'){
        serverSendingPattern(res, null, serviceReturn, null, null);
        return;
    }

    if(serviceReturn.token == null || serviceReturn.expiration == null){
        serverSendingPattern(res, null, serviceReturn.status, null, null);
        return;
    }

    Cookie.setCookie(res, serviceReturn.token, serviceReturn.expiration);
    serverSendingPattern(res, null, null, serviceReturn.status, null);
    return;
}