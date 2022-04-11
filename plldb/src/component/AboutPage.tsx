import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';
import MuiDivider from '@mui/material/Divider';
import MuiBottomNavigation from '@mui/material/BottomNavigation';
import MuiBottomNavigationAction from '@mui/material/BottomNavigationAction';
import MuiLiveHelpIcon from '@mui/icons-material/LiveHelp';
import MuiDescriptionIcon from '@mui/icons-material/Description';
import MuiEditIcon from '@mui/icons-material/Edit';
import MuiSpellcheckIcon from '@mui/icons-material/Spellcheck';

import { useValue } from '../common/utility/Hook';

function AboutPage(props: {}) {
	const tabIndex = useValue(0 as 0 | 1);
	return (
		<MuiBox width='100%' height='100%' display='flex' flexDirection='column' alignItems='center'>
			<MuiBox width='100%' height='1px' flexGrow={1} overflow='hidden scroll'>
				{tabIndex.value == 0 &&
					<MuiBox>
						<MuiTypography variant='h4' gutterBottom>
							关于本站
						</MuiTypography>
						<MuiBox my={1}>
							<MuiDivider />
						</MuiBox>
						<MuiTypography variant='body1' color='textPrimary' gutterBottom>
							本站旨在为双洁同好提供排雷搜索与记录的服务。你可以根据作品、作者名称等条件来查找某个作品的记录，也可以在本站内记录你看过的小说、漫画等作品
						</MuiTypography>
						<MuiTypography variant='body1' color='textSecondary' gutterBottom>
							秉持着分享原则，站内的记录都是公开状态，他人可以查找到你的记录，你也可以查找他人的记录，共同促进网站数据库的丰富
						</MuiTypography>
						<MuiTypography variant='body1' color='textPrimary' gutterBottom>
							相关链接&nbsp;&nbsp;
							<MuiLink href='https://tieba.baidu.com/f?kw=%E5%8F%8C%E6%B4%81%E6%96%87&fr=index' target='_blank'>
								[贴吧] 双洁文吧
							</MuiLink>
							&nbsp;|&nbsp;
							<MuiLink href='https://weibo.com/p/100808ffc2204f7c10d4abf4425d5c48242cb0/super_index' target='_blank'>
								[微博] 双洁超话
							</MuiLink>
						</MuiTypography>
						<MuiBox my={1}>
							<MuiDivider />
						</MuiBox>
						<MuiTypography variant='h5' gutterBottom>
							联系本站
						</MuiTypography>
						<MuiBox my={1}>
							<MuiDivider />
						</MuiBox>
						<MuiTypography variant='body1' color='textPrimary' gutterBottom>
							如果你对本站有任何建议、或在使用中出现了一些问题（如遗忘密码、账号名），可以与站主联系：
							<MuiLink href='https://tieba.baidu.com/home/main?id=tb.1.e8dcd1c0.2CmARMmgH5CxJ6Ibv6LFpg' target='_blank'>
								[贴吧] 一路上海外
							</MuiLink>
							&nbsp;|&nbsp;
							<MuiLink href='#'>
								[邮箱] smallpc@qq.com
							</MuiLink>
						</MuiTypography>
						<MuiBox mt={1}>
							<MuiDivider />
						</MuiBox>
					</MuiBox>
				}
				{tabIndex.value == 1 &&
					<MuiBox>
						<MuiTypography variant='h4' gutterBottom>
							何谓[双洁]？
						</MuiTypography>
						<MuiBox my={1}>
							<MuiDivider />
						</MuiBox>
						<MuiTypography variant='body1' color='textPrimary' gutterBottom>
							[双洁] 是根据小说、漫画等作品的内容情况进行的一种分类，粗略地说，[双洁] 即作品中描写的CP双方 生命中只对对方一个人抱有恋爱情感，且只与对方发生性关系，不论性别、体位；双洁标准广泛的[近义词]为[三初]，即初恋、初夜、初吻
						</MuiTypography>
						<MuiTypography variant='body1' color='textSecondary' gutterBottom>
							[双洁] 只是一种喜好、一种选择倾向，就像有人喜欢[BE]，有人爱看[互宠]一样，这种喜好并不高贵，但更不下流；如果误入本站的你并不认同[双洁]理念，请点击右上角的X离开本站，相互尊重；随意将他人及其爱好视作monster并欲禁言之的，是为“封建”的狭隘思想观🤧
						</MuiTypography>
						<MuiBox my={1}>
							<MuiDivider />
						</MuiBox>
						<MuiTypography variant='h5' gutterBottom>
							双洁相关定义&nbsp;&nbsp;
							<MuiTypography variant='caption' color='textSecondary' component='span'>
								由于性向有BG、BL、GL等多种情况，BG(Boy&Girl)中包含BG(男攻BxG)与GB(女攻GxB)，此外还有反攻、互攻，故下文不直接以“男女主”、“攻受”作为人称代词
							</MuiTypography>
						</MuiTypography>
						<MuiBox my={1}>
							<MuiDivider />
						</MuiBox>
						<MuiTypography variant='body1' color='textPrimary' gutterBottom>
							* 心洁|感情洁：角色生命中只对对方产生了恋爱情感；包括暧昧、暗恋、朦胧的好感、自以为的喜欢、等，双洁CP的双方都是对方一以贯之的初恋
						</MuiTypography>
						<MuiTypography variant='body1' color='textPrimary' gutterBottom>
							* 身洁|身体洁：角色生命中只与对方有过性行为；包括前后器官、互攻、反攻、等，双洁CP的双方从始至终只与对方发生过性关系、互为对方的第一次
						</MuiTypography>
						<MuiTypography variant='body1' color='textSecondary' gutterBottom>
							* 名声洁：在第三方（文中配角、路人）视角中，角色不违反身心双洁标准；名声不洁仅为雷点，不归为非双洁范畴，若某CP身心双洁但名声非洁，仍视作双洁；例如，若某BG小说中，男主与女配没有任何超出界限的关系，但配角或路人误会了二人有过感情或身体纠葛，且最后仍没有解除误会，则男主名声非洁；此类的典型设定还有假后宫、假男友（非正牌CP）
						</MuiTypography>
						<MuiTypography variant='body1' color='textSecondary' gutterBottom>
							* 炮灰：对角色有感情或身体层面上的[兴趣]的人；例如，除官配CP外的追求者、见色起意者
						</MuiTypography>
						<MuiTypography variant='body1' color='textSecondary' gutterBottom>
							* 雷点：一切可能令读者产生厌恶感的剧情设置，例如扶贫、单方面施虐、圣母、三观不正
						</MuiTypography>
						<MuiTypography variant='body1' color='textSecondary' gutterBottom>
							* 豆腐：角色与除对方之外的人发生的超过限度的身体接触；例如，与炮灰牵手、打赤膊被他人看见、被他人挑下巴、演员职业角色在拍摄过程中的吻戏感情戏
						</MuiTypography>
						<MuiTypography variant='body1' color='textSecondary' gutterBottom>
							* 双初：初恋、初夜；此为双洁的底线要求
						</MuiTypography>
						<MuiTypography variant='body1' color='textSecondary' gutterBottom>
							* 三初：初恋、初夜、初吻
						</MuiTypography>
						<MuiTypography variant='body1' color='textSecondary' gutterBottom>
							* 七初：初恋、初夜、初吻、初牵、初拥、初欲、初婚
						</MuiTypography>
						<MuiTypography variant='body1' color='textPrimary' gutterBottom>
							双洁底线为身心双洁，只要满足感情洁+身体洁，即可称为[双洁]；其他的，如名声洁、七初，只是更高洁度的要求
						</MuiTypography>
						<MuiBox my={1}>
							<MuiDivider />
						</MuiBox>
						<MuiTypography variant='h5' gutterBottom>
							双洁判定类型
						</MuiTypography>
						<MuiBox my={1}>
							<MuiDivider />
						</MuiBox>
						<MuiTypography variant='body1' color='textPrimary' gutterBottom>
							* 明确洁：作品中有明确证据显示CP双方均为双洁（感情洁+身体洁）
						</MuiTypography>
						<MuiTypography variant='body1' color='textSecondary' gutterBottom>
							* 默认偏洁：作品中没有点明是否双洁，但从角色的性格、人际关系、思想观念等方面可以基本看出角色非洁几率极低的
						</MuiTypography>
						<MuiTypography variant='body1' color='textSecondary' gutterBottom>
							* 默认：作品中没有点明是否双洁，但同时也没有角色非洁的证据
						</MuiTypography>
						<MuiTypography variant='body1' color='textSecondary' gutterBottom>
							* 默认非洁：作品中虽然没有点名角色非洁，但从角色的性格、人际关系、思想观念等方面可以基本看出角色非洁几率大的，或有其他蛛丝马迹可以看出角色非洁
						</MuiTypography>
						<MuiTypography variant='body1' color='textSecondary' gutterBottom>
							* 明确非洁：作品中有明确证据显示CP双方或任意一方非洁
						</MuiTypography>
						<MuiTypography variant='body1' color='textSecondary' gutterBottom>
							* 争议：特殊情况，关于角色是否为双洁存在争议，不同读者各执一词且无法判别
						</MuiTypography>
						<MuiTypography variant='body1' color='textPrimary' gutterBottom>
							[双洁] 是对 1v1 CP 双方的统一要求，不可对CP双方持双重标准，[菊洁]、[瓜洁]、[攻洁]、[受洁]、[男洁]、[女洁]、[双处]等均非[双洁]
						</MuiTypography>
						<MuiTypography variant='body1' color='textPrimary' gutterBottom>
							[双洁]针对1v1，NP、伪NP均不算在[双洁]范围内，即使所有角色都未与他人有任何关系
						</MuiTypography>
						<MuiBox my={1}>
							<MuiDivider />
						</MuiBox>
						<MuiTypography variant='h5' gutterBottom>
							具体说明
						</MuiTypography>
						<MuiBox my={1}>
							<MuiDivider />
						</MuiBox>
						<MuiTypography variant='body1' color='textPrimary' gutterBottom>
							对正牌CP以外的第三人有过心动、暗恋，或是朦胧的好感、等，均视作[感情非洁]；例如，某BL小说中的受对同班女生有过朦胧的恋情，但隐藏地很好，包括攻也没发现，这也视作[感情非洁]
						</MuiTypography>
						<MuiTypography variant='body1' color='textPrimary' gutterBottom>
							对正牌CP以外的第三人有过自以为的喜欢（即角色在某个时段认为自己喜欢他人，但后文又解释说不是真正的喜欢），也视作[感情非洁]；例如，某BL小说中攻将某配角视作白月光，并因受与配角相像而找受做替身，即使后文作者强行解释说攻对配角并不是真正的喜欢，此小说为依然为毋庸置疑的[感情非洁]
						</MuiTypography>
						<MuiTypography variant='body1' color='textPrimary' gutterBottom>
							对正牌CP以外的第三人有暧昧行为、追求行为、发展友情以上关系的想法的，不论原因为何，均视作[感情非洁]；例如，某BL小说中受在失去上一世记忆的时候追求了一个配角未果，作者给出的理由是“受失去记忆但潜意识里追随攻，因此追求了和攻有些像的配角”，此情况视作[感情非洁]
						</MuiTypography>
						<MuiTypography variant='body1' color='textPrimary' gutterBottom>
							与正牌CP以外的第三人交往过，不论交往对象性别、时间先后与长短、戏份多少、前后世，均视作[感情非洁]；例如，某BL小说中的攻在遇到受之前谈过“一节课的恋爱”，应视作[感情非洁]
						</MuiTypography>
						<MuiTypography variant='body1' color='textPrimary' gutterBottom>
							与正牌CP以外的第三人交往过，即使对交往对象没有恋爱感情，也视作[感情非洁]；例如，某热门BL小说中的攻为了女方的礼物同女方交往，不论是否有感情，都视作[感情非洁]
						</MuiTypography>
						<MuiTypography variant='body1' color='textSecondary' gutterBottom>
							与正牌CP以外的第三人交往过，但角色与交往对象互相间都没有恋爱情感，只是出于某些原因协议演戏的，视作[感情洁]
						</MuiTypography>
						<MuiTypography variant='body1' color='textSecondary' gutterBottom>
							与正牌CP以外的第三人订婚，除非角色不知情、非自愿、长辈强行安排但反抗无果且之后解除了婚约、与婚约对象协议假订婚且在之后解除了婚约几类情况，均视作非洁；重点在于被安排婚约之人是否自愿接受
						</MuiTypography>
						<MuiTypography variant='body1' color='textSecondary' gutterBottom>
							与正牌CP以外的第三人有过性行为，或是边缘性行为、差一点就发生关系的，视作[非洁]
						</MuiTypography>
						<MuiTypography variant='body1' color='textSecondary' gutterBottom>
							与正牌CP以外的第三人约P但失败、最终和正牌CP成了的，视作[非洁]；如果约P双方就是CP，视作[雷点]；例如，某BL小说中，受原本约了攻的好友，但最终见面的是攻，应视作[非洁]
						</MuiTypography>
						<MuiTypography variant='body1' color='textSecondary' gutterBottom>
							对于“过程NP，结局1v1”、“买股文”等类型，视为伪NP，均为[非洁]
						</MuiTypography>
						<MuiTypography variant='body1' color='textPrimary' gutterBottom>
							对于精分、切片等设定，若非各个分身的意识存在连续性且不存在修罗场（即：虽然说是切片，但本质上仅有一个时间上连续的意识），均视作伪NP，不算做[双洁]；特别是快穿中常见此类设定，应注意一下
						</MuiTypography>
						<MuiTypography variant='body1' color='textSecondary' gutterBottom>
							双洁要求包含前世今生，如果角色有多世，只要某一世不符合双洁判定，均视作[非洁]
						</MuiTypography>
						<MuiTypography variant='body1' color='textSecondary' gutterBottom>
							若角色被植入非洁记忆，且自己认可非洁记忆的，除特殊情况可提出争议外，均视为非洁；若被植入了非洁记忆，但自身并不认为那是自己做的，且之后恢复记忆知晓自己并非那人，则可视为洁
						</MuiTypography>
						<MuiTypography variant='body1' color='textSecondary' gutterBottom>
							双洁要求包含正文与番外，若番外有非洁行为，也视作[非洁]；例如，某BL小说作者在完结多年后的一次番外更新中描写了攻方的出轨事实，不论正文如何，都算为[不洁]
						</MuiTypography>
						<MuiTypography variant='body1' color='textSecondary' gutterBottom>
							对于穿书、快穿、穿越等有角色换身体剧情的，只要求身体原主身体洁，原主感情非洁视作雷点
						</MuiTypography>
						<MuiTypography variant='body1' color='textPrimary' gutterBottom>
							[双处]不是[双洁]，应严格区分二者；[双处]只要求双方未与他人成功发生性行为，直白地讲，没插进去都算双处
						</MuiTypography>
						<MuiTypography variant='body1' color='textSecondary' gutterBottom>
							由于小说等作品中的设定实在繁多，本细则也未能完全概括而存在例外情况，可以在双洁文吧提出争议并讨论
						</MuiTypography>
						<MuiBox my={1}>
							<MuiDivider />
						</MuiBox>
						<MuiTypography variant='h5' gutterBottom>
							其他
						</MuiTypography>
						<MuiBox my={1}>
							<MuiDivider />
						</MuiBox>
						<MuiTypography variant='subtitle1' gutterBottom>
							参考&nbsp;&nbsp;
							<MuiLink href='https://tieba.baidu.com/p/7271656481' target='_blank'>
								双洁文吧吧规
							</MuiLink>
						</MuiTypography>
						<MuiBox mt={1}>
							<MuiDivider />
						</MuiBox>
					</MuiBox>
				}
			</MuiBox>
			<MuiBox width='100%'>
				<MuiDivider />
			</MuiBox>
			<MuiBox width='100%' mt={1}>
				<MuiBottomNavigation
					showLabels
					value={tabIndex.value}
					onChange={(event, value) => tabIndex.setValue(value)}
				>
					<MuiBottomNavigationAction label='关于本站' icon={<MuiLiveHelpIcon />} />
					<MuiBottomNavigationAction label='双洁定义' icon={<MuiDescriptionIcon />} />
				</MuiBottomNavigation>
			</MuiBox>
		</MuiBox>
	);
}

export { AboutPage };