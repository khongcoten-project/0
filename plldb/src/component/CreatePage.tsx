import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiDivider from '@mui/material/Divider';
import MuiButton from '@mui/material/Button';
import MuiDialog from '@mui/material/Dialog';
import MuiDialogTitle from '@mui/material/DialogTitle';
import MuiDialogContent from '@mui/material/DialogContent';

import { RecordEditor } from './RecordEditor';
import { useOpenLogic, useOpenLogicWithData, useValue } from '../common/utility/Hook';
import { isLikeDirtyRecordDetermination, makeDefaultRawRecordTemplate, RawRecord, Record } from '../model/Record';
import { useCallback, useContext, useMemo } from 'react';
import { AlertSnackbarContext } from './common/AlertSnackbar';
import { ConfirmDialogContext } from './common/ConfirmDialog';
import { ProgressBackdropContext } from './common/ProgressBackdrop';
import { ajax } from '../util/Util';
import { RecordViewDialog } from './RecordViewDialog';

import Cookies from 'js-cookie';
import { UserContext } from './context/UserContext';
import { useLayoutEffect } from 'react';

function CreateDescriptionDialog(props: {
	open: boolean;
	onClose: () => void;
}) {
	return (
		<MuiDialog
			maxWidth='lg' fullWidth
			open={props.open}
			onClose={props.onClose}
		>
			<MuiDialogTitle>记录须知</MuiDialogTitle>
			<MuiDialogContent dividers
				style={{ height: '66vh' }}
			>
				<MuiBox>
					<MuiTypography variant='h5' gutterBottom>
						记录组成
					</MuiTypography>
					<MuiBox my={1}>
						<MuiDivider />
					</MuiBox>
					<MuiTypography variant='body1' color='textPrimary' gutterBottom>
						备注：记录的备注信息，选填
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* 如果是搬运了他人的记录，建议在此处填上原纪录的出处
					</MuiTypography>
					<MuiTypography variant='body1' color='textPrimary' gutterBottom>
						作品：所记录的小说、漫画等作品的名称
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* 请不要额外添加书名号
					</MuiTypography>
					<MuiTypography variant='body1' color='textPrimary' gutterBottom>
						作者：作品的作者，选填
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* 若有多个作者，以空格分割不同作者的名字
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* 若作者有马甲或其他名字，以斜杠 / 分割这些名字
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* 未填写时，作者名将显示为 &lt;佚名&gt;
					</MuiTypography>
					<MuiTypography variant='body1' color='textPrimary' gutterBottom>
						性向：作品中主CP的性别搭配，分为BG、BL、GL、其他（如无CP、性转）
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* 性向仅区分恋爱双方的性别，不区分体位上下，BG性向同时包含了一般的BG（男攻BxG）与GB（女攻GxB），GB类作品应选择BG性向
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* 对于ABO等特殊设定，性向划分以第一性别（男女）为准，而不必纠结第二性别（ABO）；例如，女A男O、男A女O为BG，男A男O、男O男O为BL，女A女B为GL
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* 对于BL中常见的双性设定（多出现于凰文中），应顺应圈内普遍认知，划分为BL类
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* 对于无CP文，应划分到“其他”性向中；无CP文需要满足主角身心双洁（没有喜欢过他人、也没有与他人发生过关系，不可有感情线）
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* 对于特殊情况，如角色性转，应划分为“其他”性向
					</MuiTypography>
					<MuiTypography variant='body1' color='textPrimary' gutterBottom>
						出版站点：作品的发布网站，选填
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* 请填写作者发布的正版所在网站，例如晋江等小说网站、腾讯动漫等漫画网站；不要填入“xx小说站”等盗版网站
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* 若有多个正版站点，以空格分割不同站点
					</MuiTypography>
					<MuiTypography variant='body1' color='textPrimary' gutterBottom>
						判定：对作品是否为双洁的判断
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* 请仔细阅读“关于”页面中的“双洁定义”，了解双洁判定基本规范，选择正确的判定类型
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* 当没有阅读完作品（包括番外）而记录时，只应选为[明确非洁]或[未知]；即使已阅读的部分出现了明确洁的证据，也不能判定为“明确洁”或“默认”；没有明确非洁的证据时也不应选择“明确非洁”或“默认偏非洁”
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* 判定是否为双洁时不可双标，要对CP双方一视同仁；例如，某受控在本站记录了一篇受非洁攻洁的作品，并标记为双洁，这是违背本站准则的
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* 要将作品判定为双洁，必须CP双方都满足双洁要求，只有双方都明确洁，才可标为明确洁，在一方明确洁、另一方默认洁时，只能选择[默认]或[默认偏洁]判定；当CP一方明确非洁或默认非洁时，应选择[明确非洁]或[默认非洁]，不论另一方多么高洁，如换男友/换攻文学等都为非洁，除非前任是正牌CP本身
					</MuiTypography>
					<MuiTypography variant='body1' color='textPrimary' gutterBottom>
						依据：判定作品是否双洁的依据
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* “依据”中应只填写影响双洁判定的信息，即角色是否双洁或非洁的证据；对于作品介绍、推荐信息、其他排雷、副CP、等，都请放入“介绍”中
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* 若依据内容很可能令洁党产生不适感，请注意勾选“可能令人不适”，勾选后将在详情页默认为该信息添加模糊特效，主动点击后才可查看
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* 当判定选为未知时，无法填写“依据”，请见排雷、推荐信息等填入“介绍”
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* 当判定选为争议时，请在此栏中填入争议原因
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* 如果判定一个作品为明确洁，应同时给出CP双方的感情与身体均为[洁]的依据，如果判定为明确非洁，也应给出任意一个[非洁]的依据
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* 应分别列出双方身体、感情是否洁的依据（共四项），最好附上原文或章节序号；不要只写上“攻明确受默认”几个字完事；即使文内没指出，也应至少写上“文中未提及，且无非洁倾向”
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* 请勿只写上“文内明确”、“看过了是洁的”等空泛的理由
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* 由于圈外对双洁的定义不一定与站内相同，有的将双处视为双洁，更有些作者存在文案诈骗、明确不洁标双洁的情况，故“作者认证”、“作者回复”、“文案标双洁”等一般不能作为确切依据，只作为佐证，如无其他明确证据，至多只能标为“默认偏洁”
					</MuiTypography>
					<MuiTypography variant='body1' color='textPrimary' gutterBottom>
						介绍：对作品的介绍；如CP属性、副CP排雷、其他雷萌点，都可以写在这一栏
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* 最好将作品的文案、官方介绍放在“介绍”中的第一栏
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* 若介绍内容很可能令洁党产生不适感，请注意勾选“可能令人不适”，勾选后将在详情页默认为该信息添加模糊特效，主动点击后才可查看
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* 当判定选为默认非洁、非洁时，无法填写“介绍”，本站原则上对非洁文只能进行排雷
					</MuiTypography>
					<MuiBox my={1}>
						<MuiDivider />
					</MuiBox>
					<MuiTypography variant='h5' gutterBottom>
						记录反馈
					</MuiTypography>
					<MuiBox my={1}>
						<MuiDivider />
					</MuiBox>
					<MuiTypography variant='body1' color='textPrimary' gutterBottom>
						修正：当记录中的依据或介绍出现客观谬误时，审核员对记录做出的修正性评论
					</MuiTypography>
					<MuiTypography variant='body1' color='textPrimary' gutterBottom>
						评论：其他用户对记录做出的评论，可以在这里对记录进行补充，或提出质疑
					</MuiTypography>
					<MuiTypography variant='body1' color='textPrimary' gutterBottom>
						审核：审核员对记录的审核，包含对是否双洁的判定与判定的理由
					</MuiTypography>
					<MuiTypography variant='body1' color='textSecondary' gutterBottom>
						* 当审核员给出的判定与记录者本身给出的判定相悖时，记录会被记为“可信度低”
					</MuiTypography>
					<MuiTypography variant='body1' color='textPrimary' gutterBottom>
						更新：记录创建后，你也可以再次修改记录内容；当更新记录后，原有的审核状态会失效，重新变回未审核状态
					</MuiTypography>
					<MuiBox my={1}>
						<MuiDivider />
					</MuiBox>
					<MuiTypography variant='h5' gutterBottom>
						审核判定规则
					</MuiTypography>
					<MuiBox my={1}>
						<MuiDivider />
					</MuiBox>
					<MuiTypography variant='body1' color='textPrimary' gutterBottom>
						明确洁：必须提供能证明CP双方身体和感情都明确洁的相关语句，或章节段落，或章节序号
					</MuiTypography>
					<MuiTypography variant='body1' color='textPrimary' gutterBottom>
						默认偏洁：需提供CP双方感情与身体很有可能洁的佐证
					</MuiTypography>
					<MuiTypography variant='body1' color='textPrimary' gutterBottom>
						默认：CP双方必须没有任何非洁的迹象
					</MuiTypography>
					<MuiTypography variant='body1' color='textPrimary' gutterBottom>
						默认非洁：至少提供一条CP中任意一方可能非洁的证据
					</MuiTypography>
					<MuiTypography variant='body1' color='textPrimary' gutterBottom>
						明确非洁：至少提供一条CP中任意一方非洁的证据
					</MuiTypography>
					<MuiTypography variant='body1' color='textPrimary' gutterBottom>
						争议：需提供导致双洁判定有争议的原因
					</MuiTypography>
					<MuiTypography variant='body1' color='textPrimary' gutterBottom>
						未知：适用于记录未完结或记录者没有看完全文含番外的作品，不论连载、已阅部分是否有明确洁的证据；但若已阅部分出现了非洁证据，则应归为“明确非洁”
					</MuiTypography>
					<MuiBox my={1}>
						<MuiDivider />
					</MuiBox>
					<MuiTypography variant='h5' gutterBottom>
						以下是无法通过审核的典型情况
					</MuiTypography>
					<MuiBox my={1}>
						<MuiDivider />
					</MuiBox>
					<MuiTypography variant='body1' color='textPrimary' gutterBottom>
						依据一栏中只有一句话的“文内明确”、“默认”时：审核判定为“未知”，理由为 依据不足
					</MuiTypography>
					<MuiTypography variant='body1' color='textPrimary' gutterBottom>
						依据一栏中没有明确证据，却选择了明确判定时：审核判定为“未知”，理由为 未给出...的依据，应指出缺少了什么依据（如：未给出某方感情洁的证据、未给出某方身体洁的依据、等）
					</MuiTypography>
					<MuiTypography variant='body1' color='textPrimary' gutterBottom>
						依据一栏中只有一句话的“文内明确”、“默认”时：审核判定为“未知”，理由为 依据不足/未给出...的依据
					</MuiTypography>
					<MuiBox mt={1}>
						<MuiDivider />
					</MuiBox>
				</MuiBox>
			</MuiDialogContent>
		</MuiDialog>
	);
}

