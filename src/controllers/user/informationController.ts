import { Request, Response } from 'express';

import serverSendingPattern from '../serverSendingPattern';
import { validationResult } from 'express-validator';
import { listUserInformationService, updateInformationUserService } from '../../services/user/informationService';

export async function listUserInformationController(req: Request, res: Response){
    const returnServiceInformationUser = await listUserInformationService(req.userId);

    if(returnServiceInformationUser.error == true){
        serverSendingPattern(res, returnServiceInformationUser.redirect, returnServiceInformationUser.data, null, null);
        return;
    }

    serverSendingPattern(res, null, null, null, returnServiceInformationUser.data);
    return;
}

export async function updateUserInformationController(req: Request, res: Response){
    
    const errors:any = validationResult(req);
    
    if(!errors.isEmpty()){
        serverSendingPattern(res, null, errors.errors[0].msg, null, null);
        return;
    }

    const { name, phone } = req.body;

    const returnServiceStatusUpdate = await updateInformationUserService(req.userId, name, phone);
    
    if(returnServiceStatusUpdate.error == true){
        serverSendingPattern(res, returnServiceStatusUpdate.redirect, returnServiceStatusUpdate.data, null, null);
        return;
    }
    
    serverSendingPattern(res, returnServiceStatusUpdate.redirect, null, returnServiceStatusUpdate.data, null);
    return;
}