import React, { useState, useRef, useEffect } from 'react';
import { Keyboard, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import {
    InnerContainer,
    SubTitle,
    StyledFormArea,
    Line,
    ExtraText,
    TextLink,
    TextLinkContent,
    ExtraView,
    FundoApp,
    StyledButton,
    ButtonText
} from './../components/general/styles';

import KeyboardProperlyWorking from './../components/general/KeyboardProperlyWorking';

import { Input } from '../components/general/Input';

import { moveToPreviousInput, handleTextChange } from '../functions/general/SquareInput';

import { handleValidateCode } from '../functions/GetReceivedCode';

import { LogoCustom } from '../components/general/LogoCustom';

import { useTheme } from '../components/ThemeContext';

const GetReceivedCode = ({route, navigation }) => {
    const { theme, themeColors } = useTheme();
                
    const colors = themeColors[theme];
    
    const secondsOfWaiting = 30;
    const [timer, setTimer] = useState(0);
    const [showButton, setShowButton] = useState(true); // Initially visible

    const [isSubmitting, setIsSubmiting] = useState(false);

    const intervalRef = useRef(null);

    useEffect(() => {
        if (timer > 0) {
            intervalRef.current = setInterval(() => {
                setTimer(prevTime => prevTime - 1);
            }, 1000);
            setShowButton(false);
        } else {
            setShowButton(true);
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [timer]);

    const numberInputs = 6;

    const [hideTextPresentation, setHideTextPresentation] = useState(false);
    const [code, setCode] = useState(new Array(numberInputs).fill(''));

    const inputs = useRef([]);

    const formikRef = useRef();

    const [focusedIndex, setFocusedIndex] = useState(null);

    Keyboard.addListener('keyboardDidShow', () => {
        setHideTextPresentation(true);
    });

    Keyboard.addListener('keyboardDidHide', () => {
        setHideTextPresentation(false);
    });
    
    useEffect(() => {
        const handler = setTimeout(() => {
            const completeCode = code.join('');
    
            if(completeCode.length == numberInputs){
                formikRef.current.handleSubmit();
            }
        }, 500);
    
        return () => {
            clearTimeout(handler);
        };

    }, [code]);

    const handleRequestNewCode = () => {
        setTimer(secondsOfWaiting);
    };

    return (
        <KeyboardProperlyWorking>
            <FundoApp>
                <InnerContainer>
                    {!hideTextPresentation && (
                        <LogoCustom bottom={false}/>
                    )}

                    <SubTitle color={colors.text}>Código enviado para o Email informado</SubTitle>

                    {!showButton && (
                            <SubTitle color={colors.text}>Aguarde <SubTitle boldOnText={true}>({timer})</SubTitle> segundos para pedir um novo código!</SubTitle>
                    )}

                    <Formik
                        innerRef={formikRef}
                        initialValues={{ code: '' }}
                        onSubmit={(credentials, { }) => {
                            credentials = { 
                                ...credentials, 
                                code: code,
                                temporaryToken: route.params.data.token
                            };

                            setIsSubmiting(true);

                            if(isSubmitting){
                                return;
                            }

                            setTimeout(() => {
                                if(handleValidateCode(credentials, numberInputs, {registerNewDevice: route.params.registerNewDevice})){
                                    navigation.navigate("CreateNewPassword");
                                }
                                
                                setIsSubmiting(false);
                            }, 2000);
                        }}
                    >
                        {({ handleSubmit }) => {
                            return (
                                <StyledFormArea isReceiveCode={true}>
                                    {/* Render x inputs */}
                                    {[...Array(numberInputs)].map((_, index) => (
                                        <Input
                                            key={index}
                                            isSquare={true}
                                            squarePosition={index + 1}
                                            keyboardType="numeric"
                                            ref={(reference) => inputs.current[index] = reference} 
                                            value={code[index]}
                                            onChangeText={(text) => handleTextChange(text, numberInputs, index, inputs, code, setCode)} 
                                            onFocus={() => {
                                                setFocusedIndex(index);
                                                
                                                setCode(prevCode => {
                                                    const newCode = [...prevCode];
                                                    newCode[index] = ''; 
                                                    return newCode;
                                                });
                                            }}
                                            onBlur={() => {
                                                setFocusedIndex(null); 
                                            }}
                                            onKeyPress={({ nativeEvent }) => {
                                                if(nativeEvent.key == 'Backspace'){
                                                    if(index == numberInputs - 1){
                                                        if(code[index] != ''){
                                                            const newCode = [...code];
                                                            newCode[index] = '';
                                                            setCode(newCode);
                                                        }else if(index > 0){
                                                            moveToPreviousInput(index, inputs);
                                                        }
                                                    }else{
                                                        if(code[index] == '' && index > 0){
                                                            moveToPreviousInput(index, inputs);
                                                        }
                                                    }
                                                }
                                            }}
                                            style={{
                                                borderColor: focusedIndex == index ? colors.mediumRed : colors.transparent, 
                                                borderWidth: 2, 
                                            }}
                                        />
                                    ))}

                                    <SubTitle isReceiveCode={true} color={colors.text}> - </SubTitle>

                                    {(showButton && !isSubmitting) && (
                                        <ExtraView isReceiveCode={true}>
                                            <StyledButton isReceiveCode={true} onPress={handleRequestNewCode} background={theme == "light" ? colors.mediumRed : colors.darkRed}>
                                                <ButtonText color={colors.white}>Requisitar Código</ButtonText>
                                            </StyledButton>
                                        </ExtraView>
                                    )}

                                    {(showButton && isSubmitting) && (
                                        <ExtraView isReceiveCode={true}>
                                            <StyledButton disabled={true} isReceiveCode={true} background={theme == "light" ? colors.mediumRed : colors.darkRed}>
                                                <ActivityIndicator size="large" color={colors.white}/>
                                            </StyledButton>
                                        </ExtraView>
                                    )}

                                    {(isSubmitting && !showButton) && (
                                        <ExtraView isReceiveCode={true}>
                                            <ActivityIndicator size="large" color={colors.white}/>
                                        </ExtraView>
                                    )}

                                    <Line color={colors.text}/>

                                    <ExtraView>
                                        <ExtraText color={colors.text}>Não era o que você estava procurando? </ExtraText>
                                        <TextLink onPress={() => navigation.goBack()}>
                                            <TextLinkContent color={colors.text}>Voltar</TextLinkContent>
                                        </TextLink>
                                    </ExtraView>
                                </StyledFormArea>
                            );
                        }}
                    </Formik>
                </InnerContainer>
            </FundoApp>
        </KeyboardProperlyWorking>
    );
};

export default GetReceivedCode;