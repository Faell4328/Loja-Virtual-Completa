import { Request, Response, NextFunction } from 'express';

import DatabaseManager from '../services/system/databaseManagerService';
import serverSendingPattern from '../controllers/serverSendingPattern';

export default async function isAdmin(req: Request, res: Response, next: NextFunction){
    if(req.cookies['token'] === undefined || req.cookies['token'].length != 128){
        serverSendingPattern(res, '/login', 'Faça login antes de acessar', null, null)
        return;
    }

    let loginToken = await DatabaseManager.validateLoginToken(req.cookies['token'] as string);

    if(!loginToken){
        serverSendingPattern(res, '/login', 'Faça login antes de acessar', null, null)
        return;
    }

    const { tokenExpirationDate } = loginToken;
    const { role } = loginToken.user;

    if(tokenExpirationDate === null || tokenExpirationDate < new Date()){
        serverSendingPattern(res, '/login', 'Faça login antes de acessar', null, null)
        return;
    }
    else if(role !== 'ADMIN'){
        serverSendingPattern(res, '/', 'Você não tem permissão para acessar essa página', null, null)
        return;
    }

    req.userId = loginToken.userId;

    next();
    return;
}