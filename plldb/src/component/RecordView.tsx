import React from 'react';

import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiDivider from '@mui/material/Divider';
import MuiTooltip from '@mui/material/Tooltip';
import MuiChip from '@mui/material/Chip';
import MuiLocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';

import { InsetArea } from './common/InsetArea';

import {
	isLikePureRecordDetermination,
	getNameOfRecordDetermination,
	getNameOfSexualOrientationCategory,
	Record,
	RecordComment,
	RecordCommentWithInfo,
	RecordCheckInfo,
	getRealDeterminationOfRecord,
	getNameOfRecordDeterminationMaybeUnknown,
	isCheckedOfRecord,
	isLikeDirtyRecordDetermination,
} from '../model/Record';
import { useBoolean } from '../common/utility/Hook';

function RecordMessageViewTemplate(props: {
	index: number;
	subtitle: string | null;
	message: string;
	disgustful: boolean;
	info: {
		user: string;
		date: string;
	} | null;
}) {
	const visiable = useBoolean(props.disgustful);
	return (
		<MuiBox display='flex'>
			<MuiBox>
				<MuiTypography variant='subtitle2'>
					{`${props.index + 1}.`}
				</MuiTypography>
			</MuiBox>
			<MuiBox ml={1} width='0' flexGrow={1} display='flex' flexDirection='column'>
				<MuiTooltip title={!props.disgustful ? '' : '此信息可能会引起你的不适，点击以切换显示状态'}>
					<MuiBox
						display='flex'
						onClick={props.disgustful ? visiable.toggle : undefined}
						style={{ filter: !visiable.value ? undefined : 'blur(3px)' }}
					>
						<MuiTypography variant='body1' style={{ wordBreak: 'break-all' }}>
							{props.subtitle != null &&
								<MuiTypography variant='subtitle1' color='textSecondary'>{props.subtitle}</MuiTypography>
							}
							{props.message.split('\n').map((value, index) => (<div key={index}>{value}</div>))}
						</MuiTypography>
					</MuiBox>
				</MuiTooltip>
				{props.info != null &&
					<MuiBox mt={0.5} alignSelf='flex-end' display='flex'>
						<MuiBox ml={1}>
							<MuiTypography variant='caption'>
								{props.info.user}
							</MuiTypography>
						</MuiBox>
						<MuiBox ml={1}>
							<MuiTypography variant='caption'>
								{props.info.date}
							</MuiTypography>
						</MuiBox>
					</MuiBox>
				}
			</MuiBox>
		</MuiBox>
	);
}

function RecordCommentView(props: {
	index: number;
	data: RecordComment;
	withInfo: boolean;
	alwaysDisgustful: boolean;
}) {
	return (
		<RecordMessageViewTemplate
			index={props.index}
			subtitle={null}
			message={props.data.message}
			disgustful={props.alwaysDisgustful || props.data.disgustful}
			info={!props.withInfo ? null : {
				user: (props.data as RecordCommentWithInfo).commenterName,
				date: (props.data as RecordCommentWithInfo).date,
			}}
		/>
	);
}

function RecordCommentViewList(props: {
	data: RecordComment[];
	withInfo: boolean;
	alwaysDisgustful: boolean;
}) {
	return (
		<MuiBox>
			{props.data.map((value, index) => (
				<React.Fragment key={index}>
					<RecordCommentView
						index={index}
						data={value}
						withInfo={props.withInfo}
						alwaysDisgustful={props.alwaysDisgustful}
					/>
					{index < props.data.length &&
						<MuiBox my={1}>
							<MuiDivider />
						</MuiBox>
					}
				</React.Fragment>
			))}
		</MuiBox>
	);
}

function RecordCheckInfoView(props: {
	index: number;
	data: RecordCheckInfo;
}) {
	return (
		<RecordMessageViewTemplate
			index={props.index}
			subtitle={props.data.determination == null ? '未知' : getNameOfRecordDetermination(props.data.determination)}
			message={props.data.message}
			disgustful={false}
			info={{
				user: props.data.checkerName,
				date: props.data.date,
			}}
		/>
	);
}

function RecordCheckInfoViewList(props: {
	data: RecordCheckInfo[];
}) {
	return (
		<MuiBox>
			{props.data.map((value, index) => (
				<React.Fragment key={index}>
					{index > 0 &&
						<MuiBox my={1}>
							<MuiDivider />
						</MuiBox>
					}
					<RecordCheckInfoView
						index={index}
						data={value}
					/>
				</React.Fragment>
			))}
		</MuiBox>
	);
}

