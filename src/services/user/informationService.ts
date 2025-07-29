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
}