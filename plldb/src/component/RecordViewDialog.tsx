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
		confirmDialog.open(`???????????????`, null, () => {
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
				alertSnackbar.open('success', '??????');
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
				{props.type == 'comment' && '????????????'}
				{props.type == 'correct' && '????????????'}
			</MuiDialogTitle>
			<MuiDialogContent dividers>
				<MuiBox>
					<MuiTypography variant='subtitle2' color='textSecondary'>
						{props.type == 'comment' &&
							<div>
								?????????????????????????????????????????????????????????????????????????????????????????????CP?????????
								<br />
								????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
							</div>
						}
						{props.type == 'correct' &&
							<div>
								????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
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
								label='??????'
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
									??????????????????????????????
								</MuiTypography>
								<MuiBox ml={0.5}>
									<MuiTooltip title='????????????????????????????????????????????????????????????????????????????????????'>
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
					??????
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
		confirmDialog.open(`???????????????`, null, () => {
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
				alertSnackbar.open('success', `??????`);
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
			<MuiDialogTitle>????????????</MuiDialogTitle>
			<MuiDialogContent dividers>
				<MuiBox>
					<MuiTypography variant='subtitle2' color='textSecondary'>
						???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
						<br />
						???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
						<br />
						?????????????????????????????????????????????????????????????????????????????????
					</MuiTypography>
				</MuiBox>
				<MuiBox mt={1}>
					<MuiGrid container spacing={1} alignItems='flex-end'>
						<MuiGrid item>
							<MuiLabelIcon />
						</MuiGrid>
						<MuiGrid item>
							<MuiFormControl>
								<MuiInputLabel>??????</MuiInputLabel>
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
									`...???????????????N(??????)`,
								],
									data.value.determination == null ? [
										`??????`,
										`??????`,
										`????????????`,
										`????????? ??? ?????????`,
									] : [],
									data.value.determination == RecordDetermination.Pure ? [
										`??????`,
									] : [],
									data.value.determination == RecordDetermination.IndeterminateNearPure || data.value.determination == RecordDetermination.Indeterminate ? [
										`??????`,
										`????????????`,
										`????????? ??? ?????????`,
									] : [],
									data.value.determination == RecordDetermination.IndeterminateNearDirty ? [
										`?????????????????????`,
										`?????????????????????`,
										`?????????????????????`,
									] : [],
									data.value.determination == RecordDetermination.Dirty ? [
										`???????????????`,
										`???????????????`,
										`???????????????`,
									] : [],
									data.value.determination == RecordDetermination.Argue ? [
										`??????`,
										`??????????????????`,
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
										label='??????'
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
					??????
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
		confirmDialog.open(`???????????????`, null, () => {
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
				alertSnackbar.open('success', `??????`);
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
			<MuiDialogTitle>????????????</MuiDialogTitle>
			<MuiDialogContent dividers style={{ height: '66vh', overflow: 'hidden scroll' }}>
				<MuiTypography variant='subtitle2' color='textSecondary' gutterBottom>
					????????????????????????????????????????????????????????????????????????????????????
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
					??????
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
			<MuiDialogTitle>????????????</MuiDialogTitle>
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
								??????
							</MuiButton>
						</MuiBox>
					}
					{user.user != null && user.user.checker &&
						<MuiBox mr={1} flexShrink={0}>
							<MuiButton variant='contained' color='secondary'
								onClick={checkingDialog.open}
							>
								??????
							</MuiButton>
						</MuiBox>
					}
					<MuiBox flexGrow={1} />
					{user.user != null && user.user.checker &&
						<MuiBox ml={1} flexShrink={0}>
							<MuiButton variant='outlined' color='secondary'
								onClick={appendCorrectDialog.open}
							>
								??????
							</MuiButton>
						</MuiBox>
					}
					{user.user != null &&
						<MuiBox ml={1} flexShrink={0}>
							<MuiButton variant='outlined' color='primary'
								onClick={appendCommentDialog.open}
							>
								??????
							</MuiButton>
						</MuiBox>
					}
					{user.user == null &&
						<MuiBox ml={1} flexShrink={0}>
							<MuiButton variant='outlined' disabled>
								????????????????????????
							</MuiButton>
						</MuiBox>
					}
					<MuiBox ml={1} flexShrink={0}>
						<MuiButton variant='text' color='primary'
							onClick={getPicture}
						>
							????????????
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