import { whatsappReady } from "../../routes/admin";
import HashPassword from "../../security/hashPassword";
import returnServicePattern from "../returnServicePattern";
import DatabaseManager from "../system/databaseManagerService";
import sendMessageWhatappService from "../whatsapp/sendMessageWhatsappService";

export async function changePasswordService(userId: string, loginToken: string, newPassword: string){
   let returnDbUserToken = await DatabaseManager.consultByLoginToken(loginToken);

    if(returnDbUserToken === null){
        return returnServicePattern(null, true, false, 'Erro ao alterar a senha');
    }

    const { name, phone, role } = returnDbUserToken.user;

    const hashNewPassword: string = await HashPassword.passwordHashGenerator(newPassword);
    await DatabaseManager.passwordRecoveryConfirmed(userId, hashNewPassword);

    if(phone && whatsappReady && role == "ADMIN"){
        sendMessageWhatappService('55'+phone, `Olá ${name.split(' ')[0]}, sua senha foi alterada. Caso não sejá você solicite ajuda ao suporte`);
    }
    return returnServicePattern(null, false, true, 'Senha alterada');
}