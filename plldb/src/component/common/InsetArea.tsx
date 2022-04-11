import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiDivider from '@mui/material/Divider';

function InsetArea(props: {
	title: string;
	padding?: number;
	children?: React.ReactNode;
}) {
	const padding = props.padding || `${32 + 16}px`;
	return (
		<MuiBox>
			<MuiBox width='100%' display='flex' alignItems='center'>
				<MuiBox>
					<MuiTypography variant='subtitle1'>
						{props.title}
					</MuiTypography>
				</MuiBox>
				<MuiBox ml={2} flexGrow={1}>
					<MuiDivider />
				</MuiBox>
			</MuiBox>
			<MuiBox mt={0.5} ml={padding} width={`calc(100% - ${padding})`}>
				{props.children}
			</MuiBox>
		</MuiBox>
	);
}

export { InsetArea };