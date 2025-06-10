import { Request, Response } from 'express';

import serverSendingPattern from '../serverSendingPattern';
import logOutService from '../../services/system/logOutService';

export default function logOutController(req: Request, res: Response){
    if(req.userId != undefined && req.userId != null){
        const returnService = logOutService(req.userId);
        if(returnService.error == true){
            serverSendingPattern(res, null, returnService.data, null, null);
        }
        else{
            serverSendingPattern(res, null, null, returnService.data, null);
        }
    }    
    else{
        serverSendingPattern(res, null, 'Você não está logado', null, null);
    }
    return;
}