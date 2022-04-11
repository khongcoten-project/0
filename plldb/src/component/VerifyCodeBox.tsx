import React, { useCallback, useEffect, useContext } from 'react';

import MuiBox from '@mui/material/Box';
import MuiCircularProgress from '@mui/material/CircularProgress';
import MuiErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { useValue } from '../common/utility/Hook';
import { ajax } from '../util/Util';

import { AlertSnackbarContext } from './common/AlertSnackbar';

interface VerifyCodePictureBoxState {
	image?: string | null;
}

function VerifyCodeBox(props: {}) {
	const image = useValue(null as string | false | null);
	const alertSnackbar = useContext(AlertSnackbarContext);
	const eventRefresh = useCallback(() => {
		image.setValue(null);
		ajax('servlet/VerifyCode', 'generate', {
			width: 120,
			height: 48,
		}).then((resp) => {
			if (resp.data.status != undefined) {
				alertSnackbar.open('error', resp.data.status);
				image.setValue(false);
				return;
			}
			image.setValue(`data:image/jpeg;base64,${resp.data.data.data}`);
		}).catch((error) => {
			alertSnackbar.open('error', JSON.stringify(error));
			image.setValue(false);
		});
	}, [image.setValue]);
	useEffect(() => {
		eventRefresh();
	}, [eventRefresh]);
	return (
		<MuiBox
			boxShadow={8}
			width={'120px'} height={'48px'}
			display='flex' justifyContent='center' alignItems='center'
			onClick={eventRefresh}
		>
			{image.value == null ?
				<MuiCircularProgress size='36px' />
				:
				image.value == false ?
					<MuiErrorOutlineIcon />
					:
					<img src={image.value} style={{ height: '48px', objectFit: 'contain', objectPosition: 'center' }} />
			}
		</MuiBox>
	);
}

export { VerifyCodeBox };