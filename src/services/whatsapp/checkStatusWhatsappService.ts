import { Response } from 'express';
import axios from 'axios';

import { setQrcode, setWhatsappReady } from '../../routes/admin';

export default async function checkStatusWhatsappService(res: Response){

    const axiosClient = axios.create({
        baseURL: 'http://localhost:5001'
    });
    
    let retorno;

    try{
        retorno = await axiosClient.get('/status');
        retorno = retorno.data;
        axiosClient.get('/start');
    }
    catch(error){
        retorno = null;
        console.log('Deu erro - '+error);
        return 'Erro, favor solicitar ajuda do suporte';
    }

    if(retorno == 'Não iniciado'){
        setWhatsappReady(false);
        setQrcode('');
        return 'Whatsapp não conectado';
    }
    else{
        setWhatsappReady(true);
        setQrcode('');
        return 'Whatsapp conectado';
    }
}