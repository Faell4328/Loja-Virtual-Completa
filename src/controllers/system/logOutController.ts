import { Request, Response } from 'express';

import serverSendingPattern from '../serverSendingPattern';
import logOutService from '../../services/system/logOutService';

export default function logOutController(req: Request, res: Response){
    if(req.userId && req.cookies['token']){

        const returnService = logOutService(req.cookies['token']);

        if(returnService.error == true){
            serverSendingPattern(res, null, returnService.data, null, null);
            return;
        }
        serverSendingPattern(res, null, null, returnService.data, null);
        return;
    }    
    else{
        serverSendingPattern(res, null, 'Você não está logado', null, null);
        return;
    }
}