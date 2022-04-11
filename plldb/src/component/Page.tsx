import '../common/style/global.css';

import './Page.css';

import React, { useMemo, useLayoutEffect } from 'react';

import MuiBox from '@mui/material/Box';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import { AppBar } from './AppBar';
import { AboutPage } from './AboutPage';
import { FindPage } from './FindPage';
import { CreatePage } from './CreatePage';

import { SubpageType } from '../model/SubpageType';

import { useBoolean, useValue } from '../common/utility/Hook';
import { ajax } from '../util/Util';
import Cookies from 'js-cookie';

import { User } from '../model/User';
import { UserContext } from './context/UserContext';

import { AlertSnackbarContext, useAlertSnackbar, AlertSnackbar } from './common/AlertSnackbar';
import { ProgressBackdropContext, useProgressBackdrop, ProgressBackdrop } from './common/ProgressBackdrop';
import { ConfirmDialogContext, useConfirmDialog, ConfirmDialog } from './common/ConfirmDialog';

import { MyThemeContext, useMyTheme } from '../common/my-theme/Context';
import '../common/my-theme/style.css';

function Page(props: {}) {
	// myTheme
	const myTheme = useMyTheme();
	// ready
	const ready = useBoolean(false);
	// user
	const user = useValue(null as User | null);
	// subpage
	const subpage = useValue(SubpageType.Find);
	// alertSnackbar
	const alertSnackbar = useAlertSnackbar(false, {
		type: 'info',
		text: ''
	});
	// progressBackdrop
	const progressBackdrop = useProgressBackdrop(true);
	// confirmDialog
	const confirmDialog = useConfirmDialog(false);
	// appBar fragment
	const appBarFragment = useMemo(() => {
		return (
			<AppBar
				subpage={subpage.value}
				setSubpage={subpage.setValue}
			/>
		);
	}, [subpage.value]);
	// subpage fragment
	const subpageFragment = useMemo(() => {
		switch (subpage.value) {
			default:
				return (<React.Fragment />);
			case SubpageType.About:
				return (<AboutPage />);
			case SubpageType.Find:
				return (<FindPage />);
			case SubpageType.Create:
				return (<CreatePage />);
		}
	}, [subpage.value]);
	// alertSnackbar fragment
	const alertSnackbarFragment = useMemo(() => {
		return (
			<AlertSnackbar
				display={alertSnackbar.message.display}
				state={alertSnackbar.state}
				message={alertSnackbar.message}
				onClose={alertSnackbar.close}
				onExited={alertSnackbar.cleanMessage}
			/>
		);
	}, [alertSnackbar.state, alertSnackbar.message]);
	// progressBackdrop fragment
	const progressBackdropFragment = useMemo(() => {
		return (
			<ProgressBackdrop
				state={progressBackdrop.state}
			/>
		);
	}, [progressBackdrop.state]);
	// confirmDialog fragment
	const confirmDialogFragment = useMemo(() => {
		return (
			<ConfirmDialog
				state={confirmDialog.state}
				onClose={confirmDialog.close}
				onExited={confirmDialog.cleanData}
				title={confirmDialog.data.title}
				content={confirmDialog.data.content}
				onConfirm={confirmDialog.data.onConfirm}
			/>
		);
	}, [confirmDialog.state, confirmDialog.data]);
	// render
	useLayoutEffect(() => {
		ajax('servlet/User', 'reLogin', {}).then((resp) => {
			progressBackdrop.close();
			ready.setTrue();
			if (resp.data.status != undefined) {
				alertSnackbar.openWithMessageSimplify('error', resp.data.status);
				return;
			}
			user.setValue(resp.data.data.user);
		}).catch((error) => {
			progressBackdrop.close();
			ready.setTrue();
			alertSnackbar.openWithMessageSimplify('error', JSON.stringify(error));
		});
	}, []);
	return (
		<MyThemeContext.Provider value={myTheme}>
			<MuiThemeProvider theme={myTheme.value}>
				<MuiBox sx={{
					position: 'absolute',
					width: 1, height: 1, overflow: 'hidden',
					display: 'flex', flexDirection: 'column',
				}}>
					<UserContext.Provider value={{
						user: user.value === undefined ? null : user.value,
						setUser: user.setValue
					}}>
						<AlertSnackbarContext.Provider value={{
							open: alertSnackbar.openWithMessageSimplify
						}}>
							<ProgressBackdropContext.Provider value={{
								open: progressBackdrop.open,
								close: progressBackdrop.close
							}}>
								<ConfirmDialogContext.Provider value={{
									open: confirmDialog.openSimplify,
									close: confirmDialog.close
								}}>
									{ready.value &&
										<React.Fragment>
											{appBarFragment}
											<MuiBox sx={{
												position: 'relative',
												width: 1, height: 0, flexGrow: 1, overflow: 'hidden',
											}}>
												<MuiBox sx={{
													position: 'absolute',
													width: 1, height: 1,
													px: 2, py: 1,
													display: 'flex', flexDirection: 'column',
												}}>
													{subpageFragment}
												</MuiBox>
											</MuiBox>
										</React.Fragment>
									}
									{alertSnackbarFragment}
									{progressBackdropFragment}
									{confirmDialogFragment}
								</ConfirmDialogContext.Provider>
							</ProgressBackdropContext.Provider>
						</AlertSnackbarContext.Provider>
					</UserContext.Provider>
				</MuiBox>
			</MuiThemeProvider>
		</MyThemeContext.Provider>
	);
}

export { Page };