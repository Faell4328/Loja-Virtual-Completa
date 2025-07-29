import { Request, Response } from 'express';

import serverSendingPattern from '../serverSendingPattern';
import { changeStatusUserService, listSpecificUserService, listUsersService } from '../../services/admin/userService';
import { validationResult } from 'express-validator';

export async function listUsersController(req: Request, res: Response){
    const returnServiceUsers = await listUsersService();
    
    if(returnServiceUsers.error == true){
        serverSendingPattern(res, returnServiceUsers.redirect, returnServiceUsers.data, null, null);
        return
    }

    serverSendingPattern(res, returnServiceUsers.redirect, null, null, returnServiceUsers.data);
    return;
}

export async function listSpecificUserController(req: Request, res: Response){
    const returnServiceUser = await listSpecificUserService(req.params.id);

    if(returnServiceUser.error == true){
        serverSendingPattern(res, returnServiceUser.redirect, returnServiceUser.data, null, null);
        return;
    }
    
    serverSendingPattern(res, null, null, null, returnServiceUser.data);
    return;
}

export async function changeStatusUserController(req: Request, res: Response){
    const errors:any = validationResult(req);
    
    if(!errors.isEmpty()){
        serverSendingPattern(res, null, errors.errors[0].msg, null, null);
        return
    }

    const { id } = req.params;

    if(!id){
        serverSendingPattern(res, null, "Não foi enviado o ID do usuário", null, null);
        return;
    }

    const returnService = await changeStatusUserService(id, req.body.status);

    if(returnService.error == true){
        serverSendingPattern(res, returnService.redirect, returnService.data, null, null);
        return;
    }

    serverSendingPattern(res, null, null, returnService.data, null);
    return;
}