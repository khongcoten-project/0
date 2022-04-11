import React, { useCallback, useContext, useMemo } from 'react';

import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiDivider from '@mui/material/Divider';
import MuiGrid from '@mui/material/Grid';
import MuiTooltip from '@mui/material/Tooltip';
import MuiDialog from '@mui/material/Dialog';
import MuiDialogTitle from '@mui/material/DialogTitle';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogActions from '@mui/material/DialogActions';
import MuiButton from '@mui/material/Button';
import MuiFormLabel from '@mui/material/FormLabel';
import MuiFormControl from '@mui/material/FormControl';
import MuiFormControlLabel from '@mui/material/FormControlLabel';
import MuiTextField from '@mui/material/TextField';
import MuiCheckbox from '@mui/material/Checkbox';
import MuiInputLabel from '@mui/material/InputLabel';
import MuiSelect from '@mui/material/Select';
import MuiMenuItem from '@mui/material/MenuItem';
import MuiIconButton from '@mui/material/IconButton';
import MuiAutocomplete from '@mui/material/Autocomplete';
import MuiMessageIcon from '@mui/icons-material/Message';
import MuiHelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MuiLabelIcon from '@mui/icons-material/Label';

import { RecordView } from './RecordView';

import {
	getNameOfRecordDetermination,
	getNameOfRecordDeterminationMaybeUnknown,
	isLikeDirtyRecordDetermination,
	RawRecord,
	Record,
	RecordDetermination,
	setOfRecordDetermination
} from '../model/Record';
import { useValue, useBoolean, useFormData, useOpenLogic } from '../common/utility/Hook';
import { ajax } from '../util/Util';

import { AlertSnackbarContext } from './common/AlertSnackbar';
import { ProgressBackdropContext } from './common/ProgressBackdrop';
import { ConfirmDialogContext } from './common/ConfirmDialog';
import { UserContext } from './context/UserContext';
import { RecordEditor } from './RecordEditor';
import html2canvas from 'html2canvas';
import { useTheme } from '@mui/material/styles';

