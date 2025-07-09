import { whatsappReady } from "../../routes/admin";
import returnServicePattern from "../returnServicePattern";
import DatabaseManager from "../system/databaseManagerService";
import sendMessageWhatappService from "../whatsapp/sendMessageWhatsappService";
import sendEmail from "./sendEmailPattern";

export default async function passwordRecoveryService(email: string){
    const returnConsult = await DatabaseManager.consultByEmail(email);

    if(returnConsult === null){
        return returnServicePattern(null, true, false, 'Esse email não está cadastrado');
    }

    if(returnConsult.phone && whatsappReady && returnConsult.role == "ADMIN"){
        sendMessageWhatappService('55'+returnConsult.phone, `Olá ${returnConsult.name.split(' ')[0]}, foi solicitado a redefinição de senha. Caso não sejá você solicite ajuda ao suporte`);
    }

    const recoveryHash:string = await DatabaseManager.passwordRecovery(email);

    sendEmail.sendEmailRecoveryPassword(email, recoveryHash);
    return returnServicePattern(null, false, true, `Foi enviado o link para redefinir a senha no seu email: ${email}`);
}