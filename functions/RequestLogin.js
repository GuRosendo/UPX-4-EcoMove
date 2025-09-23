import { handleMessage } from "../components/general/ToastMessage";
import { validateCellphone } from "./general/ValidateCellphone";
import { validateDate } from "./general/ValidateDate";

//request login
export const handleRequestLogin = (credentials) => {
    let result = { success: true, status: 'Sucesso ao criar conta', message: 'Use os dados informados para logar' }; //api request return

    //validate nome
    if(!credentials.nomeCompleto || credentials.nomeCompleto == '' || !isNaN(parseInt(credentials.nomeCompleto)) || !(credentials.nomeCompleto.split(' ')[1])){
        handleMessage(false, "Ocorreu um erro", "Nome incorreto");
        return false;
    }

    //validate sexo
    if(!credentials.sexo || credentials.sexo == ''){
        handleMessage(false, "Ocorreu um erro", "Sexo incorreto");
        return false;
    }

    //validate cellphone
    if(!validateCellphone(credentials.celular)){
        handleMessage(false, "Ocorreu um erro", "Número de celular incorreto");
        return false;
    }
    
    if(validateCellphone(credentials.celular)){
        const number = validateCellphone(credentials.celular);
    }

    //validate date of birth
    if(!validateDate(credentials.dataNascimento, false, false, false, true)){
        handleMessage(false, "Ocorreu um erro", "Data de nascimento inválida");
        return false;
    }

    //validate email
    if(!credentials.email || !credentials.email.includes('@') || !credentials.email.includes('.')){
        handleMessage(false, "Ocorreu um erro", "Email incorreto");
        return false;
    }

    //validate password
    if(!credentials.password || credentials.password.length < 8){
        handleMessage(false, "Ocorreu um erro", "Senha incorreta");
        return false;
    }

    //validate both passwords
    if(!credentials.repeatedPassword || credentials.repeatedPassword.length < 8 || credentials.password != credentials.repeatedPassword){
        handleMessage(false, "Ocorreu um erro", "As senhas não coincidem");
        return false;
    }

    //requisição api
    if(!result.success){
        handleMessage(result.success, result.status, result.message);
        return false;
    }
    
    if(result.success){
        handleMessage(result.success, result.status, result.message);
        return true;
    }
}