import React, { useCallback, useContext, useMemo } from 'react';

import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiTooltip from '@mui/material/Tooltip';
import MuiDivider from '@mui/material/Divider';
import MuiGrid from '@mui/material/Grid';
import MuiDrawer from '@mui/material/Drawer';
import MuiButton from '@mui/material/Button';
import MuiIconButton from '@mui/material/IconButton';
import MuiTabs from '@mui/material/Tabs';
import MuiTab from '@mui/material/Tab';
import MuiDialog from '@mui/material/Dialog';
import MuiDialogTitle from '@mui/material/DialogTitle';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogActions from '@mui/material/DialogActions';
import MuiTextField from '@mui/material/TextField';
import MuiCheckbox from '@mui/material/Checkbox';
import MuiFormControlLabel from '@mui/material/FormControlLabel';
import MuiList from '@mui/material/List';
import MuiListItem from '@mui/material/ListItem';
import MuiListItemIcon from '@mui/material/ListItemIcon';
import MuiListItemText from '@mui/material/ListItemText';
import MuiListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import MuiAddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import MuiAccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import MuiExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import MuiMailOutlinedIcon from '@mui/icons-material/MailOutlined';
import MuiEditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MuiTextsmsIcon from '@mui/icons-material/Textsms';
import MuiLockOpenIcon from '@mui/icons-material/LockOpen';
import MuiVpnKeyIcon from '@mui/icons-material/VpnKey';
import MuiMailIcon from '@mui/icons-material/Mail';
import MuiHelpOutlineIcon from '@mui/icons-material/HelpOutline';

import { UserContext } from './context/UserContext';
import { User } from '../model/User';
import { ajax } from '../util/Util';
import { useValue, useFormData, useOpenLogic } from '../common/utility/Hook';
import { ProgressBackdropContext } from './common/ProgressBackdrop';
import { AlertSnackbarContext } from './common/AlertSnackbar';

import { VerifyCodeBox } from './VerifyCodeBox';
import { ConfirmDialogContext } from './common/ConfirmDialog';

function RegisterDialog(props: {
	open: boolean;
	onClose: () => void;
}) {
	const data = useFormData({
		name: '',
		password: '',
		email: null as string | null,
		verifyCode: ''
	});
	const verifyCodeBoxStamp = useValue(0);
	const alertSnackbar = useContext(AlertSnackbarContext);
	const progressBackdrop = useContext(ProgressBackdropContext);
	const user = useContext(UserContext);
	const submit = useCallback(() => {
		progressBackdrop.open();
		ajax('servlet/User', 'register', {
			...data.ref.current!,
		}).then((resp) => {
			progressBackdrop.close();
			if (resp.data.status != undefined) {
				alertSnackbar.open('error', resp.data.status);
				verifyCodeBoxStamp.setValue(Date.now());
				return;
			}
			alertSnackbar.open('success', `注册成功`);
			user.setUser(resp.data.data.user);
			props.onClose();
			data.reset();
		}).catch((error) => {
			progressBackdrop.close();
			alertSnackbar.open('error', JSON.stringify(error));
		});
	}, []);
	return (
		<MuiDialog
			maxWidth='xs' fullWidth
			open={props.open}
			onClose={props.onClose}
		>
			<MuiDialogTitle>注册</MuiDialogTitle>
			<MuiDialogContent dividers>
				<MuiBox>
					<MuiBox>
						<MuiGrid container spacing={1} alignItems='flex-end'>
							<MuiGrid item>
								<MuiAccountCircleOutlinedIcon />
							</MuiGrid>
							<MuiGrid item xs>
								<MuiTextField
								variant='standard'
									fullWidth
									label='用户名'
									type='text'
									value={data.value.name}
									onChange={(event) => data.setItem('name', event.target.value)}
								/>
							</MuiGrid>
						</MuiGrid>
					</MuiBox>
					<MuiBox mt={1.5}>
						<MuiGrid container spacing={1} alignItems='flex-end'>
							<MuiGrid item>
								<MuiVpnKeyIcon />
							</MuiGrid>
							<MuiGrid item xs>
								<MuiTextField
								variant='standard'
									fullWidth
									label='密码'
									type='password'
									value={data.value.password}
									onChange={(event) => data.setItem('password', event.target.value)}
								/>
							</MuiGrid>
						</MuiGrid>
					</MuiBox>
					<MuiBox mt={1.5}>
						<MuiGrid container spacing={1} alignItems='flex-end'>
							<MuiGrid item>
								<MuiMailIcon />
							</MuiGrid>
							<MuiGrid item xs>
								<MuiTextField
								variant='standard'
									fullWidth
									label='邮箱（选填）'
									type='text'
									value={data.value.email || ''}
									onChange={(event) => data.setItem('email', event.target.value == '' ? null : event.target.value)}
								/>
							</MuiGrid>
							<MuiGrid item>
								<MuiTooltip title='邮箱用于接收系统消息'>
									<MuiIconButton>
										<MuiHelpOutlineIcon />
									</MuiIconButton>
								</MuiTooltip>
							</MuiGrid>
						</MuiGrid>
					</MuiBox>
					<MuiBox mt={1.5}>
						<MuiGrid container spacing={1} alignItems='flex-end'>
							<MuiGrid item>
								<MuiTextsmsIcon />
							</MuiGrid>
							<MuiGrid item xs>
								<MuiTextField
								variant='standard'
									fullWidth
									label='验证码'
									type='text'
									value={data.value.verifyCode}
									onChange={(event) => data.setItem('verifyCode', event.target.value)}
								/>
							</MuiGrid>
							<MuiGrid item>
								<VerifyCodeBox key={verifyCodeBoxStamp.value} />
							</MuiGrid>
						</MuiGrid>
					</MuiBox>
					<MuiBox mt={2} display='flex' flexDirection='row' justifyContent='center'>
						<MuiButton
							variant='contained' color='primary'
							onClick={submit}
						>
							注册
						</MuiButton>
					</MuiBox>
				</MuiBox>
			</MuiDialogContent>
			<MuiDialogActions>
				<MuiButton
					color='primary'
					onClick={props.onClose}
				>
					关闭
				</MuiButton>
			</MuiDialogActions>
		</MuiDialog>
	);
}

