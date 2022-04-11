import React, { useEffect, useMemo, useCallback, useContext } from 'react';

import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiDivider from '@mui/material/Divider';
import MuiButton from '@mui/material/Button';
import MuiChip from '@mui/material/Chip';
import MuiTableRow from '@mui/material/TableRow';
import MuiCheckIcon from '@mui/icons-material/Check';
import MuiRemoveIcon from '@mui/icons-material/Remove';
import MuiCloseIcon from '@mui/icons-material/Close';
import MuiWarningIcon from '@mui/icons-material/Warning';
import MuiPagination from '@mui/material/Pagination';

import { ajax } from '../util/Util';
import { useValue, useOpenLogic, useOpenLogicWithData } from '../common/utility/Hook';
import { AlertSnackbarContext } from './common/AlertSnackbar';
import { ProgressBackdropContext } from './common/ProgressBackdrop';

import {
	RecordFindRule,
	isDeterminateRecordDetermination,
	isLikePureRecordDetermination,
	getNameOfRecordDetermination,
	getNameOfSexualOrientationCategory,
	Record,
	getRealDeterminationOfRecord,
	getNameOfRecordDeterminationMaybeUnknown,
	isCheckedOfRecord,
	isLikeDirtyRecordDetermination
} from '../model/Record'

import { RecordViewDialog } from './RecordViewDialog'
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

function RecordTableRow(props: {
	data: Record;
	updateData: (data: Record) => void;
}) {
	const realDetermination = getRealDeterminationOfRecord(props.data);
	const viewDialog = useOpenLogicWithData(false, {
		display: false
	});
	const viewDialogFragment = useMemo(() => {
		return (
			viewDialog.data.display &&
			<RecordViewDialog
				open={viewDialog.state}
				onClose={viewDialog.close}
				onExited={viewDialog.cleanData}
				data={props.data}
				updateData={props.updateData}
			/>
		);
	}, [props.data, props.updateData, viewDialog.state, viewDialog.data.display]);
	const theme = useTheme();
	return (
		<MuiTableRow hover component='div' style={{
			opacity: (realDetermination != null && isLikeDirtyRecordDetermination(realDetermination)) ? theme.palette.action.disabledOpacity : undefined
		}}>
			<MuiBox key='determination'>
				<MuiChip
					variant='outlined'
					color={(realDetermination != null && isLikePureRecordDetermination(realDetermination)) ? 'primary' : 'default'}
					icon={(realDetermination == null || isLikePureRecordDetermination(realDetermination)) ?
						(realDetermination != null && isDeterminateRecordDetermination(realDetermination)) ?
							<MuiCheckIcon />
							:
							<MuiRemoveIcon />
						:
						<MuiCloseIcon />
					}
					label={
						<MuiBox width='64px' textAlign='center'>
							{getNameOfRecordDeterminationMaybeUnknown(realDetermination)}
						</MuiBox>
					}
				/>
			</MuiBox>
			<MuiBox key='name' component='div'>
				<MuiTypography variant='body1'>
					{props.data.name}
				</MuiTypography>
			</MuiBox>
			<MuiBox key='author' component='div'>
				<MuiTypography variant='body1'>
					{props.data.author == null ? '<佚名>' : props.data.author}
				</MuiTypography>
			</MuiBox>
			<MuiBox key='sexual' component='div'>
				{getNameOfSexualOrientationCategory(props.data.sexual)}
			</MuiBox>
			<MuiBox key='detail' component='div'>
				<MuiButton variant='outlined' color='primary'
					onClick={() => viewDialog.openWithData({ display: true })}
				>
					查看详情
				</MuiButton>
			</MuiBox>
			<MuiBox key='space' component='div' />
			{viewDialogFragment}
		</MuiTableRow>
	);
}

interface RecordTablePageInfo {
	count: number;
	limitPerPage: number;
	page: number;
	data: Record[];
	stamp: number;
}

