import returnServicePattern from "../returnServicePattern";
import DatabaseManager from "../system/databaseManagerService";

export async function listUserInformationService(userId: string){
    const returnDbInformationUser = await DatabaseManager.listInformationUser(userId);

    if(returnDbInformationUser == null){
        return returnServicePattern(null, true, false, 'Problema ao listar');
    }

    const { name, phone } = returnDbInformationUser;
    
    const addressUserExisting = await DatabaseManager.checkExistingAddress(userId);
    let returnDbUserAddress = null;
    if(addressUserExisting){
        returnDbUserAddress = await DatabaseManager.listInformationAddress(userId);
        return returnServicePattern(null, false, true, { name, phone, address: returnDbUserAddress });
    }

    return returnServicePattern(null, false, true, { name, phone });
}

export async function updateInformationUserService(userId: string, name: string, phone: string='', description: string, street: string, number: string, neighborhood: string, zipCode: string, city: string, state: string, complement: string){
    const returnDbStatusUpdateUserInformation = await DatabaseManager.updateUserInformation(userId, name, phone);

    if(description == undefined && returnDbStatusUpdateUserInformation){
        deleteUserAddressInformationService(userId);
        return returnServicePattern(null, false, true, 'Informação atualizada');
    }
    else if(description == undefined){
        return returnServicePattern(null, true, false, 'Não foi possível atualizar');
    }

    // update address
    const returnDbStatusUpdateUserAddress = await DatabaseManager.updateUserAddressInformation(userId, description, street, number, neighborhood, zipCode, city, state, complement)

    if(returnDbStatusUpdateUserAddress){
        return returnServicePattern(null, false, true, 'Informação atualizada');
    }

    return returnServicePattern(null, true, false, 'Não foi possível atualizar');
}

export async function deleteUserAddressInformationService(userId: string){
    const checkAddress = await DatabaseManager.checkExistingAddress(userId);

    if(checkAddress == false){
        return returnServicePattern(null, true, false, 'Você não possui endereço cadastrado');
    }

    const returnDbAddressDeletionStatus = await DatabaseManager.deleteUserAddress(userId);

    if(returnDbAddressDeletionStatus == null){
        return returnServicePattern(null, true, false, 'Você não possui endereço cadastrado');
    }

    return returnServicePattern(null, false, true, 'Endereço deletado');
}