function CreatePage(props: {}) {
	const data = useValue(Cookies.get('record') != undefined ? JSON.parse(Cookies.get('record')!) as RawRecord : makeDefaultRawRecordTemplate());
	const updateData = useCallback((newData: RawRecord) => {
		Cookies.set('record', JSON.stringify(newData), { expires: 15 });
		data.setValue(newData);
	}, []);
	const alertSnackbar = useContext(AlertSnackbarContext);
	const progressBackdrop = useContext(ProgressBackdropContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const viewDialog = useOpenLogicWithData(false, {
		display: false,
		record: null as any as Record
	});
	const viewDialogFragment = useMemo(() => {
		return (
			viewDialog.data.display &&
			<RecordViewDialog
				open={viewDialog.state}
				onClose={viewDialog.close}
				onExited={viewDialog.cleanData}
				data={viewDialog.data.record}
				updateData={() => alertSnackbar.open('info', '请在搜索页查找此记录，以查看更新结果')}
			/>
		);
	}, [viewDialog.state, viewDialog.data.display]);
	const submit = useCallback(() => {
		confirmDialog.open(`确定提交？`, null, () => {
			progressBackdrop.open();
			ajax('servlet/Record', 'update', {
				id: null,
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
				updateData(makeDefaultRawRecordTemplate());
				viewDialog.openWithData({
					display: true,
					record: resp.data.data.record
				});
			}).catch((error) => {
				progressBackdrop.close();
				alertSnackbar.open('error', JSON.stringify(error));
			});
		});
	}, []);
	const user = useContext(UserContext);
	const descriptionDialog = useOpenLogic(true);
	const descriptionDialogFragment = useMemo(() => {
		return (
			<CreateDescriptionDialog
				open={descriptionDialog.state}
				onClose={descriptionDialog.close}
			/>
		);
	}, [descriptionDialog.state]);
	useLayoutEffect(() => {
		if (user.user == null) {
			confirmDialog.open('创建记录需要账号登入', '点击右上角人物图标即可注册或登入', () => { });
		}
	}, []);
	return (
		<MuiBox width='100%' height='100%' display='flex' flexDirection='column' alignItems='center'>
			<MuiBox px={2} width='100%' overflow='hidden scroll' flexGrow={1}>
				<RecordEditor
					data={data.value}
					updateData={updateData}
				/>
			</MuiBox>
			<MuiBox width='100%'>
				<MuiDivider />
			</MuiBox>
			<MuiBox mt={1} width='100%' display='flex' alignItems='center'>
				<MuiBox flexGrow={100} />
				<MuiBox ml={1}>
					<MuiButton variant='outlined' color='secondary' onClick={descriptionDialog.open}>
						记录须知
					</MuiButton>
				</MuiBox>
				<MuiBox ml={1}>
					<MuiButton variant='contained' color='primary' onClick={submit}>
						提交
					</MuiButton>
				</MuiBox>
			</MuiBox>
			{viewDialogFragment}
			{descriptionDialogFragment}
		</MuiBox>
	);
}

export { CreatePage };