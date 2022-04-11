
import { createContext } from 'react';

import MuiBackdrop from '@mui/material/Backdrop';
import MuiCircularProgress from '@mui/material/CircularProgress';

import { useOpenLogic } from '../../common/utility/Hook';

interface ProgressBackdropContextType {
	open: () => void;
	close: () => void;
}

const ProgressBackdropContext = createContext<ProgressBackdropContextType>({
	open: () => {},
	close: () => {}
});

function useProgressBackdrop(initialState: boolean) {
	return useOpenLogic(initialState);
}

function ProgressBackdrop(props: {
	state: boolean;
}) {
	return (
		<MuiBackdrop
			open={props.state}
			style={{ zIndex: 10000000 }}
		>
			<MuiCircularProgress color='inherit' />
		</MuiBackdrop>
	);
}

export { ProgressBackdropContext, useProgressBackdrop, ProgressBackdrop };