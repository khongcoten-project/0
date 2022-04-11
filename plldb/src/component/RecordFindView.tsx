import { useCallback, useMemo } from 'react';

import MuiBox from '@mui/material/Box';
import MuiGrid from '@mui/material/Grid';
import MuiDivider from '@mui/material/Divider';
import MuiMenuItem from '@mui/material/MenuItem';
import MuiFormControl from '@mui/material/FormControl';
import MuiFormControlLabel from '@mui/material/FormControlLabel';
import MuiInputLabel from '@mui/material/InputLabel';
import MuiTextField from '@mui/material/TextField';
import MuiSelect from '@mui/material/Select';
import MuiCheckbox from '@mui/material/Checkbox';
import MuiButton from '@mui/material/Button';
import MuiHidden from '@mui/material/Hidden';
import MuiSearchIcon from '@mui/icons-material/Search';

import { RecordTable } from './RecordTable';

import {
	SexualOrientationCategory,
	RecordFindRule,
	makeDefaultRecordFindRule,
} from '../model/Record'
import { useValue } from '../common/utility/Hook';

import { FindBar } from './FindBar';

function RecordFindView(props: {}) {
	const rule = useValue(makeDefaultRecordFindRule());
	const recordTableFragment = useMemo(() => {
		return (
			<RecordTable rule={rule.value}/>
		)
	}, [rule.value]);
	return (
		<MuiBox width='100%' height='100%' display='flex' flexDirection='column'>
			<MuiBox flexShrink={0} width='100%' px={1}>
				<FindBar
					boxProps={{ width: '100%', overflow: 'visible' }}
					updateRule={rule.setValue}
				/>
			</MuiBox>
			<MuiBox mt={2} flexShrink={0} width='100%'>
				<MuiDivider />
			</MuiBox>
			<MuiBox flexGrow={1} width='100%' height='0'>
				{recordTableFragment}
			</MuiBox>
		</MuiBox>
	);
}

export { RecordFindView };