function LoginDialog(props: {
	open: boolean;
	onClose: () => void;
}) {
	const data = useFormData({
		name: '',
		password: ''
	});
	const alertSnackbar = useContext(AlertSnackbarContext);
	const progressBackdrop = useContext(ProgressBackdropContext);
	const user = useContext(UserContext);
	const submit = useCallback(() => {
		progressBackdrop.open();
		ajax('servlet/User', 'login', {
			...data.ref.current!,
		}).then((resp) => {
			progressBackdrop.close();
			if (resp.data.status != undefined) {
				alertSnackbar.open('error', resp.data.status);
				return;
			}
			alertSnackbar.open('success', `登入成功`);
			user.setUser(resp.data.data.user);
			props.onClose();
			data.reset();
		}).catch((error) => {
			progressBackdrop.close();
			alertSnackbar.open('error', JSON.stringify(error));
		});
	}, []);
	return (
		<MuiDialog
			maxWidth='xs' fullWidth
			open={props.open}
			onClose={props.onClose}
		>
			<MuiDialogTitle>登入</MuiDialogTitle>
			<MuiDialogContent dividers>
				<MuiBox>
					<MuiBox>
						<MuiGrid container spacing={1} alignItems='flex-end'>
							<MuiGrid item>
								<MuiAccountCircleOutlinedIcon />
							</MuiGrid>
							<MuiGrid item xs>
								<MuiTextField
								variant='standard'
									fullWidth
									label='用户名'
									type='text'
									value={data.value.name}
									onChange={(event) => data.setItem('name', event.target.value)}
								/>
							</MuiGrid>
						</MuiGrid>
					</MuiBox>
					<MuiBox my={1.5}>
						<MuiGrid container spacing={1} alignItems='flex-end'>
							<MuiGrid item>
								<MuiVpnKeyIcon />
							</MuiGrid>
							<MuiGrid item xs>
								<MuiTextField
								variant='standard'
									fullWidth
									label='密码'
									type='password'
									value={data.value.password}
									onChange={(event) => data.setItem('password', event.target.value)}
								/>
							</MuiGrid>
						</MuiGrid>
					</MuiBox>
					<MuiBox mt={2} display='flex' flexDirection='row' justifyContent='center'>
						<MuiButton
							variant='contained' color='primary'
							onClick={submit}
						>
							登入
						</MuiButton>
					</MuiBox>
				</MuiBox>
			</MuiDialogContent>
			<MuiDialogActions>
				<MuiButton
					color='primary'
					onClick={props.onClose}
				>
					关闭
				</MuiButton>
			</MuiDialogActions>
		</MuiDialog>
	);
}