function RecordView(props: {
	data: Record;
}) {
	const isChecked = isCheckedOfRecord(props.data);
	const realDetermination = getRealDeterminationOfRecord(props.data);
	return (
		<MuiBox display='flex' flexDirection='column'>
			<MuiBox display='flex' alignItems='center'>
				<MuiBox>
					<MuiChip
						size='small'
						variant='outlined'
						color='primary'
						label={isChecked ? '已审核' : '未审核'}
					/>
				</MuiBox>
				<MuiBox ml={1}>
					<MuiTypography variant='body2' color={realDetermination != props.data.determination ? 'error' : 'textSecondary'}>
						{isChecked ?
							realDetermination != props.data.determination ?
								'记录者判定与审核员判定不一，仅供参考'
								:
								'已经审核员审核，可信度较高'
							:
							'未经审核，记录存疑'
						}
					</MuiTypography>
				</MuiBox>
			</MuiBox>
			<MuiBox mt={1} display='flex' alignItems='center'>
				<MuiTypography variant='subtitle1'>
					记录者：
				</MuiTypography>
				<MuiTypography variant='body1'>
					{props.data.submitterName}
				</MuiTypography>
			</MuiBox>
			{props.data.description != null &&
				<MuiBox mt={1} display='flex' alignItems='center'>
					<MuiTypography variant='subtitle1'>
						记录备注：
					</MuiTypography>
					<MuiTypography variant='body1'>
						{props.data.description}
					</MuiTypography>
				</MuiBox>
			}
			<MuiBox mt={1} display='flex' alignItems='center'>
				<MuiTypography variant='subtitle1'>
					更新时间：
				</MuiTypography>
				<MuiTypography variant='body1'>
					{props.data.date}
				</MuiTypography>
			</MuiBox>
			{props.data.check.length != 0 &&
				<MuiBox mt={1} mb={1} width='100%'>
					<InsetArea title='审核记录'>
						<RecordCheckInfoViewList data={props.data.check} />
					</InsetArea>
				</MuiBox>
			}
			<MuiBox mt={1}>
				<MuiDivider />
			</MuiBox>
			<MuiBox mt={1} display='flex' alignItems='center' className='renderable-when-screenshot'>
				<MuiBox mr={1}>
					<MuiChip
						size='small'
						variant='outlined'
						color='primary'
						label={getNameOfSexualOrientationCategory(props.data.sexual)}
					/>
				</MuiBox>
				<MuiTypography variant='h6'>
					{props.data.name}
				</MuiTypography>
				{props.data.source != null &&
					<MuiBox ml={2}>
						<MuiChip
							size='small'
							variant='outlined'
							icon={<MuiLocalPrintshopIcon />}
							label={props.data.source}
						/>
					</MuiBox>
				}
			</MuiBox>
			<MuiBox mt={1} display='flex' alignItems='center' className='renderable-when-screenshot'>
				<MuiTypography variant='subtitle1'>
					作者：
				</MuiTypography>
				<MuiTypography variant='body1'>
					{props.data.author == null ? '<佚名>' : props.data.author}
				</MuiTypography>
			</MuiBox>
			<MuiBox mt={1} display='flex' alignItems='center' className='renderable-when-screenshot'>
				<MuiTypography variant='subtitle1'>
					判定：
				</MuiTypography>
				<MuiTypography variant='body1' color={(props.data.determination == null || isLikePureRecordDetermination(props.data.determination)) ? 'inherit' : 'error'}>
					{getNameOfRecordDeterminationMaybeUnknown(props.data.determination)}
				</MuiTypography>
			</MuiBox>
			{props.data.reason.length != 0 &&
				<MuiBox mt={1} width='100%' className='renderable-when-screenshot'>
					<InsetArea title='依据'>
						<RecordCommentViewList data={props.data.reason} withInfo={false} alwaysDisgustful={props.data.determination != null && isLikeDirtyRecordDetermination(props.data.determination)} />
					</InsetArea>
				</MuiBox>
			}
			{props.data.introduction.length != 0 &&
				<MuiBox mt={1} width='100%' className='renderable-when-screenshot'>
					<InsetArea title='介绍'>
						<RecordCommentViewList data={props.data.introduction} withInfo={false} alwaysDisgustful={false} />
					</InsetArea>
				</MuiBox>
			}
			{props.data.correct.length != 0 &&
				<MuiBox mt={1} width='100%'>
					<InsetArea title='修正'>
						<RecordCommentViewList data={props.data.correct} withInfo={true} alwaysDisgustful={false} />
					</InsetArea>
				</MuiBox>
			}
			{props.data.comment.length != 0 &&
				<MuiBox mt={1} width='100%'>
					<InsetArea title='评论'>
						<RecordCommentViewList data={props.data.comment} withInfo={true} alwaysDisgustful={false} />
					</InsetArea>
				</MuiBox>
			}
		</MuiBox >
	);
}

export { RecordView };