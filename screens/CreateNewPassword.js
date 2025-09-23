import React, { useState } from 'react';
import { Keyboard, ActivityIndicator } from 'react-native';
import {
    InnerContainer,
    SubTitle,
    StyledFormArea,
    StyledButton,
    ButtonText,
    Cores,
    Line,
    TextLink,
    TextLinkContent,
    ExtraView,
    FundoApp,
} from './../components/general/styles';
import { Formik } from 'formik';
import KeyboardProperlyWorking from './../components/general/KeyboardProperlyWorking';

import { handleCreateNewPassword } from '../functions/CreateNewPassword';

import { useTheme } from '../components/ThemeContext';

const { preto, secundaria } = Cores;

//input
import { Input } from '../components/general/Input';
import { LogoCustom } from '../components/general/LogoCustom';

const CreateNewPassword = ({ navigation, route }) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [hideRepeatPassword, setHideRepeatPassword] = useState(true);
    const [hideTextPresentation, setHideTextPresentation] = useState(false);

    Keyboard.addListener('keyboardDidShow', () => {
        setHideTextPresentation(true);
    });
    Keyboard.addListener('keyboardDidHide', () => {
        setHideTextPresentation(false);
    });   

    const { theme, themeColors } = useTheme();
                    
    const colors = themeColors[theme];

    return (
        <KeyboardProperlyWorking>
            <FundoApp>
                <InnerContainer>
                    {!hideTextPresentation && 
                    <>
                        <LogoCustom bottom={false}/>
                        </>
                    }

                    <SubTitle color={colors.text}>Crie sua nova senha de no<SubTitle boldOnText={true}> mínimo 8 dígitos!</SubTitle></SubTitle>

                    <Formik
                        initialValues={{ password: '', repeatedPassword: '' }}
                        onSubmit={(values, { setSubmitting }) => {
                            setSubmitting(true);

                            setTimeout(() => { 
                                if(handleCreateNewPassword(values)){
                                    navigation.navigate("Login");
                                }

                                setSubmitting(false);
                            }, 2000);
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, isSubmitting, values }) => (
                            <StyledFormArea>
                                <Input
                                    label="Digite sua nova senha"
                                    icon="user-lock"
                                    placeholder="Informe sua nova senha"
                                    placeholderTextColor={colors.text}
                                    onChangeText={handleChange('password')}
                                    value={values.password}
                                    secureTextEntry={hideRepeatPassword}
                                    isPassword={true}
                                    hidePassword={hideRepeatPassword}
                                    setHidePassword={setHideRepeatPassword}
                                />

                                <Input
                                    label="Repita sua nova senha"
                                    icon="user-lock"
                                    placeholder="Informe novamente sua nova senha"
                                    placeholderTextColor={colors.text}
                                    onChangeText={handleChange('repeatedPassword')}
                                    value={values.repeatedPassword}
                                    secureTextEntry={hidePassword}
                                    isPassword={true}
                                    hidePassword={hidePassword}
                                    setHidePassword={setHidePassword}
                                />
                                {!isSubmitting && 
                                    <StyledButton onPress={handleSubmit} background={theme == "light" ? colors.mediumRed : colors.darkRed}>
                                        <ButtonText color={colors.white}>Salvar</ButtonText>
                                    </StyledButton>
                                }

                                {isSubmitting && 
                                    <StyledButton disabled={true} background={theme == "light" ? colors.mediumRed : colors.darkRed}>
                                        <ActivityIndicator size="large" color={colors.white}/>
                                    </StyledButton>
                                }

                                <Line />

                                <ExtraView>
                                    <TextLink onPress={() => navigation.goBack()}>
                                        <TextLinkContent color={colors.text}>Voltar</TextLinkContent>
                                    </TextLink>
                                </ExtraView>
                            </StyledFormArea>
                        )}
                    </Formik>
                </InnerContainer>
            </FundoApp>
        </KeyboardProperlyWorking>
    );
};

export default CreateNewPassword;