function UpdatePasswordDialog(props: {
	open: boolean;
	onClose: () => void;
}) {
	const data = useFormData({
		password: '',
		newPassword: ''
	});
	const alertSnackbar = useContext(AlertSnackbarContext);
	const progressBackdrop = useContext(ProgressBackdropContext);
	const user = useContext(UserContext);
	const submit = useCallback(() => {
		progressBackdrop.open();
		ajax('servlet/User', 'updatePassword', {
			...data.ref.current!,
		}).then((resp) => {
			progressBackdrop.close();
			if (resp.data.status != undefined) {
				alertSnackbar.open('error', resp.data.status);
				return;
			}
			alertSnackbar.open('success', `重设成功`);
			user.setUser(resp.data.data.user);
			props.onClose();
			data.reset();
		}).catch((error) => {
			progressBackdrop.close();
			alertSnackbar.open('error', JSON.stringify(error));
		});
	}, []);
	return (
		<MuiDialog
			maxWidth='xs' fullWidth
			open={props.open}
			onClose={props.onClose}
		>
			<MuiDialogTitle>重设密码</MuiDialogTitle>
			<MuiDialogContent dividers>
				<MuiBox>
					<MuiBox>
						<MuiGrid container spacing={1} alignItems='flex-end'>
							<MuiGrid item>
								<MuiLockOpenIcon />
							</MuiGrid>
							<MuiGrid item xs>
								<MuiTextField
								variant='standard'
									fullWidth
									label='旧密码'
									type='text'
									value={data.value.password}
									onChange={(event) => data.setItem('password', event.target.value)}
								/>
							</MuiGrid>
						</MuiGrid>
					</MuiBox>
					<MuiBox mt={1.5}>
						<MuiGrid container spacing={1} alignItems='flex-end'>
							<MuiGrid item>
								<MuiVpnKeyIcon />
							</MuiGrid>
							<MuiGrid item xs>
								<MuiTextField
								variant='standard'
									fullWidth
									label='新密码'
									type='text'
									value={data.value.newPassword}
									onChange={(event) => data.setItem('newPassword', event.target.value)}
								/>
							</MuiGrid>
						</MuiGrid>
					</MuiBox>
					<MuiBox mt={2} display='flex' flexDirection='row' justifyContent='center'>
						<MuiButton
							variant='contained' color='primary'
							onClick={submit}
						>
							重设
						</MuiButton>
					</MuiBox>
				</MuiBox>
			</MuiDialogContent>
			<MuiDialogActions>
				<MuiButton
					color='primary'
					onClick={props.onClose}
				>
					关闭
				</MuiButton>
			</MuiDialogActions>
		</MuiDialog>
	);
}

function UpdateEmailDialog(props: {
	open: boolean;
	onClose: () => void;
}) {
	const data = useFormData({
		email: ''
	});
	const dataEnabled = useFormData({
		email: false
	});
	const alertSnackbar = useContext(AlertSnackbarContext);
	const progressBackdrop = useContext(ProgressBackdropContext);
	const user = useContext(UserContext);
	const submit = useCallback(() => {
		progressBackdrop.open();
		ajax('servlet/User', 'updateEmail', {
			...data.ref.current!,
			email: dataEnabled.ref.current!.email ? data.ref.current!.email : null,
		}).then((resp) => {
			progressBackdrop.close();
			if (resp.data.status != undefined) {
				alertSnackbar.open('error', resp.data.status);
				return;
			}
			alertSnackbar.open('success', `更新成功`);
			user.setUser(resp.data.data.user);
			props.onClose();
			data.reset();
			dataEnabled.reset();
		}).catch((error) => {
			progressBackdrop.close();
			alertSnackbar.open('error', JSON.stringify(error));
		});
	}, []);
	return (
		<MuiDialog
			maxWidth='xs' fullWidth
			open={props.open}
			onClose={props.onClose}
		>
			<MuiDialogTitle>更新邮箱</MuiDialogTitle>
			<MuiDialogContent dividers>
				<MuiBox>
					<MuiBox>
						<MuiFormControlLabel
							label='启用邮箱'
							control={
								<MuiCheckbox
									checked={dataEnabled.value.email}
									onChange={(event, checked) => dataEnabled.setItem('email', !dataEnabled.value.email)}
								/>
							}
						/>
					</MuiBox>
					<MuiBox mt={0.5}>
						<MuiGrid container spacing={1} alignItems='flex-end'>
							<MuiGrid item>
								<MuiMailOutlinedIcon color={dataEnabled.value.email ? 'action' : 'disabled'} />
							</MuiGrid>
							<MuiGrid item xs>
								<MuiTextField
								variant='standard'
									fullWidth
									label='邮箱'
									type='text'
									value={data.value.email}
									onChange={(event) => data.setItem('email', event.target.value)}
									disabled={!dataEnabled.value.email}
								/>
							</MuiGrid>
						</MuiGrid>
					</MuiBox>
					<MuiBox mt={2} display='flex' flexDirection='row' justifyContent='center'>
						<MuiButton
							variant='contained' color='primary'
							onClick={submit}
						>
							更新
						</MuiButton>
					</MuiBox>
				</MuiBox>
			</MuiDialogContent>
			<MuiDialogActions>
				<MuiButton
					color='primary'
					onClick={props.onClose}
				>
					关闭
				</MuiButton>
			</MuiDialogActions>
		</MuiDialog>
	);
}

