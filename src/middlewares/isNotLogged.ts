import { Request, Response, NextFunction } from 'express';

import DatabaseManager from '../services/system/databaseManagerService';
import serverSendingPattern from '../controllers/serverSendingPattern';

export default async function isNotLogged(req: Request, res: Response, next: NextFunction){
    if(req.cookies['token'] === undefined || req.cookies['token'].length != 128){
        next();
        return;
    }

    let returnDbTokenUser = await DatabaseManager.validateLoginToken(req.cookies['token']);

    if(returnDbTokenUser == null){
        next();
        return;
    }

    const { tokenExpirationDate } = returnDbTokenUser;
    const { status } = returnDbTokenUser.user;

    if(tokenExpirationDate === null || tokenExpirationDate < new Date()){
        next();
        return;
    }

    if(status == "BLOCKED"){
        DatabaseManager.logOut(req.cookies['token']);
        serverSendingPattern(res, null, 'Sua conta está bloqueada. Entre em contato com o suporte para mais informações', null, null)
        return;
    }

    serverSendingPattern(res, '/', 'Essa rota é apenas para pessoas não logadas', null, null)
    return;
}