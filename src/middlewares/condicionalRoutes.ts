import { Request, Response, NextFunction } from 'express';
import { statusSystem } from '../tools/status';
import serverSendingPattern from '../controllers/serverSendingPattern';

export function regularlCondicionalRoutes(req: Request, res: Response, next: NextFunction){
    if(statusSystem < 2){
        if(statusSystem == 1){
            serverSendingPattern(res, '/instalacao/admin', null, null, null);
            return;
        }
        else{
            serverSendingPattern(res, '/instalacao/config', null, null, null);
            return;
        }
    }
    next();
}

export function instalationConditionalRoutes(req: Request, res: Response, next: NextFunction){
    if(statusSystem >= 2){
        serverSendingPattern(res, '/', "Essa etapa já foi feita", null, null);
        return;
    }
    next();
}