function UserCenterDrawer(props: {
	open: boolean;
	onClose: () => void;
}) {
	const user = useContext(UserContext);
	const registerDialog = useOpenLogic(false);
	const loginDialog = useOpenLogic(false);
	const updatePasswordDialog = useOpenLogic(false);
	const updateEmailDialog = useOpenLogic(false);
	const alertSnackbar = useContext(AlertSnackbarContext);
	const progressBackdrop = useContext(ProgressBackdropContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const openLogoutDialog = useCallback(() => {
		confirmDialog.open('确定要登出吗？', null, () => {
			progressBackdrop.open();
			ajax('servlet/User', 'logout', {}).then((resp) => {
				progressBackdrop.close();
				if (resp.data.status != undefined) {
					alertSnackbar.open('error', resp.data.status);
					return;
				}
				alertSnackbar.open('success', `登出成功`);
				user.setUser(null);
			}).catch((error) => {
				progressBackdrop.close();
				alertSnackbar.open('error', JSON.stringify(error));
			});
		})
	}, []);
	return (
		<MuiDrawer anchor='bottom' open={props.open} onClose={props.onClose}>
			<RegisterDialog
				open={registerDialog.state}
				onClose={registerDialog.close}
			/>
			<LoginDialog
				open={loginDialog.state}
				onClose={loginDialog.close}
			/>
			<UpdatePasswordDialog
				open={updatePasswordDialog.state}
				onClose={updatePasswordDialog.close}
			/>
			<UpdateEmailDialog
				open={updateEmailDialog.state}
				onClose={updateEmailDialog.close}
			/>
			<MuiList>
				{user.user == null ?
					<React.Fragment>
						<MuiListItem>
							<MuiListItemText
								primary='为了便于数据库管理与回溯，“记录提交”与“修正申请”功能需要注册会员才可使用'
								secondary='本网站用爱发电，不收取任何费用，账号注册与使用均免费'
							/>
						</MuiListItem>
						<MuiDivider />
						<MuiListItem button onClick={registerDialog.open}>
							<MuiListItemIcon>
								<MuiAddCircleOutlineOutlinedIcon />
							</MuiListItemIcon>
							<MuiListItemText primary='注册' />
						</MuiListItem>
						<MuiListItem button onClick={loginDialog.open}>
							<MuiListItemIcon>
								<MuiAccountCircleOutlinedIcon color='primary' />
							</MuiListItemIcon>
							<MuiListItemText primary='登入' />
						</MuiListItem>
					</React.Fragment>
					:
					<React.Fragment>
						<MuiListItem>
							<MuiListItemIcon>
								<MuiAccountCircleOutlinedIcon />
							</MuiListItemIcon>
							<MuiListItemText
								primary={user.user.name}
								secondary={(user.user.editor || user.user.checker) ? `${user.user.editor ? '编辑员' : ''}${(user.user.editor && user.user.checker) ? ' ' : ''}${user.user.checker ? '审核员' : ''}` : undefined}
							/>
						</MuiListItem>
						<MuiListItem>
							<MuiListItemIcon>
								<MuiMailOutlinedIcon />
							</MuiListItemIcon>
							<MuiListItemText
								primary={user.user.email || '<未设置>'}
								secondary='设置通知邮箱后，当你提交的记录被审核、修正、评论时，会收到系统发出的通知邮件'
							/>
							<MuiListItemSecondaryAction>
								<MuiIconButton edge='end' onClick={updateEmailDialog.open}>
									<MuiEditOutlinedIcon />
								</MuiIconButton>
							</MuiListItemSecondaryAction>
						</MuiListItem>
						<MuiDivider />
						<MuiListItem button onClick={updatePasswordDialog.open}>
							<MuiListItemIcon>
								<MuiVpnKeyIcon />
							</MuiListItemIcon>
							<MuiListItemText primary='重设密码' />
						</MuiListItem>
						<MuiListItem button onClick={openLogoutDialog}>
							<MuiListItemIcon>
								<MuiExitToAppOutlinedIcon />
							</MuiListItemIcon>
							<MuiListItemText primary='登出' />
						</MuiListItem>
					</React.Fragment>
				}
			</MuiList>
		</MuiDrawer>
	);
}

export { UserCenterDrawer };