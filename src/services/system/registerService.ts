import DatabaseManager from './databaseManagerService';
import HashPassword from '../../security/hashPassword';
import sendEmail from '../email/sendEmailPattern';
import { whatsappReady } from '../../routes/admin';
import sendMessageWhatappService from '../whatsapp/sendMessageWhatsappService';
import returnServicePattern from '../returnServicePattern';

export default async function createUserService(name: string, email: string, phone: string, password: string){
    const emailExists = await DatabaseManager.consultByEmail(email);

    if(emailExists !== null) {
        return returnServicePattern(null, true, false, 'Email já existe');
    }

    let hashPassword:string = await HashPassword.passwordHashGenerator(password);
    await DatabaseManager.createUser(name, email, phone, hashPassword);

    let hashEmail = await DatabaseManager.createEmailToken(email);
    sendEmail.sendEmailConfirmationService(email, hashEmail);

    if(phone && whatsappReady){
        sendMessageWhatappService('55'+phone, `Sejá bem-vindo ${name.split(' ')[0]}, seu cadastro foi realizado com sucesso, é necessário que você acesse eu email e confirme seu email`);
    }
    
    return returnServicePattern('/confirmacao', false, true, 'Usuário cadastrado');
}