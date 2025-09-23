import React, { useContext, useEffect, useState } from "react";

import { StyleSheet, Switch } from "react-native";

import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";

import { Drawer, Text }from "react-native-paper";

import { useNavigation } from "@react-navigation/native";

import { FontAwesome6 } from '@expo/vector-icons';

import { LoginDataContext } from '../../components/LoginDataContext';

import { 
    ContainerMenu,
    DrawerContentInfos,
    UserInfoSection,
    UserInfosArea,
    UserInfos,
    UserName,
    NavigationText,
    AdditionalInfo,
    AvatarUser,
    DrawerViewItems
} from "../general/styles";

import { formatCpf } from "../../functions/general/Masks";

import { ModalCustom } from "../general/ModalCustom";

import { useTheme } from "../ThemeContext";

export const DrawerContent = (props) => {
    const { theme, toggleTheme, themeColors } = useTheme(); // Pegando a função de toggleTheme

    const colors = themeColors[theme];

    const navigation = useNavigation();

    const [profilePhoto, setProfilePhoto] = useState(false);

    const [isModalVisible, setModalVisible] = useState(false);

    const tamanhoIcones = 20;

    const { storedData, setStoredData } = useContext(LoginDataContext);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const [isEnabled, setIsEnabled] = useState();

    const toggleSwitch = () => {
        setIsEnabled(!isEnabled);
        toggleTheme();
    };

    useEffect(() => {
        setIsEnabled(theme == "dark");
    }, [])

    return (
        <>
        <ModalCustom 
            isModalVisible={isModalVisible}
            toggleModal={toggleModal}
            setStoredData={setStoredData}
            storedData={storedData}
            isExit={true}
        />

        <ContainerMenu>
            <DrawerContentScrollView {...props}>
                <DrawerContentInfos>
                    <UserInfoSection>
                        <UserInfosArea>

                            {profilePhoto ? (
                                <Text>Foto de perfil</Text>
                            ) : (
                                <FontAwesome6
                                    name="user-circle"
                                    color={colors.text}
                                    size={45}
                                />
                            )}

                            <UserInfos>
                                <UserName color={colors.text}>User Bonito</UserName>
                                <AdditionalInfo color={colors.text}>Email: userEmail@gmail.com</AdditionalInfo>
                            </UserInfos>
                            
                        </UserInfosArea>
                    </UserInfoSection>

                    <Drawer.Section title={<NavigationText color={colors.text}>Início</NavigationText>} style={styles.drawerSection}>
                        <DrawerItem
                            icon={({}) => (
                                <FontAwesome6
                                    name="house-chimney"
                                    color={colors.darkRed}
                                    size={tamanhoIcones}
                                />
                            )}
                            label="Início"
                            labelStyle={{ color: colors.text }}
                            onPress={() => { 
                                navigation.navigate('InitialPage') 
                            }}
                        />
                    </Drawer.Section>

                    <Drawer.Section title={<NavigationText color={colors.text}>Tema</NavigationText>}>
                        <DrawerViewItems>
                            <DrawerItem
                                style={{flex: 1, marginHorizontal: 10}}
                                label={"Modo escuro"}
                                labelStyle={{ color: colors.text }}
                                onPress={() => {toggleSwitch()}}
                                icon={({  }) => (
                                    <FontAwesome6 name={"moon"} size={20} color={colors.darkRed} />
                                )}
                            />

                            <Switch
                                trackColor={{ false: colors.grey, true: colors.white }}
                                thumbColor={isEnabled ? colors.mediumRed : colors.card}
                                onValueChange={toggleSwitch}
                                value={isEnabled}
                                style={{marginHorizontal: 10}}
                            />
                        </DrawerViewItems>
                    </Drawer.Section>

                </DrawerContentInfos>
            </DrawerContentScrollView>

            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    icon={({}) => (
                        <FontAwesome6
                            name="arrow-right-from-bracket"
                            color={colors.darkRed}
                            size={tamanhoIcones}
                        />
                    )}
                    label="Sair"
                    labelStyle={{ color: colors.text }}
                    onPress={toggleModal}
                />
            </Drawer.Section>
        </ContainerMenu>
        </>
    )
}

const styles = StyleSheet.create({
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderBottom: 1,
    },
})