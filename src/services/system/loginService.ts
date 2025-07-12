import { whatsappReady } from "../../routes/admin";
import HashPassword from "../../security/hashPassword";
import DatabaseManager from "./databaseManagerService";
import sendMessageWhatappService from "../whatsapp/sendMessageWhatsappService";
import returnServicePattern from "../returnServicePattern";

export default async function loginService(email: string, password: string){
    let returnConsult = await DatabaseManager.consultByEmail(email);

    if(!returnConsult){
        return returnServicePattern(null, true, false, 'Email ou senha incorreto');
    }

    const { emailConfirmationToken, password: hashPassword } = returnConsult;
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
    
    if(returnConsult?.phone && whatsappReady && returnConsult?.role == "ADMIN"){
        sendMessageWhatappService('55'+returnConsult.phone, `Ola ${returnConsult.name.split(' ')[0]}, alguém realizou login em sua conta, caso não seja você, entre em contato com o suporte`);
    }

    const { name, phone, role, token, tokenExpirationDate: expiration } = returnLogin;

    return returnServicePattern(null, false, true, { name, email, phone, role, token, expiration });
}