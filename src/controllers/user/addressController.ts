import { Request, Response } from 'express';

import { validationResult } from "express-validator";
import { createAddressService, deleteUserAddressService, updateAddressService } from "../../services/user/addressService";
import serverSendingPattern from "../serverSendingPattern";

export async function createAddressController(req: Request, res: Response){
    const errors:any = validationResult(req);
    
    if(!errors.isEmpty()){
        serverSendingPattern(res, null, errors.errors[0].msg, null, null);
        return;
    }

    const { name, street, number, neighborhood, zipCode, state, city, complement } = req.body;

    const returnServiceAddress = await createAddressService(req.userId, name, street, number, neighborhood, zipCode, state, city, complement);

    if(returnServiceAddress.error == true){
        serverSendingPattern(res, returnServiceAddress.redirect, returnServiceAddress.data, null, null);
        return;
    }

    serverSendingPattern(res, null, null, returnServiceAddress.data, null);
    return;
} 

export async function updateAddressController(req: Request, res: Response){
    const errors:any = validationResult(req);
    
    if(!errors.isEmpty()){
        serverSendingPattern(res, null, errors.errors[0].msg, null, null);
        return;
    }

    const { hash } = req.params;
    const { name, street, number, neighborhood, zipCode, state, city, complement } = req.body;

    const returnServiceAddress = await updateAddressService(req.userId, hash, name, street, number, neighborhood, zipCode, state, city, complement);

    if(returnServiceAddress.error == true){
        serverSendingPattern(res, returnServiceAddress.redirect, returnServiceAddress.data, null, null);
        return;
    }

    serverSendingPattern(res, null, null, returnServiceAddress.data, null);
    return;
}

export async function deleteUserAddressController(req: Request, res: Response){

    const { hash } = req.params;
    const returnServiceAddress = await deleteUserAddressService(req.userId, hash);

    if(returnServiceAddress.error == true){
        serverSendingPattern(res, returnServiceAddress.redirect, returnServiceAddress.data, null, null);
        return;
    }

    serverSendingPattern(res, null, null, returnServiceAddress.data, null);
    return;
}