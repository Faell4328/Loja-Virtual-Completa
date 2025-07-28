import returnServicePattern from "../returnServicePattern";
import DatabaseManager from "../system/databaseManagerService";

interface UsersProps{
    name: string;
    phone: string | null;
    email: string;
    role: string;
    status: string
}

function adjustRolePattern(role: string){
    switch(role){
        case 'ADMIN':
            return 'Administrador'
        default: 
            return 'Usuário'
    }
}

function adjustStatusPattern(status: string){
    switch(status){
        case 'PENDING_VALIDATION_EMAIL':
            return 'Pendente validação email'
        case 'OK':
            return 'Ok'
        default: 
            return 'Bloqueado'
    }
}

export async function listUsersService(){
    let returnDbUsers: boolean | UsersProps[] = await DatabaseManager.listUsers();

    if(returnDbUsers == null){
        returnServicePattern(null, true, false, 'Não foi possível listar os usuários');
    }

    returnDbUsers.forEach((user, index) => {
        returnDbUsers[index].status= adjustStatusPattern(user.status);
        returnDbUsers[index].role = adjustRolePattern(user.role);
    })

    return returnServicePattern(null, false, true, returnDbUsers);
}

export async function listSpecificUserService(userId: string){
    const returnDbInformationUser = await DatabaseManager.listInformationUser(userId);
    
    if(returnDbInformationUser == null){
        return returnServicePattern('/admin/usuarios', true, false, 'Usuário não encontrado');
    }
    
    let { id, name, email, phone, role, status } = returnDbInformationUser;
    const ajustedRole: string = adjustRolePattern(role);
    const ajustedStatus: string = adjustStatusPattern(status);
    
    const addressUserExisting = await DatabaseManager.checkExistingAddress(userId);
    let returnDbUserAddress = null;
    if(addressUserExisting){
        returnDbUserAddress = await DatabaseManager.listInformationAddress(userId);
        return returnServicePattern(null, false, true, { id, name, email, phone, role: ajustedRole, status: ajustedStatus, address: returnDbUserAddress });
    }

    return returnServicePattern(null, false, true, { id, name, email, phone, role: ajustedRole, status: ajustedStatus });
}