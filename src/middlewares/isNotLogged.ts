import { Request, Response, NextFunction } from 'express';

import DatabaseManager from '../services/system/databaseManagerService';
import serverSendingPattern from '../controllers/serverSendingPattern';

export default async function isNotLogged(req: Request, res: Response, next: NextFunction){
    if(req.cookies['token'] === undefined || req.cookies['token'].length != 128){
        next();
        return;
    }

    let loginToken = await DatabaseManager.validateLoginToken(req.cookies['token']);

    if(!loginToken){
        next();
        return;
    }

    const { tokenExpirationDate } = loginToken;

    if(tokenExpirationDate === null || tokenExpirationDate < new Date()){
        next();
        return;
    }

    serverSendingPattern(res, '/', 'Essa rota é apenas para pessoas não logadas', null, null)
    return;
}