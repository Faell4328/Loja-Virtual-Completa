import { Request, Response } from 'express';

import serverSendingPattern from '../serverSendingPattern';
import { validationResult } from 'express-validator';
import { deleteUserAddressInformationService, listUserInformationService, updateInformationUserService } from '../../services/user/informationService';

export async function listUserInformationController(req: Request, res: Response){
    const returnServiceInformationUser = await listUserInformationService(req.userId);

    if(returnServiceInformationUser.error == true){
        serverSendingPattern(res, returnServiceInformationUser.redirect, returnServiceInformationUser.data, null, null);
        return;
    }

    serverSendingPattern(res, null, null, null, returnServiceInformationUser.data);
    return;
}

export async function uploadUserInformationController(req: Request, res: Response){
    
    const errors:any = validationResult(req);
    
    if(!errors.isEmpty()){
        serverSendingPattern(res, null, errors.errors[0].msg, null, null);
        return;
    }

    const { name, phone, description, street, number, neighborhood, zipCode, state, city, complement } = req.body;

    const address = [ description, street, number, neighborhood, zipCode, state, city, complement ];
    
    const someWithValue = address.some(item => item !== undefined);
    address.pop();
    const allUndefined = address.every(item => item !== undefined);
    
    if( someWithValue && !allUndefined ){
        serverSendingPattern(res, null, 'Se você colocou algum campo de endereço, deve colocar todos os campos', null, null);
        return;
    }

    const returnServiceStatusUpdate = await updateInformationUserService(req.userId, name, phone, description, street, number, neighborhood, zipCode, city, state, complement);
    
    if(returnServiceStatusUpdate.error == true){
        serverSendingPattern(res, returnServiceStatusUpdate.redirect, returnServiceStatusUpdate.data, null, null);
        return;
    }
    
    serverSendingPattern(res, returnServiceStatusUpdate.redirect, null, returnServiceStatusUpdate.data, null);
    return;
}

export async function deleteUserAddressInformationController(req: Request, res: Response){
    const returnServiceAddress = await deleteUserAddressInformationService(req.userId);
    if(returnServiceAddress.error == true){
        serverSendingPattern(res, returnServiceAddress.redirect, returnServiceAddress.data, null, null);
        return;
    }

    serverSendingPattern(res, null, null, returnServiceAddress.data, null);
    return;
}