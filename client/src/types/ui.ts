import { Nullable } from 'tsdef';

export interface UserInterface {
	theme: 'light' | 'dark'
	alert: Nullable<Alert>
}

export interface Alert {
	type: AlertType
	message: string
}

export enum AlertType {
	INFO  = 'INFO',
	WARN  = 'WARN',
	ERROR = 'ERROR'
}