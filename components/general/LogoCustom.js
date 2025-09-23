import { ImagesRow, PageTitle } from './styles';

import { useTheme } from '../ThemeContext';

export const LogoCustom = ({...props}) => {
    const { theme, themeColors } = useTheme();

    const colors = themeColors[theme];

    return(
        <>
            <ImagesRow bottom={props.bottom}>
                <PageTitle color={colors.text}>Logo</PageTitle>
            </ImagesRow>
        </>
    );
}