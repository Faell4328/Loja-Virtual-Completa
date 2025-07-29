import { Request, Response, NextFunction } from 'express';

import DatabaseManager from '../services/system/databaseManagerService';
import serverSendingPattern from '../controllers/serverSendingPattern';

export default async function isLogged(req: Request, res: Response, next: NextFunction){
    if(req.cookies['token'] === undefined || req.cookies['token'].length != 128){
        serverSendingPattern(res, '/login', 'Faça login antes de acessar', null, null)
        return;
    }

    let returnDbTokenUser = await DatabaseManager.validateLoginToken(req.cookies['token']);

    if(returnDbTokenUser == null){
        serverSendingPattern(res, '/login', 'Faça login antes de acessar', null, null)
        return;
    }

    const { tokenExpirationDate, userId } = returnDbTokenUser;
    const { status } = returnDbTokenUser.user;

    if(status == "BLOCKED"){
        DatabaseManager.logOut(req.cookies['token']);
        serverSendingPattern(res, null, 'Sua conta está bloqueada. Entre em contato com o suporte para mais informações', null, null)
        return;
    }

    if(tokenExpirationDate === null || tokenExpirationDate < new Date()){
        serverSendingPattern(res, '/login', 'Sua sessão expirou. Faça login novamente para continuar', null, null)
        return;
    }

    req.userId = userId;

    next();
    return;
}