import { useCallback, useContext } from 'react';

import MuiBox from '@mui/material/Box';
import MuiGrid from '@mui/material/Grid';
import MuiDivider from '@mui/material/Divider';
import MuiIconButton from '@mui/material/IconButton';
import MuiMenuItem from '@mui/material/MenuItem';
import MuiFormControl from '@mui/material/FormControl';
import MuiFormControlLabel from '@mui/material/FormControlLabel';
import MuiFormHelperText from '@mui/material/FormHelperText';
import MuiInputLabel from '@mui/material/InputLabel';
import MuiTextField from '@mui/material/TextField';
import MuiSwitch from '@mui/material/Switch';
import MuiRadio from '@mui/material/Radio';
import MuiRadioGroup from '@mui/material/RadioGroup';
import MuiSelect from '@mui/material/Select';
import MuiCheckbox from '@mui/material/Checkbox';
import MuiButton from '@mui/material/Button';
import MuiHidden from '@mui/material/Hidden';
import MuiSearchIcon from '@mui/icons-material/Search';
import MuiArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MuiArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { AlertSnackbarContext } from './common/AlertSnackbar';

import { useFormData, useValue } from '../common/utility/Hook';
import {
	SexualOrientationCategory,
	RecordFindTarget,
	RecordFindRule,
	makeDefaultRecordFindRule,
	setOfSexualOrientationCategory,
	getNameOfSexualOrientationCategory,
} from '../model/Record'
import { UserContext } from './context/UserContext';

