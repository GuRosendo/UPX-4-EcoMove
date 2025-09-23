import {
    InnerContainer,
    FundoApp,
    PageTitle,
    SubTitle,
    PageInformation
} from './../../components/general/styles';

import KeyboardProperlyWorking from './../../components/general/KeyboardProperlyWorking';

import { LogoCustom } from '../../components/general/LogoCustom';

import { useTheme } from '../../components/ThemeContext';

const InitialPage = ({navigation}) => {
    const { theme, themeColors } = useTheme();

    const colors = themeColors[theme];

    return (
        <KeyboardProperlyWorking isScrollView={true}>
            <FundoApp>
                <InnerContainer paddingBottom={true}>
                    <PageInformation>
                        <PageTitle smallerText={true} color={colors.text}>Olá, </PageTitle>
                        <SubTitle boldOnText={true} welcome={true} color={colors.text}>User!</SubTitle>
                    </PageInformation>

                    <LogoCustom bottom={true} />
                </InnerContainer>
            </FundoApp>
        </KeyboardProperlyWorking>
    );
};

export default InitialPage;
