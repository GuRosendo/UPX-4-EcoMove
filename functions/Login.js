import{ handleMessage } from "../components/general/ToastMessage";

//login
export const handleLogin = (credentials) =>{
    let result = { success: true, status: 'Sucesso', message: 'Login correto' };

    if(credentials.login == "" || credentials.password == ''){
        handleMessage(false, "Ocorreu um erro", "Preencha todos os campos");
        return false;
    }

    if(credentials.login.length < 8 || !credentials.login.includes('@') || !credentials.login.includes('.')){
        handleMessage(false, "Ocorreu um erro", "Email ou senha incorreto(s)");
        return false;
    }

    if(credentials.password.length < 8){
        handleMessage(false, "Ocorreu um erro", "Email ou senha incorreto(s)");
        return false;
    }

    if(result.success){
        return true;
    }
};