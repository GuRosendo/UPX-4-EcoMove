import React from 'react';
import { Cores } from '../../components/general/styles';

import { Image } from "react-native";

import { createDrawerNavigator } from '@react-navigation/drawer'; 

import InitialPage from "../../screens/logged/InitialPage";

import { DrawerContent } from './DrawerContent';

const Drawer = createDrawerNavigator(); 

import { useTheme } from '../ThemeContext';
import { Text } from 'react-native-paper';

export const DrawerLayout = () => {
    const { theme, themeColors } = useTheme();

    const colors = themeColors[theme];

    return (
        <Drawer.Navigator
            screenOptions={{
                drawerStyle: {
                    backgroundColor: colors.background,
                },
                
                headerTintColor: colors.text,
                headerTransparent: false,
                headerTitle: '',

                headerRight: () => (
                    <Text style={{color: colors.text, marginRight: 10, fontSize: 18}}>EcoMove</Text>
                ),

                headerStyle: {
                    backgroundColor: colors.background,         
                    elevation: 0,  
                    shadowOpacity: 0,  
                    borderBottomWidth: 0,        
                },
            }}
            initialRouteName="InitialPage"

            drawerContent={props => <DrawerContent {...props} />}
        >
            <Drawer.Screen
                name="InitialPage"
                component={InitialPage}
                options={{
                drawerLabel: "Início",
                headerTitle: "",
                }}
            />
            <Drawer.Screen
                name="Sair"
                component={InitialPage}
                options={{
                drawerLabel: "Sair",
                headerTitle: "",
                }}
            />
        </Drawer.Navigator>
    );
};
