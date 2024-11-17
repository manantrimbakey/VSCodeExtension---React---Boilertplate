type LogLevel = "debug" | "info" | "warn" | "error";

type LogStyles = {
	[key in LogLevel]: string;
};

class Logger {
	private static instance: Logger;
	private isDevelopment: boolean;
	private logStyles: LogStyles = {
		debug: "background: #F3F3F3; color: #4A4A4A; padding: 2px 5px; border-radius: 2px;",
		info: "background: #E3F2FD; color: #0D47A1; padding: 2px 5px; border-radius: 2px;",
		warn: "background: #FFF3E0; color: #E65100; padding: 2px 5px; border-radius: 2px;",
		error: "background: #FFEBEE; color: #C62828; padding: 2px 5px; border-radius: 2px;",
	};

	private constructor() {
		// Check if we're in development mode
		this.isDevelopment = import.meta.env.DEV;
	}

	static getInstance(): Logger {
		if (!Logger.instance) {
			Logger.instance = new Logger();
		}
		return Logger.instance;
	}

	private formatMessage(level: LogLevel, message: string): string {
		const timestamp = new Date().toISOString();
		return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
	}

	debug(message: string, ...args: any[]): void {
		if (this.isDevelopment) {
			console.debug(
				`%c${this.formatMessage("debug", message)}`,
				this.logStyles.debug,
				...args
			);
		}
	}

	info(message: string, ...args: any[]): void {
		// Info level is allowed in both development and production
		console.info(
			`%c${this.formatMessage("info", message)}`,
			this.logStyles.info,
			...args
		);
	}

	warn(message: string, ...args: any[]): void {
		if (this.isDevelopment) {
			console.warn(
				`%c${this.formatMessage("warn", message)}`,
				this.logStyles.warn,
				...args
			);
		}
	}

	error(message: string, ...args: any[]): void {
		if (this.isDevelopment) {
			console.error(
				`%c${this.formatMessage("error", message)}`,
				this.logStyles.error,
				...args
			);
		}
	}
}

export const logger = Logger.getInstance();
