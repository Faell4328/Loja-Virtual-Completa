import { Request, Response, NextFunction } from 'express';

import DatabaseManager from '../services/system/databaseManagerService';
import serverSendingPattern from '../controllers/serverSendingPattern';

export default async function isLogged(req: Request, res: Response, next: NextFunction){
    if(req.cookies['token'] === undefined || req.cookies['token'].length != 128){
        serverSendingPattern(res, '/login', 'Faça login antes de acessar', null, null)
        return;
    }

    let loginToken = await DatabaseManager.validateLoginToken(req.cookies['token']);

    if(!loginToken){
        serverSendingPattern(res, '/login', 'Faça login antes de acessar', null, null)
        return;
    }

    const { tokenExpirationDate } = loginToken;

    if(tokenExpirationDate === null || tokenExpirationDate < new Date()){
        serverSendingPattern(res, '/login', 'Faça login antes de acessar', null, null)
        return;
    }

    req.userId = loginToken.userId;

    next();
    return;
}