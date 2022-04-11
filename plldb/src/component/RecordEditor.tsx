import React, { useCallback } from 'react';

import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiDivider from '@mui/material/Divider';
import MuiGrid from '@mui/material/Grid';
import MuiIconButton from '@mui/material/IconButton';
import MuiMenuItem from '@mui/material/MenuItem';
import MuiFormControl from '@mui/material/FormControl';
import MuiFormControlLabel from '@mui/material/FormControlLabel';
import MuiTextField from '@mui/material/TextField';
import MuiInputLabel from '@mui/material/InputLabel';
import MuiSelect from '@mui/material/Select';
import MuiCheckbox from '@mui/material/Checkbox';
import MuiButton from '@mui/material/Button';
import MuiSnackbar from '@mui/material/Snackbar';
import MuiAutocomplete from '@mui/material/Autocomplete';
import MuiLabelIcon from '@mui/icons-material/Label';
import MuiFaceIcon from '@mui/icons-material/Face';
import MuiCheckIcon from '@mui/icons-material/Check';
import MuiRemoveIcon from '@mui/icons-material/Remove';
import MuiAddIcon from '@mui/icons-material/Add';
import MuiPeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import MuiKeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MuiKeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MuiBookIcon from '@mui/icons-material/Book';
import MuiMessageIcon from '@mui/icons-material/Message';
import MuiLocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';

import { InsetArea } from './common/InsetArea';

import {
	SexualOrientationCategory,
	RecordDetermination,
	isLikePureRecordDetermination,
	isLikeDirtyRecordDetermination,
	Record,
	RawRecord,
	RecordComment,
	setOfRecordDetermination,
	getNameOfRecordDetermination,
	setOfSexualOrientationCategory,
	getNameOfSexualOrientationCategory,
	RecordCommentWithInfo,
	getNameOfRecordDeterminationMaybeUnknown,
} from '../model/Record';
import { useFormData, useValue } from '../common/utility/Hook';

function RecordCommentEditor(props: {
	data: RecordComment;
	updateData: (value: RecordComment) => void;
}) {
	return (
		<MuiBox>
			<MuiBox>
				<MuiTextField
								variant='standard'
					fullWidth
					multiline
					value={props.data.message}
					onChange={(event) => props.updateData({ ...props.data, message: event.target.value })}
				/>
			</MuiBox>
			<MuiBox>
				<MuiFormControlLabel
					control={
						<MuiCheckbox
							color='primary'
							checked={props.data.disgustful}
							onChange={(event, checked) => props.updateData({ ...props.data, disgustful: checked })}
						/>
					}
					label='可能令人不适'
				/>
			</MuiBox>
			{/* {props.data.picture != null &&
				<React.Fragment>
					<MuiBox mt={1} display='flex' flexWrap='wrap' justifyContent='space-evenly'>
						{props.data.picture.map((value, index) => (
							<AsyncLoadImage key={index} url={value} />
						))}
					</MuiBox>
				</React.Fragment>
			} */}
		</MuiBox>
	);
}

function RecordCommentEditorWithIndex(props: {
	index: number;
	data: RecordComment;
	updateData: (value: RecordComment) => void;
	removeData: () => void;
}) {
	return (
		<MuiBox display='flex'>
			<MuiBox>
				<MuiBox display='flex' alignItems='center'>
					<MuiBox>
						<MuiIconButton size='small' onClick={props.removeData}>
							<MuiRemoveIcon />
						</MuiIconButton>
					</MuiBox>
					<MuiBox flexGrow={1} />
					<MuiBox ml={1}>
						<MuiTypography variant='subtitle2'>
							{`${props.index + 1}.`}
						</MuiTypography>
					</MuiBox>
				</MuiBox>
			</MuiBox>
			<MuiBox ml={1} width='0' flexGrow={1}>
				<RecordCommentEditor data={props.data} updateData={props.updateData} />
			</MuiBox>
		</MuiBox>
	);
}

function RecordCommentEditorList(props: {
	data: RecordComment[];
	updateData: (value: RecordComment[]) => void;
}) {
	const appendItem = useCallback(() => {
		let newData = props.data;
		newData.push({
			message: '',
			disgustful: false,
		});
		props.updateData(newData);
	}, [props]);
	return (
		<MuiBox>
			{props.data.map((value, index) => (
				<React.Fragment key={index}>
					<RecordCommentEditorWithIndex
						index={index}
						data={value}
						updateData={(value: RecordComment) => {
							let newList = props.data;
							newList[index] = value;
							props.updateData(newList);
						}}
						removeData={() => {
							let newList = props.data;
							newList.splice(index, 1);
							props.updateData(newList);
						}}
					/>
					<MuiBox my={1}>
						<MuiDivider />
					</MuiBox>
				</React.Fragment>
			))}
			<MuiIconButton size='small' onClick={appendItem}>
				<MuiAddIcon />
			</MuiIconButton>
		</MuiBox>
	);
}

