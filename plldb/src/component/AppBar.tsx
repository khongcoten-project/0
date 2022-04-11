import { useCallback, useContext } from 'react';

import {
	Box as MuiBox,
	Typography as MuiTypography,
	AppBar as MuiAppBar,
	Toolbar as MuiToolbar,
	IconButton as MuiIconButton,
	MenuItem as MuiMenuItem,
	TextField as MuiTextField,
	InputAdornment as MuiInputAdornment,
} from '@mui/material';

import {
	Pages as MuiPagesIcon,
	AccountCircle as MuiAccountCircleIcon,
	FavoriteBorder as MuiFavoriteBorderIcon,
	Brightness4 as MuiBrightness4Icon,
	Brightness7 as MuiBrightness7Icon,
} from '@mui/icons-material';

import { MyThemeContext } from '../common/my-theme/Context';

import { AboutDialog } from './AboutDialog';
import { useOpenLogic } from '../common/utility/Hook';

import { UserContext } from './context/UserContext';
import { UserCenterDrawer } from './UserCenterDrawer';

import { SubpageType, getNameOfSubpageType, setOfSubpageType } from '../model/SubpageType';

function AppBar(props: {
	subpage: SubpageType,
	setSubpage: (subpage: SubpageType) => void;
}) {
	// myTheme
	const myTheme = useContext(MyThemeContext);
	// aboutDialog
	const aboutDialog = useOpenLogic(false);
	// userCenterDialog
	const userCenterDrawer = useOpenLogic(false);
	// user
	const user = useContext(UserContext);
	// setSubpage
	const setSubpage = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		props.setSubpage(event.target.value as unknown as SubpageType);
	}, [props.setSubpage]);
	// render
	return (
		<MuiAppBar
			position='relative'
			color={myTheme.value.palette.mode == 'light' ? 'primary' : 'default'}>
			<AboutDialog
				open={aboutDialog.state} onClose={aboutDialog.close} />
			<UserCenterDrawer
				open={userCenterDrawer.state}
				onClose={userCenterDrawer.close} />
			<MuiToolbar>
				<MuiIconButton
					color='secondary'
					onClick={aboutDialog.open}>
					<MuiFavoriteBorderIcon />
				</MuiIconButton>
				<MuiTypography
					variant='h6'
					sx={{ ml: 1 }}>
					双洁记录
				</MuiTypography>
				<MuiBox sx={{ flexGrow: 1 }} />
				<MuiTextField
					variant='standard'
					color='primary'
					select
					InputProps={{
						startAdornment: (
							<MuiInputAdornment position='start'>
								<MuiPagesIcon />
							</MuiInputAdornment>
						),
						classes: {
							underline: 'disable-select-underline'
						},
						sx: { color: 'inherit' }
					}}
					value={props.subpage}
					onChange={setSubpage}
				>
					{setOfSubpageType.map((value) => (
						<MuiMenuItem key={value} value={value}>{getNameOfSubpageType(value)}</MuiMenuItem>
					))}
				</MuiTextField>
				<MuiIconButton
					color='inherit'
					onClick={userCenterDrawer.open}
					sx={{ ml: 1, opacity: user.user == null ? myTheme.value.palette.action.disabledOpacity : undefined }}
				>
					<MuiAccountCircleIcon />
				</MuiIconButton>
				<MuiIconButton
					color='inherit'
					onClick={myTheme.toggleMode}
					sx={{ ml: 1 }}>
					{myTheme.value.palette.mode == 'light' ?
						<MuiBrightness7Icon />
						:
						<MuiBrightness4Icon />
					}
				</MuiIconButton>
			</MuiToolbar>
		</MuiAppBar>
	);
}

export { AppBar };