import { createContext, useCallback, useLayoutEffect, useMemo } from 'react';

import { Theme, createTheme, PaletteMode } from '@mui/material';

import { useValue } from '../utility/Hook';

import Cookies from 'js-cookie';

interface MyThemeContextType {
	value: Theme;
	toggleMode: () => void;
}

const MyThemeContext = createContext<MyThemeContextType>({} as any);

function useMyTheme() {
	const mode = useValue(Cookies.get('theme.mode') as PaletteMode || 'dark');
	const toggleMode = useCallback(() => {
		const newMode = mode.ref.current! == 'light' ? 'dark' : 'light';
		mode.setValue(newMode);
		Cookies.set('theme.mode', newMode, { expires: 15 });
	}, []);
	const value = useMemo(() => {
		return createTheme({
			palette: {
				mode: mode.value,
				primary: {
					main: mode.value == 'light' ? '#6200ee' : '#bb86fc'
				},
				secondary: {
					main: '#03dac5'
				},
			},
			components: {
				MuiTypography: {
					defaultProps: {
						variantMapping: {
							h1: 'div',
							h2: 'div',
							h3: 'div',
							h4: 'div',
							h5: 'div',
							h6: 'div',
							subtitle1: 'div',
							subtitle2: 'div',
							body1: 'div',
							body2: 'div',
							caption: 'div',
							button: 'div',
							overline: 'div',
						}
					}
				}
			}
		});
	}, [mode.value]);
	useLayoutEffect(() => {
		document.body.className = `use-material-design-scrollbar use-material-design-scrollbar-${mode.value}`;
		document.body.style.backgroundColor = mode.value == 'light' ? value.palette.background.default : '#121212';
		document.body.style.color = value.palette.common[mode.value == 'light' ? 'black' : 'white'];
	}, [mode.value]);
	return {
		value,
		toggleMode,
	};
}

export { MyThemeContext, useMyTheme };