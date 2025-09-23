import React,{useState} from "react";
import { NavigationContainer } from '@react-navigation/native'; 
import { createStackNavigator } from "@react-navigation/stack";

import { FontAwesome6 } from "@expo/vector-icons";

import Login from "../screens/Login";
import RequestLogin from "../screens/RequestLogin";
import ForgotPassword from "../screens/ForgotPassword";
import GetReceivedCode from "../screens/GetReceivedCode";
import CreateNewPassword from "../screens/CreateNewPassword";

const Stack = createStackNavigator();

import { LoginDataContext } from "../components/LoginDataContext";

import { DrawerLayout } from "../components/logged/Drawer";

import { ModalCustom } from "../components/general/ModalCustom";

import { 
    MenuRightIcon,
    MenuLeftIcon,
    NavigationTitleText,
    NavigationText
} from "../components/general/styles";

import { useTheme } from "../components/ThemeContext";

const NavigationRootStack = () => {
    const { theme, themeColors } = useTheme();

    const colors = themeColors[theme];

    const [isModalVisible, setModalVisible] = useState(false);
    
    const [filterValues, setFilterValues] = useState("");

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    return (
        <>
            <ModalCustom 
                isModalVisible={isModalVisible}
                toggleModal={toggleModal}
                isHistoryModal={true}
                setFilterValues={setFilterValues}
            />

            <LoginDataContext.Consumer>
                {({storedData}) => (
                    <NavigationContainer> 
                        <Stack.Navigator
                            screenOptions={({ navigation }) => ({
                                headerStyle: {
                                    backgroundColor: colors.background,
                                },
                                headerTintColor: colors.text,
                                headerTransparent: true,
                                headerTitle: '',
                                headerLeftContainerStyle: {
                                    paddingLeft: 20,
                                },
                                headerLeft: () => (
                                    <MenuLeftIcon onPress={() => navigation.goBack()}>
                                        <FontAwesome6
                                            name="chevron-left"
                                            size={20}
                                            color={colors.text}
                                        />
                                    </MenuLeftIcon>
                                ),
                                headerStyle: {
                                    backgroundColor: themeColors[theme].background,         
                                    elevation: 0,  
                                    shadowOpacity: 0,  
                                    borderBottomWidth: 0,        
                                },
                                cardStyleInterpolator: ({ current, next, layouts }) => ({
                                    cardStyle: {
                                        transform: [
                                            {
                                                translateX: current.progress.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [layouts.screen.width, 0],
                                                }),
                                            },
                                        ],
                                    },
                                }),
                                transitionSpec: {
                                    open: {
                                        animation: 'timing',
                                        config: {
                                            duration: 300,
                                        },
                                    },
                                    close: {
                                        animation: 'timing',
                                        config: {
                                            duration: 300,
                                        },
                                    },
                                },
                            })}
                            initialRouteName="Login"
                        >
                        
                        {storedData ? (
                            <>
                                <Stack.Screen name="Drawer" component={DrawerLayout} options={{
                                    title: '',
                                    headerTransparent: true,
                                    headerShown: false,
                                }}/>
                            </>
                        ) : (
                            <>
                                <Stack.Screen name="Login" component={Login} options={{
                                    title: '',
                                    headerTransparent: true,
                                    headerShown: false,
                                }}/>
                                <Stack.Screen name="RequestLogin" component={RequestLogin} options={{
                                    title: '',
                                    headerTransparent: true,
                                    headerShown: false,
                                }}/>
                                <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{
                                    title: '',
                                    headerTransparent: true,
                                    headerShown: false,
                                }}/>
                                <Stack.Screen name="GetReceivedCode" component={GetReceivedCode} options={{
                                    title: '',
                                    headerTransparent: true,
                                    headerShown: false,
                                }}/>
                                <Stack.Screen name="CreateNewPassword" component={CreateNewPassword} options={{
                                    title: '',
                                    headerTransparent: true,
                                    headerShown: false,
                                }}/>
                            </>
                        )}
                        </Stack.Navigator>
                    </NavigationContainer>
                )}
            </LoginDataContext.Consumer>
        </>
    );
};

export default NavigationRootStack;
