import returnServicePattern from "../returnServicePattern";
import DatabaseManager from "../system/databaseManagerService";
import sendEmail from "./sendEmailPattern";

export default async function checkTokenPasswordRecoveryService(hash: string){
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
  
  return returnServicePattern(null, true, false, null);
}