function RecordEditor(props: {
	data: RawRecord;
	updateData: (data: RawRecord) => void;
}) {
	const updateItem = useCallback((key: keyof RawRecord, value: any) => {
		props.updateData({ ...props.data, [key]: value });
	}, [props.data, props.updateData]);
	const updateReason = useCallback((value: RecordComment[]) => {
		props.updateData({ ...props.data, reason: value });
	}, [props.data, props.updateData]);
	const updateIntroduction = useCallback((value: RecordComment[]) => {
		props.updateData({ ...props.data, introduction: value });
	}, [props.data, props.updateData]);
	return (
		<MuiBox>
			<MuiBox mt={1}>
				<InsetArea title='基本信息'>
					<MuiGrid container spacing={3} alignItems='flex-end'>
						<MuiGrid item xs={12}>
							<MuiGrid container spacing={1} alignItems='flex-end'>
								<MuiGrid item>
									<MuiMessageIcon />
								</MuiGrid>
								<MuiGrid item xs>
									<MuiTextField
								variant='standard'
										fullWidth
										label='备注（选填）'
										value={props.data.description || ''}
										onChange={(event) => updateItem('description', event.target.value == '' ? null : event.target.value)}
									/>
								</MuiGrid>
							</MuiGrid>
						</MuiGrid>
						<MuiGrid item>
							<MuiGrid container spacing={1} alignItems='flex-end'>
								<MuiGrid item>
									<MuiBookIcon />
								</MuiGrid>
								<MuiGrid item>
									<MuiTextField
								variant='standard'
										label='作品'
										value={props.data.name || ''}
										onChange={(event) => updateItem('name', event.target.value == '' ? null : event.target.value)}
									/>
								</MuiGrid>
							</MuiGrid>
						</MuiGrid>
						<MuiGrid item>
							<MuiGrid container spacing={1} alignItems='flex-end'>
								<MuiGrid item>
									<MuiFaceIcon />
								</MuiGrid>
								<MuiGrid item>
									<MuiTextField
								variant='standard'
										label='作者（选填）'
										value={props.data.author || ''}
										onChange={(event) => updateItem('author', event.target.value == '' ? null : event.target.value)}
									/>
								</MuiGrid>
							</MuiGrid>
						</MuiGrid>
						<MuiGrid item>
							<MuiGrid container spacing={1} alignItems='flex-end'>
								<MuiGrid item>
									<MuiPeopleOutlineIcon />
								</MuiGrid>
								<MuiGrid item>
									<MuiFormControl>
										<MuiInputLabel>性向</MuiInputLabel>
										<MuiSelect
								variant='standard'
											value={props.data.sexual || ''}
											onChange={(event, child) => updateItem('sexual', event.target.value)}
											style={{ width: '84px' }}
										>
											{setOfSexualOrientationCategory.map((value) => (
												<MuiMenuItem key={value} value={value}>{getNameOfSexualOrientationCategory(value)}</MuiMenuItem>
											))}
										</MuiSelect>
									</MuiFormControl>
								</MuiGrid>
							</MuiGrid>
						</MuiGrid>
						<MuiGrid item>
							<MuiGrid container spacing={1} alignItems='flex-end'>
								<MuiGrid item>
									<MuiLocalPrintshopIcon />
								</MuiGrid>
								<MuiGrid item>
									<MuiAutocomplete
										freeSolo
										options={[
											`晋江`,
											`长佩`,
											`海棠`,
											`POPO`,
											`废文`,
											`书耽`,
											`连城`,
											`米国度`,
										]}
										inputValue={props.data.source || ''}
										onInputChange={(event, value, reason) => reason != 'reset' && updateItem('source', value == '' ? null : value)}
										renderInput={(params) => (
											<MuiTextField
												{...params}
												variant='standard'
												label='出版站点（选填）'
												InputProps={{ ...params.InputProps }}
												style={{ width: '140px' }}
											/>
										)}
									/>
								</MuiGrid>
							</MuiGrid>
						</MuiGrid>
					</MuiGrid>
				</InsetArea>
			</MuiBox>
			<MuiBox mt={2}>
				<InsetArea title='详情'>
					<MuiGrid container spacing={4} alignItems='flex-end'>
						<MuiGrid item>
							<MuiGrid container spacing={1} alignItems='flex-end'>
								<MuiGrid item>
									<MuiLabelIcon />
								</MuiGrid>
								<MuiGrid item>
									<MuiFormControl>
										<MuiInputLabel>判定</MuiInputLabel>
										<MuiSelect
								variant='standard'
											value={props.data.determination || 0}
											onChange={(event, child) => updateItem('determination', event.target.value == 0 ? null : event.target.value as number as RecordDetermination)}
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
						</MuiGrid>
					</MuiGrid>
					{props.data.determination != null &&
						<MuiBox mt={1}>
							<InsetArea title='依据'>
								<RecordCommentEditorList
									data={props.data.reason}
									updateData={updateReason}
								/>
							</InsetArea>
						</MuiBox>
					}
					{(props.data.determination == null || !isLikeDirtyRecordDetermination(props.data.determination)) &&
						<MuiBox mt={1}>
							<InsetArea title='介绍'>
								<RecordCommentEditorList
									data={props.data.introduction}
									updateData={updateIntroduction}
								/>
							</InsetArea>
						</MuiBox>
					}
					<MuiBox mt={2} />
				</InsetArea>
			</MuiBox>
		</MuiBox>
	);
}

export { RecordEditor };