function FindBar(props: {
	boxProps: object;
	updateRule: (rule: RecordFindRule) => void;
}) {
	// alertSnackbar
	const alertSnackbar = useContext(AlertSnackbarContext);
	// user
	const user = useContext(UserContext);
	// rule
	const rule = useFormData(makeDefaultRecordFindRule());
	const toggleSexualCategory = useCallback((sexual: SexualOrientationCategory) => {
		let newSexual = rule.ref.current!.sexual;
		const index = newSexual.findIndex(e => e == sexual);
		if (index != -1) {
			if (newSexual.length == 1) {
				alertSnackbar.open('error', '至少需要选择一个分类项');
			} else {
				newSexual.splice(index, 1);
			}
		} else {
			newSexual.push(sexual);
			newSexual.sort();
		}
		rule.setItem('sexual', newSexual);
	}, [rule.ref]);
	const updateRule = useCallback(() => {
		props.updateRule({ ...rule.ref.current! });
	}, [props.updateRule, rule.ref]);
	// bug: 在snackbar的TransitionProps.onExited首次执行完毕之后，点击任意地方都会触发它处点击
	//      这会导致之后无法再显示出snackbar（open之后立即因它处点击而close）
	// fix: 禁止它处点击（或禁止Transition？）
	// bug: 在首次点击“搜索”后，即使不再点击“搜索”以更新父组件的rule，也会影响table的rule（此时父组件仍无变化）
	return (
		<MuiBox {...props.boxProps}>
			<MuiGrid container spacing={1} alignItems='flex-end' justifyContent='center'>
				<MuiGrid item xs={12} md={12}>
					<MuiBox display='flex' alignItems='flex-end' style={{ overflow: 'auto hidden' }}>
						<MuiBox flexGrow={1} />
						<MuiBox flexShrink={0}>
							<MuiFormControl>
								<MuiRadioGroup row
									value={rule.value.submitterName == null ? 'global' : 'personal'}
									onChange={(event, value) => rule.setItem('submitterName', value == 'global' ? null : user.user?.name || '') }
								>
									<MuiFormControlLabel
										value='global'
										control={<MuiRadio color='primary' />}
										label='全局'
									/>
									<MuiFormControlLabel
										value='personal'
										control={<MuiRadio color='primary' />}
										label='记录者'
									/>
								</MuiRadioGroup>
								<MuiFormHelperText>搜索范围</MuiFormHelperText>
							</MuiFormControl>
						</MuiBox>
						<MuiBox mx={1} flexGrow={4} minWidth='108px'>
							<MuiTextField
								variant='standard'
								fullWidth
								label='记录者用户名'
								helperText='必须为完整用户名，不能错字漏字'
								disabled={rule.value.submitterName == null}
								value={rule.value.submitterName || ''}
								onChange={(event) => rule.setItem('submitterName', event.target.value)}
							/>
						</MuiBox>
						<MuiBox flexGrow={1} />
					</MuiBox>
				</MuiGrid>
				<MuiGrid item xs={12}>
					<MuiDivider />
				</MuiGrid>
				<MuiGrid item xs={12} md={5} style={{ overflow: 'auto hidden' }}>
					<MuiBox display='flex' alignItems='flex-end' width='fit-content' mx='auto'>
						<MuiBox mr={4}>
							<MuiFormControl>
								<MuiInputLabel>审核状态</MuiInputLabel>
								<MuiSelect
								variant='standard'
									value={(rule.value.fromUnchecked ? 0b01 : 0b00) | (rule.value.fromChecked ? 0b10 : 0b00)}
									onChange={(event, child) => {
										rule.setValue({
											...rule.ref.current!,
											fromUnchecked: ((event.target.value as number) & 0b01) != 0b00,
											fromChecked: ((event.target.value as number) & 0b10) != 0b00
										});
									}}
									style={{ width: '84px' }}
								>
									<MuiMenuItem value={0b11}>全部</MuiMenuItem>
									<MuiMenuItem value={0b10}>已审核</MuiMenuItem>
									<MuiMenuItem value={0b01}>未审核</MuiMenuItem>
								</MuiSelect>
							</MuiFormControl>
						</MuiBox>
						{setOfSexualOrientationCategory.map((value) => (
							<MuiFormControlLabel key={value}
								label={getNameOfSexualOrientationCategory(value)!}
								control={
									<MuiCheckbox
										checked={rule.value.sexual.includes(value)}
										onChange={() => toggleSexualCategory(value)}
									/>
								}
							/>
						))}
					</MuiBox>
				</MuiGrid>
				<MuiHidden mdUp>
					<MuiGrid item xs={12}>
						<MuiDivider />
					</MuiGrid>
				</MuiHidden>
				<MuiGrid item xs={12} md={7}>
					<MuiBox display='flex' alignItems='flex-end' style={{ overflow: 'auto hidden' }}>
						<MuiBox flexGrow={1} />
						<MuiBox flexShrink={0}>
							<MuiFormControl>
								<MuiInputLabel>搜索目标</MuiInputLabel>
								<MuiSelect
								variant='standard'
									style={{ width: '72px' }}
									value={rule.value.target}
									onChange={(event) => rule.setItem('target', event.target.value as RecordFindTarget)}
								>
									<MuiMenuItem value={RecordFindTarget.Name}>作品</MuiMenuItem>
									<MuiMenuItem value={RecordFindTarget.Author}>作者</MuiMenuItem>
									<MuiMenuItem value={RecordFindTarget.Message}>内容</MuiMenuItem>
								</MuiSelect>
							</MuiFormControl>
						</MuiBox>
						<MuiBox mx={1} flexGrow={4} minWidth='100px'>
							<MuiTextField
								variant='standard'
								fullWidth
								label='关键词（正则）'
								value={rule.value.keyword}
								onChange={(event) => rule.setItem('keyword', event.target.value as string)}
							/>
						</MuiBox>
						<MuiBox flexShrink={0}>
							<MuiButton
								variant='outlined'
								color='primary'
								startIcon={<MuiSearchIcon />}
								onClick={updateRule}
							>
								搜索
							</MuiButton>
						</MuiBox>
						<MuiBox flexGrow={1} />
					</MuiBox>
				</MuiGrid>
			</MuiGrid>
		</MuiBox>
	);
}

export { FindBar };