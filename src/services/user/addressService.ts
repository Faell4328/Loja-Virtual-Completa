import returnServicePattern from "../returnServicePattern";
import DatabaseManager from "../system/databaseManagerService";

export async function createAddressService(userId: string, name: string, street: string, number: string, neighborhood: string, zipCode: string, city: string, state: string, complement: string){
    const addressQuantity = await DatabaseManager.consultAddressQuantity(userId);

    if(addressQuantity >= 10){
        return returnServicePattern(null, true, false, 'Limite de endereços atingido. Remova os que não usa mais para continuar.');
    }

    const returnDbStatusUpdateUserInformation = await DatabaseManager.createAddress(userId, name, street, number, neighborhood, zipCode, state, city, complement);

    if(returnDbStatusUpdateUserInformation == true){
        return returnServicePattern(null, false, true, 'Endereço cadastrado');
    }
    else{
        return returnServicePattern(null, true, false, 'Não foi possível cadastrar o endereço');
    }
}

export async function updateAddressService(userId: string, addressId: string, name: string, street: string, number: string, neighborhood: string, zipCode: string, city: string, state: string, complement: string){
    const returnDbStatusUpdateUserInformation = await DatabaseManager.updateAddress(userId, addressId, name, street, number, neighborhood, zipCode, state, city, complement);

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