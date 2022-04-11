import { createContext, useCallback } from 'react';

import MuiDialog from '@mui/material/Dialog';
import MuiDialogTitle from '@mui/material/DialogTitle';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogActions from '@mui/material/DialogActions';
import MuiButton from '@mui/material/Button';

import { useOpenLogicWithData } from '../../common/utility/Hook';

interface ConfirmDialogContextType {
	open: (title: string, content: string | null, onConfirm: () => void) => void;
	close: () => void;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType>({
	open: (title: string, content: string | null, onConfirm: () => void) => {},
	close: () => {}
});

function useConfirmDialog(initialState: boolean) {
	const state = useOpenLogicWithData(initialState, {
		title: '',
		content: null as string | null,
		onConfirm: () => {}
	});
	const openSimplify = useCallback((title: string, content: string | null, onConfirm: () => void) => {
		state.openWithData({
			title: title,
			content: content,
			onConfirm: onConfirm
		});
	}, [state.openWithData]);
	return {
		...state,
		openSimplify,
	}
}

function ConfirmDialog(props: {
	state: boolean;
	onClose: () => void;
	onExited: () => void;
	title: string;
	content: string | null;
	onConfirm: () => void;
}) {
	const onConfirmedClose = useCallback(() => {
		props.onClose();
		props.onConfirm();
	}, [props.onClose, props.onConfirm]);
	return (
		<MuiDialog
			maxWidth='sm' fullWidth
			open={props.state}
			TransitionProps={{
				onExited: props.onExited
			}}
		>
			<MuiDialogTitle>{props.title}</MuiDialogTitle>
			{props.content != null &&
				<MuiDialogContent dividers>
					{props.content}
				</MuiDialogContent>
			}
			<MuiDialogActions>
				<MuiButton autoFocus variant='text' color='primary'
					onClick={props.onClose}
				>
					再想想...
				</MuiButton>
				<MuiButton variant='contained' color='primary'
					onClick={onConfirmedClose}
				>
					确定
				</MuiButton>
			</MuiDialogActions>
		</MuiDialog>
	);
}

export { ConfirmDialogContext, useConfirmDialog, ConfirmDialog };