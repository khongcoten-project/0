
import { createContext } from 'react';

import MuiSnackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { makeStyles, styled } from '@mui/material/styles';

import { useBooleanWithData, useOpenLogicWithData } from '../../common/utility/Hook';
import { useCallback } from 'react';

interface AlertMessage {
	type: 'success' | 'info' | 'warning' | 'error';
	text: string;
}

interface AlertSnackbarContextType {
	open: (type: AlertMessage['type'], text: AlertMessage['text']) => void;
}

const AlertSnackbarContext = createContext<AlertSnackbarContextType>({
	open: (type: AlertMessage['type'], text: AlertMessage['text']) => { }
});

function useAlertSnackbar(initialState: boolean, initialMessage: AlertMessage) {
	const state = useOpenLogicWithData(initialState, { display: false, ...initialMessage });
	const openWithMessageSimplify = useCallback((type: AlertMessage['type'], text: AlertMessage['text']) => {
		state.openWithData({
			display: true,
			type: type,
			text: text
		});
	}, [state.openWithData]);
	return {
		state: state.state,
		message: state.data,
		setState: state.setState,
		open: state.open,
		close: state.close,
		setMessage: state.setData,
		cleanMessage: state.cleanData,
		openWithMessage: state.openWithData,
		closeWithMessage: state.closeWithData,
		openWithMessageSimplify: openWithMessageSimplify,
	};
}

function AlertSnackbar(props: {
	display: boolean;
	state: boolean;
	message: AlertMessage;
	onClose: () => void;
	onExited: () => void;
}) {
	return (
		!props.display ? null :
			<MuiSnackbar
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				open={props.state}
				autoHideDuration={2000}
				onClose={props.onClose}
				ClickAwayListenerProps={{
					mouseEvent: false,
					touchEvent: false
				}}
				TransitionProps={{
					onExited: props.onExited
				}}
			>
				<MuiAlert severity={props.message.type}>
					{props.message.text}
				</MuiAlert>
			</MuiSnackbar>
	);
}

export type { AlertMessage };
export { AlertSnackbarContext, useAlertSnackbar, AlertSnackbar };