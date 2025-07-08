import { Request, Response } from 'express';

import serverSendingPattern from '../serverSendingPattern';
import { listSpecificUserService, listUsersService } from '../../services/admin/userService';

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