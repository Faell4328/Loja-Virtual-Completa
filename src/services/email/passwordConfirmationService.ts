import { whatsappReady } from "../../routes/admin";
import HashPassword from "../../security/hashPassword";
import returnServicePattern from "../returnServicePattern";
import DatabaseManager from "../system/databaseManagerService";
import sendMessageWhatappService from "../whatsapp/sendMessageWhatsappService";
import sendEmail from "./sendEmailPattern";

export default async function passwordConfirmationService(hash: string, newPassword: string){
    let user = await DatabaseManager.checkPasswordRecovery(hash);

    if(user === null){
        return returnServicePattern(null, true, false, 'Token inválido');
    }

    const { id, email, resetPasswordTokenExpirationDate } = user;

    if(resetPasswordTokenExpirationDate === null || resetPasswordTokenExpirationDate < new Date()){
        const recoveryHash:string = await DatabaseManager.passwordRecovery(email);
        sendEmail.sendEmailRecoveryPassword(email, recoveryHash);
        return returnServicePattern(null, true, false, 'Token espirado, foi enviado para seu email um novo link');
    }

    const hashNewPassword: string = await HashPassword.passwordHashGenerator(newPassword);
    await DatabaseManager.passwordRecoveryConfirmed(id, hashNewPassword);

    if(user.phone && whatsappReady){
        sendMessageWhatappService('55'+user.phone, `Olá ${user.name.split(' ')[0]}, sua senha foi alterada. Caso não sejá você solicite ajuda ao suporte`);
    }
    return returnServicePattern(null, false, true, 'Senha alterada');
}