export interface User {
	id: string;
	name: string;
	password: string;
	email: string | null;
	editor: boolean;
	checker: boolean;
	locked: boolean;
	registerDate: string;
	loginDate: string;
}
