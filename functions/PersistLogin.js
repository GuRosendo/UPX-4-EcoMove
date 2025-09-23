import AsyncStorage from '@react-native-async-storage/async-storage';

//Check Login
export const persistLogin = async (credentials, setStoredData) => {
    try{
        const updatedCredentials = { ...credentials, ocultarAnimacao: 0 };

        await AsyncStorage.setItem("userData", JSON.stringify(updatedCredentials));

        setStoredData(updatedCredentials);
    }catch (error){
        console.log("Ocorreu um erro ao salvar os dados no AsyncStorage, erro: " + error);

        handleMessage(false, "Ocorreu um erro", "Os dados de login não puderam ser salvos, tente novamente");
    }
};