function AppendMessageDialog(props: {
	open: boolean;
	onClose: () => void;
	id: string;
	type: 'comment' | 'correct';
	updateData: (data: Record) => void;
}) {
	const data = useFormData({
		message: '',
		disgustful: false
	});
	const alertSnackbar = useContext(AlertSnackbarContext);
	const progressBackdrop = useContext(ProgressBackdropContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const submit = useCallback(() => {
		confirmDialog.open(`确定提交？`, null, () => {
			progressBackdrop.open();
			ajax('servlet/Record', 'appendMessage', {
				id: props.id,
				...data.ref.current!,
				type: props.type,
			}).then((resp) => {
				progressBackdrop.close();
				if (resp.data.status != undefined) {
					alertSnackbar.open('error', resp.data.status);
					return;
				}
				alertSnackbar.open('success', '成功');
				props.updateData(resp.data.data.record);
				props.onClose();
				data.reset();
			}).catch((error) => {
				progressBackdrop.close();
				alertSnackbar.open('error', JSON.stringify(error));
			});
		});
	}, [props.onClose, props.id, data.ref]);
	return (
		<MuiDialog
			maxWidth='sm' fullWidth
			open={props.open}
			onClose={props.onClose}
		>
			<MuiDialogTitle>
				{props.type == 'comment' && '发表评论'}
				{props.type == 'correct' && '发表修正'}
			</MuiDialogTitle>
			<MuiDialogContent dividers>
				<MuiBox>
					<MuiTypography variant='subtitle2' color='textSecondary'>
						{props.type == 'comment' &&
							<div>
								你可以对该记录进行评论，以对该作品进行补充说明（排雷、配角、副CP、等）
								<br />
								如果你对记录中的“依据”或“介绍”内容有异议，请点击“申请修正”提交你的修正信息
							</div>
						}
						{props.type == 'correct' &&
							<div>
								当记录中记录者给出的作者名、出版站点、依据、介绍等信息存在客观谬误时，可以添加修正性评论，必要时还需修改审核判定
							</div>
						}
					</MuiTypography>
				</MuiBox>
				<MuiBox mt={1}>
					<MuiGrid container spacing={1} alignItems='flex-end'>
						<MuiGrid item>
							<MuiMessageIcon />
						</MuiGrid>
						<MuiGrid item xs>
							<MuiTextField
								variant='standard'
								fullWidth
								multiline
								label='信息'
								value={data.value.message}
								onChange={(event) => data.setItem('message', event.target.value)}
							/>
						</MuiGrid>
					</MuiGrid>
				</MuiBox>
				<MuiBox mt={1}>
					<MuiFormControlLabel
						control={
							<MuiCheckbox
								color='primary'
								checked={data.value.disgustful}
								onChange={(event, checked) => data.setItem('disgustful', checked)}
							/>
						}
						label={
							<MuiBox display='flex' alignItems='center'>
								<MuiTypography variant='body1'>
									本信息可能会令人不适
								</MuiTypography>
								<MuiBox ml={0.5}>
									<MuiTooltip title='勾选后，将默认隐藏此信息，只有当查看者主动点击时才会显示'>
										<MuiIconButton size='small'>
											<MuiHelpOutlineIcon />
										</MuiIconButton>
									</MuiTooltip>
								</MuiBox>
							</MuiBox>
						}
					/>
				</MuiBox>
			</MuiDialogContent>
			<MuiDialogActions>
				<MuiButton
					variant='outlined' color='primary'
					onClick={submit}
				>
					提交
				</MuiButton>
			</MuiDialogActions>
		</MuiDialog>
	);
}

function CheckingDialog(props: {
	open: boolean;
	onClose: () => void;
	id: string;
	updateData: (data: Record) => void;
}) {
	const data = useFormData({
		determination: null as RecordDetermination | null,
		message: ''
	});
	const alertSnackbar = useContext(AlertSnackbarContext);
	const progressBackdrop = useContext(ProgressBackdropContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const submit = useCallback(() => {
		confirmDialog.open(`确定提交？`, null, () => {
			progressBackdrop.open();
			ajax('servlet/Record', 'appendCheck', {
				id: props.id,
				...data.ref.current!,
			}).then((resp) => {
				progressBackdrop.close();
				if (resp.data.status != undefined) {
					alertSnackbar.open('error', resp.data.status);
					return;
				}
				alertSnackbar.open('success', `成功`);
				props.updateData(resp.data.data.record);
				props.onClose();
				data.reset();
			}).catch((error) => {
				progressBackdrop.close();
				alertSnackbar.open('error', JSON.stringify(error));
			});
		});
	}, [props.onClose, props.id, data.ref]);
	return (
		<MuiDialog
			maxWidth='sm' fullWidth
			open={props.open}
			onClose={props.onClose}
		>
			<MuiDialogTitle>审核记录</MuiDialogTitle>
			<MuiDialogContent dividers>
				<MuiBox>
					<MuiTypography variant='subtitle2' color='textSecondary'>
						审核前请务必熟悉双洁定义规范与记录须知，当记录者给出的依据不充分时，不应予以通过，而应判为“未知”
						<br />
						若因记录内容有错误而予以否定时，判定理由内不应填写具体理由，应将具体理由作为修正信息，再在判定理由中填写“根据修正第？条”
						<br />
						如果错误地对记录进行了审核操作，请联系站长删除审核记录
					</MuiTypography>
				</MuiBox>
				<MuiBox mt={1}>
					<MuiGrid container spacing={1} alignItems='flex-end'>
						<MuiGrid item>
							<MuiLabelIcon />
						</MuiGrid>
						<MuiGrid item>
							<MuiFormControl>
								<MuiInputLabel>判定</MuiInputLabel>
								<MuiSelect
									value={data.value.determination || 0}
									onChange={(event, child) => data.setItem('determination', event.target.value == 0 ? null : event.target.value as number as RecordDetermination)}
									style={{ width: '96px' }}
								>
									<MuiMenuItem value={0}><em>{getNameOfRecordDeterminationMaybeUnknown(null)}</em></MuiMenuItem>
									{setOfRecordDetermination.map((value) => (
										<MuiMenuItem key={value} value={value}>{getNameOfRecordDetermination(value)}</MuiMenuItem>
									))}
								</MuiSelect>
							</MuiFormControl>
						</MuiGrid>
					</MuiGrid>
				</MuiBox>
				<MuiBox>
					<MuiGrid container spacing={1} alignItems='flex-end'>
						<MuiGrid item>
							<MuiMessageIcon />
						</MuiGrid>
						<MuiGrid item xs>
							<MuiAutocomplete
								freeSolo
								disableClearable
								options={([] as string[]).concat([
									`...；根据修正N(序号)`,
								],
									data.value.determination == null ? [
										`通过`,
										`存疑`,
										`依据不足`,
										`未给出 ？ 的依据`,
									] : [],
									data.value.determination == RecordDetermination.Pure ? [
										`通过`,
									] : [],
									data.value.determination == RecordDetermination.IndeterminateNearPure || data.value.determination == RecordDetermination.Indeterminate ? [
										`通过`,
										`依据不足`,
										`未给出 ？ 的依据`,
									] : [],
									data.value.determination == RecordDetermination.IndeterminateNearDirty ? [
										`？身心默认非洁`,
										`？身体默认非洁`,
										`？感情默认非洁`,
									] : [],
									data.value.determination == RecordDetermination.Dirty ? [
										`？身心非洁`,
										`？身体非洁`,
										`？感情非洁`,
									] : [],
									data.value.determination == RecordDetermination.Argue ? [
										`通过`,
										`存在争议：？`,
									] : []
								)}
								inputValue={data.value.message}
								onInputChange={(event, value) => data.setItem('message', value)}
								renderInput={(params) => (
									<MuiTextField
										{...params}
										variant='standard'
										fullWidth
										multiline
										label='理由'
										InputProps={{ ...params.InputProps }}
									/>
								)}
							/>
						</MuiGrid>
					</MuiGrid>
				</MuiBox>
			</MuiDialogContent>
			<MuiDialogActions>
				<MuiButton variant='outlined' color='primary' onClick={submit}>
					提交
				</MuiButton>
			</MuiDialogActions>
		</MuiDialog>
	);
}

function UpdateRecordDialog(props: {
	open: boolean;
	onClose: () => void;
	id: string;
	dataProto: Record;
	updateData: (data: Record) => void;
}) {
	const data = useValue(props.dataProto as RawRecord);
	const alertSnackbar = useContext(AlertSnackbarContext);
	const progressBackdrop = useContext(ProgressBackdropContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const submit = useCallback(() => {
		confirmDialog.open(`确定提交？`, null, () => {
			progressBackdrop.open();
			ajax('servlet/Record', 'update', {
				id: props.id,
				data: {
					description: data.ref.current!.description,
					name: data.ref.current!.name,
					author: data.ref.current!.author,
					sexual: data.ref.current!.sexual,
					source: data.ref.current!.source,
					determination: data.ref.current!.determination,
					reason: data.ref.current!.determination != null ? data.ref.current!.reason : [],
					introduction: (data.ref.current!.determination == null || !isLikeDirtyRecordDetermination(data.ref.current!.determination)) ? data.ref.current!.introduction : [],
				},
			}).then((resp) => {
				progressBackdrop.close();
				if (resp.data.status != undefined) {
					alertSnackbar.open('error', resp.data.status);
					return;
				}
				alertSnackbar.open('success', `成功`);
				props.updateData({ ...props.dataProto, ...data.ref.current! } as any as Record);
				props.onClose();
			}).catch((error) => {
				progressBackdrop.close();
				alertSnackbar.open('error', JSON.stringify(error));
			});
		});
	}, []);
	return (
		<MuiDialog
			maxWidth='lg' fullWidth
			open={props.open}
			onClose={props.onClose}
		>
			<MuiDialogTitle>更新记录</MuiDialogTitle>
			<MuiDialogContent dividers style={{ height: '66vh', overflow: 'hidden scroll' }}>
				<MuiTypography variant='subtitle2' color='textSecondary' gutterBottom>
					更新记录后，记录将变回未审核状态，需要审核员再次进行审核
				</MuiTypography>
				<RecordEditor
					data={data.value}
					updateData={data.setValue}
				/>
			</MuiDialogContent>
			<MuiDialogActions>
				<MuiButton
					variant='outlined' color='primary'
					onClick={submit}
				>
					更新
				</MuiButton>
			</MuiDialogActions>
		</MuiDialog>
	);
}

function RecordViewDialog(props: {
	open: boolean;
	onClose: () => void;
	onExited: () => void;
	data: Record;
	updateData: (data: Record) => void;
}) {
	const user = useContext(UserContext);
	const theme = useTheme();
	const appendCommentDialog = useOpenLogic(false);
	const appendCorrectDialog = useOpenLogic(false);
	const checkingDialog = useOpenLogic(false);
	const updateRecordDialog = useOpenLogic(false);
	const getPicture = useCallback(() => {
		const view = document.querySelector('#record-content-shell > *')! as HTMLElement;
		const viewClone = view.cloneNode(true) as HTMLElement;
		viewClone.querySelectorAll(':scope>*:not(.renderable-when-screenshot)').forEach((e) => {
			e.remove();
		});

		const shell = document.createElement('div');
		shell.style.width = '480px';
		shell.style.height = 'auto';
		shell.style.padding = '16px 24px';
		shell.appendChild(viewClone);
		(document.querySelector('#root > *') as HTMLElement).appendChild(shell);

		const height = window.getComputedStyle(shell).height;
		shell.style.height = `calc(${height} + 64px)`;

		html2canvas(shell, { scale: 2, backgroundColor: theme.palette.background.paper }).then((canvas) => {
			const imgData = canvas.toDataURL();
			let link = document.createElement('a');
			link.href = imgData;
			link.download = `${props.data.name}${props.data.author == null ? '' : ` - ${props.data.author}`}.png`;
			link.click();
			shell.remove();
		});
	}, []);
	return (
		<MuiDialog
			maxWidth='md' fullWidth
			open={props.open}
			onClose={props.onClose}
			TransitionProps={{
				onExited: props.onExited
			}}
		>
			<MuiDialogTitle>记录详情</MuiDialogTitle>
			<MuiDialogContent dividers
				style={{ height: '66vh' }}
				id='record-content-shell'
			>
				<RecordView data={props.data} />
			</MuiDialogContent>
			<MuiDialogActions>
				<MuiBox display='flex' flexWrap='wrap' width='100%'>
					{user.user != null && (user.user.id == props.data.submitter || user.user.editor) &&
						<MuiBox mr={1} flexShrink={0}>
							<MuiButton variant='contained' color='primary'
								onClick={updateRecordDialog.open}
							>
								更新
							</MuiButton>
						</MuiBox>
					}
					{user.user != null && user.user.checker &&
						<MuiBox mr={1} flexShrink={0}>
							<MuiButton variant='contained' color='secondary'
								onClick={checkingDialog.open}
							>
								审核
							</MuiButton>
						</MuiBox>
					}
					<MuiBox flexGrow={1} />
					{user.user != null && user.user.checker &&
						<MuiBox ml={1} flexShrink={0}>
							<MuiButton variant='outlined' color='secondary'
								onClick={appendCorrectDialog.open}
							>
								修正
							</MuiButton>
						</MuiBox>
					}
					{user.user != null &&
						<MuiBox ml={1} flexShrink={0}>
							<MuiButton variant='outlined' color='primary'
								onClick={appendCommentDialog.open}
							>
								评论
							</MuiButton>
						</MuiBox>
					}
					{user.user == null &&
						<MuiBox ml={1} flexShrink={0}>
							<MuiButton variant='outlined' disabled>
								登录后可进行评论
							</MuiButton>
						</MuiBox>
					}
					<MuiBox ml={1} flexShrink={0}>
						<MuiButton variant='text' color='primary'
							onClick={getPicture}
						>
							生成图片
						</MuiButton>
					</MuiBox>
				</MuiBox>
				<AppendMessageDialog
					open={appendCommentDialog.state}
					onClose={appendCommentDialog.close}
					type='comment'
					id={props.data.id}
					updateData={props.updateData}
				/>
				{user.user != null && user.user.checker &&
					<React.Fragment>
						<AppendMessageDialog
							open={appendCorrectDialog.state}
							onClose={appendCorrectDialog.close}
							type='correct'
							id={props.data.id}
							updateData={props.updateData}
						/>
						<CheckingDialog
							open={checkingDialog.state}
							onClose={checkingDialog.close}
							id={props.data.id}
							updateData={props.updateData}
						/>
					</React.Fragment>
				}
				{user.user != null && (user.user.id == props.data.submitter || user.user.editor) &&
					<React.Fragment>
						<UpdateRecordDialog key={props.data.date}
							open={updateRecordDialog.state}
							onClose={updateRecordDialog.close}
							id={props.data.id}
							dataProto={props.data}
							updateData={props.updateData}
						/>
					</React.Fragment>
				}
			</MuiDialogActions>
		</MuiDialog>
	);
}

export { RecordViewDialog };