import { whatsappReady } from "../../routes/admin";
import HashPassword from "../../security/hashPassword";
import DatabaseManager from "./databaseManagerService";
import sendMessageWhatappService from "../whatsapp/sendMessageWhatsappService";
import returnServicePattern from "../returnServicePattern";

export default async function loginService(email: string, password: string){
    let returnDbUser = await DatabaseManager.consultByEmail(email);

    if(!returnDbUser){
        return returnServicePattern(null, true, false, 'Email ou senha incorreto');
    }

    const { name, emailConfirmationToken, password: hashPassword, phone, role, status } = returnDbUser;
    
    if(status == "BLOCKED"){
        return returnServicePattern(null, true, false, 'Sua conta está bloqueada. Entre em contato com o suporte para mais informações');
    }
    
    if(emailConfirmationToken){
        return returnServicePattern('/confirmacao', true, false, 'Confirme o email antes de fazer login');
    }

    let statusHashPassword = await HashPassword.checkHash(password, hashPassword);
    if(!statusHashPassword){
        return returnServicePattern(null, true, false, 'Email ou senha incorreto');
    }

    const returnLogin = await DatabaseManager.login(email, hashPassword);

    if(!returnLogin?.token || !returnLogin?.tokenExpirationDate){
        return returnServicePattern(null, true, false, 'Não foi possível fazer login, por favor, entre em contado com o suporte');
    }
    
    if(returnDbUser?.phone && whatsappReady && returnDbUser?.role == "ADMIN"){
        sendMessageWhatappService('55'+returnDbUser.phone, `Ola ${returnDbUser.name.split(' ')[0]}, alguém realizou login em sua conta, caso não seja você, entre em contato com o suporte`);
    }

    const { token, tokenExpirationDate: expiration } = returnLogin;

    return returnServicePattern(null, false, true, { name, email, phone, role, token, expiration });
}