import React from "react";
import { KeyboardAvoidingView, Platform, View, ScrollView, TouchableWithoutFeedback, Keyboard, StyleSheet } from "react-native";

import { useTheme } from "../ThemeContext";

const KeyboardProperlyWorking = ({ children, isScrollView, isChat }) => {
    const { theme, themeColors } = useTheme();

    const colors = themeColors[theme];

    const keyboardVerticalOffset = Platform.OS == 'ios' ? 64 : 0;

    return (
        <KeyboardAvoidingView
            style={[styles.container, {backgroundColor: colors.background}]}
            behavior={Platform.OS == 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={keyboardVerticalOffset}
        >
            {isScrollView && (
                <ScrollView
                    contentContainerStyle={styles.containerContent}
                    keyboardShouldPersistTaps={'always'} 
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        {children}
                    </TouchableWithoutFeedback>
                </ScrollView>
            )}
            
            {!isScrollView && (
                <View
                    contentContainerStyle={styles.containerContent}
                    keyboardShouldPersistTaps={'always'} 
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        {children}
                    </TouchableWithoutFeedback>
                </View>
            )}

            {isChat && (
                <View
                    contentContainerStyle={styles.containerContentChat}
                    keyboardShouldPersistTaps={'always'} 
                >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    {children}
                </TouchableWithoutFeedback>
                </View>
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerContent: {
        flexGrow: 1,
    },
    containerContentChat: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 10,
    },
});

export default KeyboardProperlyWorking;
