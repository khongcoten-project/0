import {
	Typography as MuiTypography,
	Dialog as MuiDialog,
	DialogTitle as MuiDialogTitle,
	DialogContent as MuiDialogContent,
	Divider as MuiDivider,
} from '@mui/material';

function AboutDialog(props: {
	open: boolean;
	onClose: () => void;
}) {
	return (
		<MuiDialog
			maxWidth='md' fullWidth
			open={props.open} onClose={props.onClose}
		>
			<MuiDialogTitle>关于</MuiDialogTitle>
			<MuiDialogContent dividers sx={{ display: 'flex', flexDirection: 'column' }}>
				<MuiTypography variant='h5' gutterBottom>
					TwinKleS-ToolKit Project
				</MuiTypography>
				<MuiTypography variant='caption' gutterBottom>
					Copyright © 2021 TwinKleS
				</MuiTypography>
				<MuiDivider sx={{ my: 1 }} />
				<MuiTypography variant='caption' sx={{ textTransform: 'uppercase' }}>
					React 17.0.2
					<br />
					MUI 5.0.1
				</MuiTypography>
			</MuiDialogContent>
		</MuiDialog>
	);
}

export { AboutDialog };