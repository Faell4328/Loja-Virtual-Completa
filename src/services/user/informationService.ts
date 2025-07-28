import returnServicePattern from "../returnServicePattern";
import DatabaseManager from "../system/databaseManagerService";

export async function listUserInformationService(userId: string){
    const returnDbInformationUser = await DatabaseManager.listInformationUser(userId);

    if(returnDbInformationUser == null){
        return returnServicePattern(null, true, false, 'Problema ao listar');
    }

    const { name, phone } = returnDbInformationUser;
    
    const returnDbUserAddress = await DatabaseManager.listInformationAddress(userId);
    
    if(returnDbUserAddress !== null && returnDbUserAddress.length > 0){
        return returnServicePattern(null, false, true, { name, phone, address: returnDbUserAddress });
    }
    else{
        return returnServicePattern(null, false, true, { name, phone });
    }
}

export async function updateInformationUserService(userId: string, name: string, phone: string){

    const returnDbStatusUpdateUserInformation = await DatabaseManager.updateUserInformation(userId, name, phone);

    if(returnDbStatusUpdateUserInformation !== null){
        return returnServicePattern(null, false, true, 'Informação atualizada');
    }
    else{
        return returnServicePattern(null, true, false, 'Não foi possível atualizar');
    }

    // if(description == undefined && returnDbStatusUpdateUserInformation){
    //     deleteUserAddressInformationService(userId);
    //     return returnServicePattern(null, false, true, 'Informação atualizada');
    // }
    // else if(description == undefined){
    //     return returnServicePattern(null, true, false, 'Não foi possível atualizar');
    // }

    // // update address
    // const returnDbStatusUpdateUserAddress = await DatabaseManager.updateUserAddressInformation(userId, description, street, number, neighborhood, zipCode, city, state, complement)

    // if(returnDbStatusUpdateUserAddress){
    //     return returnServicePattern(null, false, true, 'Informação atualizada');
    // }

    // return returnServicePattern(null, true, false, 'Não foi possível atualizar');
}

export async function createAddressService(userId: string, description: string, street: string, number: string, neighborhood: string, zipCode: string, city: string, state: string, complement: string){
    const addressQuantity = await DatabaseManager.consultAddressQuantity(userId);

    if(addressQuantity >= 10){
        return returnServicePattern(null, true, false, 'Limite de endereços atingido. Remova os que não usa mais para continuar.');
    }

    const returnDbStatusUpdateUserInformation = await DatabaseManager.createAddress(userId, description, street, number, neighborhood, zipCode, state, city, complement);

    if(returnDbStatusUpdateUserInformation == true){
        return returnServicePattern(null, false, true, 'Endereço cadastrado');
    }
    else{
        return returnServicePattern(null, true, false, 'Não foi possível cadastrar o endereço');
    }
}

export async function updateAddressService(userId: string, addressId: string, description: string, street: string, number: string, neighborhood: string, zipCode: string, city: string, state: string, complement: string){
    const returnDbStatusUpdateUserInformation = await DatabaseManager.updateAddress(userId, addressId, description, street, number, neighborhood, zipCode, state, city, complement);

    if(returnDbStatusUpdateUserInformation == true){
        return returnServicePattern(null, false, true, 'Endereço atualizado');
    }
    else{
        return returnServicePattern(null, true, false, 'Não foi possível atualizar o endereço');
    }
}

export async function deleteUserAddressService(userId: string, addressId: string){
    const checkAddress = await DatabaseManager.checkExistingAddress(addressId);

    if(checkAddress == 0){
        return returnServicePattern(null, true, false, 'Endereço não encontrado');
    }

    const returnDbAddressDeletionStatus = await DatabaseManager.deleteUserAddress(userId, addressId);

    if(returnDbAddressDeletionStatus == null){
        return returnServicePattern(null, true, false, 'Não foi possível deletar o endereço');
    }

    return returnServicePattern(null, false, true, 'Endereço deletado');
}