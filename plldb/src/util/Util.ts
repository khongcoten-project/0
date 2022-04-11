import axios, { CancelToken as AxiosCancelToken } from 'axios';
import Qs from 'qs';

axios.defaults.withCredentials = true;

export type { CookiesStatic as Cookies } from 'js-cookie';

export function isWidthWindow() {
	return document.body.clientWidth > document.body.clientHeight;
}

export function isAfterDate(originDate: string, targetDate: string) {
	return new Date(targetDate) > new Date(originDate);
}

export const AxiosCancelTokenStatic = axios.CancelToken;

export function ajax(path: string, servletMethod: string, servletData: object, cancelToken?: AxiosCancelToken) {
	return axios({
		//baseURL: 'https://localhost:8443/plldb-server/',
		baseURL: 'https://twincest.cn/plldb-server/',
		url: path,
		method: 'POST',
		responseType: 'json',
		data: {
			parameter: JSON.stringify({
				method: servletMethod,
				data: servletData
			})
		},
		transformRequest: [(data, headers) => {
			return Qs.stringify(data);
		}],
		withCredentials: true,
		cancelToken: cancelToken
	});
}
