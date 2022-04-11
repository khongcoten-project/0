import MuiBox from '@mui/material/Box';
import MuiSkeleton from '@mui/material/Skeleton';

import { useBoolean } from '../common/utility/Hook';

function AsyncLoadImage(props: {
	url: string;
}) {
	const loaded = useBoolean(false);
	return (
		<MuiBox m={0.5}>
			<img src={props.url} style={{ display: loaded.value ? 'block' : 'none' }} onLoad={loaded.setTrue} />
			{!loaded.value &&
				<MuiSkeleton variant='rectangular' animation='wave' width='64px' height='64px' />
			}
		</MuiBox>
	);
}

export { AsyncLoadImage };