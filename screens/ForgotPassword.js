import React, { useState } from 'react';
import { Keyboard, ActivityIndicator } from 'react-native';
import {
    InnerContainer,
    PageTitle,
    SubTitle,
    StyledFormArea,
    StyledButton,
    ButtonText,
    Line,
    ExtraText,
    TextLink,
    TextLinkContent,
    ExtraView,
    FundoApp,
} from './../components/general/styles';
import { Formik } from 'formik';
import KeyboardProperlyWorking from './../components/general/KeyboardProperlyWorking';
import { handleForgotPassword } from '../functions/ForgotPassword';

//input
import { Input } from '../components/general/Input';
import { LogoCustom } from '../components/general/LogoCustom';

import { useTheme } from '../components/ThemeContext';
import { formatCpf } from '../functions/general/Masks';

const ForgotPassword = ({ navigation }) => {
    const [hideTextPresentation, setHideTextPresentation] = useState(false);

    const { theme, themeColors } = useTheme();
            
    const colors = themeColors[theme];

    Keyboard.addListener('keyboardDidShow', () => {
        setHideTextPresentation(true);
    });
    Keyboard.addListener('keyboardDidHide', () => {
        setHideTextPresentation(false);
    });

    return (
        <KeyboardProperlyWorking>
            <FundoApp>
                <InnerContainer>
                    { !hideTextPresentation && 
                    <>
                        <LogoCustom bottom={false}/>
                    </>
                    }
                    <SubTitle color={colors.text}>Esqueceu sua senha?<SubTitle boldOnText={true}> Informe o dado abaixo</SubTitle></SubTitle>

                    <Formik
                        initialValues={{ login: '' }}
                        onSubmit={(values, { setSubmitting }) => {
                            setSubmitting(true);

                            setTimeout(() => { 
                                if(handleForgotPassword(values)){
                                    navigation.navigate("GetReceivedCode", {
                                        data: {}
                                    });
                                }
                                setSubmitting(false);
                            }, 2000)
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, isSubmitting, values }) => (
                            <StyledFormArea>
                                <Input
                                    label="Email"
                                    icon="user-large"
                                    placeholder="Informe seu Email"
                                    placeholderTextColor={colors.text}
                                    onChangeText={handleChange('login')}
                                    value={values.login}
                                />

                                {!isSubmitting && 
                                    <StyledButton onPress={handleSubmit} background={theme == "light" ? colors.mediumRed : colors.darkRed}>
                                        <ButtonText color={colors.white}>Solicitar Código</ButtonText>
                                    </StyledButton>
                                }

                                {isSubmitting && 
                                    <StyledButton disabled={true} background={theme == "light" ? colors.mediumRed : colors.darkRed}>
                                        <ActivityIndicator size="large" color={colors.white}/>
                                    </StyledButton>
                                }

                                <Line color={colors.text}/>

                                <ExtraView isReceiveCode={true}>
                                    <ExtraText color={colors.text}>Não era o que você estava procurando? </ExtraText>
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

export default ForgotPassword;