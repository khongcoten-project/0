export enum SubpageType {
	About,
	Find,
	Create,
}

export function getNameOfSubpageType(value: SubpageType) {
	switch (value) {
		default:
			return '';
		case SubpageType.About:
			return '关于';
		case SubpageType.Find:
			return '搜索';
		case SubpageType.Create:
			return '记录';
	}
}

export const setOfSubpageType = [
	SubpageType.About,
	SubpageType.Find,
	SubpageType.Create,
];