function RecordTable(props: {
	rule: RecordFindRule;
}) {
	// pageInfo
	const pageInfo = useValue<RecordTablePageInfo>({
		count: 0,
		limitPerPage: 10,
		page: 0,
		data: [] as Record[],
		stamp: 0,
	});
	// set pageInfo with newest stamp
	const setPage = useCallback((page: number) => {
		pageInfo.setValue({
			...pageInfo.ref.current!,
			page: page,
			stamp: Date.now()
		});
	}, [pageInfo.ref]);
	const setRowsPerPage = useCallback((rowsPerPage: number) => {
		pageInfo.setValue({
			...pageInfo.ref.current!,
			limitPerPage: rowsPerPage,
			page: Math.floor(pageInfo.ref.current!.page * pageInfo.ref.current!.limitPerPage / rowsPerPage),
			stamp: Date.now()
		});
	}, [pageInfo.ref]);
	const updateItem = useCallback((index: number, data: Record) => {
		let newData = [...pageInfo.ref.current!.data];
		newData[index] = data;
		pageInfo.setValue({ ...pageInfo.ref.current!, data: newData });
	}, []);
	// alertSnackbar
	const alertSnackbar = useContext(AlertSnackbarContext);
	// progressBackdrop
	const progressBackdrop = useContext(ProgressBackdropContext);
	// update, if rule is change
	useEffect(() => {
		pageInfo.setValue({
			...pageInfo.value,
			page: 0,
			stamp: Date.now()
		});
	}, [props.rule]);
	// update record by ajax, if stamp is change
	useEffect(() => {
		pageInfo.setValue({
			...pageInfo.ref.current!
		});
		progressBackdrop.open();
		ajax('servlet/Record', 'findByRule', {
			...props.rule,
			skip: pageInfo.value.limitPerPage * pageInfo.value.page,
			limit: pageInfo.value.limitPerPage,
		}).then((resp) => {
			progressBackdrop.close();
			if (resp.data.status != undefined) {
				alertSnackbar.open('error', resp.data.status);
				return;
			}
			pageInfo.setValue({
				...pageInfo.value,
				count: resp.data.data.count,
				data: resp.data.data.record
			});
		}).catch((error) => {
			progressBackdrop.close();
			alertSnackbar.open('error', JSON.stringify(error));
		});
	}, [pageInfo.value.stamp]);
	// update body content, if data or isUpdating is change
	const bodyContentFragment = useMemo(() => {
		return (
			pageInfo.value.count == 0 ?
				<MuiBox component='span' width='100%' height='100%' display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
					<MuiWarningIcon color='action' fontSize='large' />
					<MuiTypography variant='h6' color='textSecondary'>
						未搜索到任何记录，请尝试更改搜索条件
					</MuiTypography>
				</MuiBox>
				:
				<React.Fragment>
					{pageInfo.value.data.map((e, index) => (
						<RecordTableRow
							key={e.id}
							data={e}
							updateData={(data) => updateItem(index, data)}
						/>
					))}
				</React.Fragment>
		)
	}, [pageInfo.value.data]);
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down('sm'));
	
	// render
	return (
		<MuiBox width='100%' height='100%' display='flex' flexDirection='column'>
			<MuiBox width='100%' flexGrow={1} overflow='hidden' display='flex' flexDirection='column'
				sx={{
					color: theme.palette.text.primary,
					'&>*': {
						'&': {
							'&>div': {
								width: '100%',
								display: 'flex',
								flexWrap: 'wrap',
								borderBottom: `1px solid ${theme.palette.divider}`,
								'&>*': {
									padding: theme.spacing(2),
									display: 'flex',
									alignItems: 'center',
									flexShrink: 0,
									'&:nth-child(1)': {
										justifyContent: 'center',
										width: 160,
										flexGrow: 1
									},
									'&:nth-child(2)': {
										justifyContent: 'flex-start',
										width: 0,
										flexGrow: 5
									},
									'&:nth-child(3)': {
										justifyContent: 'flex-start',
										width: 0,
										flexGrow: 5
									},
									'&:nth-child(4)': {
										justifyContent: 'flex-start',
										width: 64,
										flexGrow: 1
									},
									'&:nth-child(5)': {
										justifyContent: 'center',
										width: 128,
										flexGrow: 1
									},
									'&:nth-child(6)': {
										width: !matches ? 0 : 'calc(100% - 64px)',
										margin: !matches ? 0 : '0 32px',
										padding: 0,
										backgroundColor: theme.palette.divider,
										order: matches ? 1 : undefined
									},
									'&:nth-child(1), &:nth-child(5)': {
										order: matches ? 2 : undefined
									}
								}
							}
						},
						'&:nth-child(1)': {
							'&>div': {
								'&>*': {
									'&:nth-child(1)': {
										padding: 0
									},
									'&:nth-child(5)': {
										padding: 0
									},
									'&:nth-child(6)': {
										height: 0,
									}
								}
							}
						},
						'&:nth-child(2)': {
							'&>div': {
								'&>*': {
									'&:nth-child(1)': {
										width: 160
									},
									'&:nth-child(5)': {
										width: 128
									},
									'&:nth-child(6)': {
										height: !matches ? 0 : 1
									},
								}
							}
						}
					}
				}}
			>
				<MuiBox flexShrink={0} overflow='hidden scroll'>
					<MuiTableRow component='div'>
						<MuiBox key='determination' component='div'>
						</MuiBox>
						<MuiBox key='name' component='div'>
							作品
						</MuiBox>
						<MuiBox key='author' component='div'>
							作者
						</MuiBox>
						<MuiBox key='sexual' component='div'>
							性向
						</MuiBox>
						<MuiBox key='detail' component='div'>
						</MuiBox>
						<MuiBox key='space' component='div'>
						</MuiBox>
					</MuiTableRow>
				</MuiBox>
				<MuiBox height='1px' flexShrink={0} flexGrow={1} overflow='hidden scroll'>
					{bodyContentFragment}
				</MuiBox>
			</MuiBox>
			<MuiBox width='100%'>
				<MuiDivider />
			</MuiBox>
			<MuiBox width='100%' mt={1} flexShrink={0} display='flex' alignItems='center'>
				<MuiBox>
					<MuiTypography variant='body2'>
						{`共 ${pageInfo.value.count} 条`}
					</MuiTypography>
				</MuiBox>
				<MuiBox flexGrow={100} />
				<MuiBox>
					<MuiPagination
						variant='outlined'
						color='primary'
						boundaryCount={1}
						siblingCount={0}
						count={Math.ceil(pageInfo.value.count / pageInfo.value.limitPerPage)}
						page={pageInfo.value.page + 1}
						onChange={(event, page) => setPage(page - 1)}
					/>
				</MuiBox>
			</MuiBox>
		</MuiBox>
	);
}

export { RecordTable };