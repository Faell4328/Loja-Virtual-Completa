import { Request, Response } from 'express';
import checkStatusWhatsappService from '../../services/whatsapp/checkStatusWhatsappService';
import serverSendingPattern from '../serverSendingPattern';

export default async function whatsappController(req: Request, res: Response){
    const returnService: string = await checkStatusWhatsappService(res);

    if(returnService == "Erro, favor solicitar ajuda do suporte"){
        serverSendingPattern(res, null, returnService, null, null);
    }
    else if(returnService == "Whatsapp não conectado"){
        serverSendingPattern(res, null, null, null, returnService);
    }
    else if(returnService == "Whatsapp conectado"){
        serverSendingPattern(res, null, null, null, returnService);
    }

}