import * as vscode from 'vscode';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class ExtensionLogger {
    private static instance: ExtensionLogger;
    private outputChannel: vscode.OutputChannel;
    private isDevelopment: boolean;

    private constructor() {
        this.outputChannel = vscode.window.createOutputChannel('Salesforce Debug Logs');
        // Check if we're in development mode by checking if debugMode is true in workspace configuration
        this.isDevelopment = vscode.workspace.getConfiguration().get('salesforce-debug-logs-viewer.debugMode', false);
    }

    static getInstance(): ExtensionLogger {
        if (!ExtensionLogger.instance) {
            ExtensionLogger.instance = new ExtensionLogger();
        }
        return ExtensionLogger.instance;
    }

    private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
        const timestamp = new Date().toISOString();
        let formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        
        if (args.length > 0) {
            formattedMessage += '\n' + args
                .map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg)
                .join('\n');
        }
        
        return formattedMessage;
    }

    debug(message: string, ...args: any[]): void {
        if (this.isDevelopment) {
            const formattedMessage = this.formatMessage('debug', message, ...args);
            console.debug(formattedMessage);
            this.outputChannel.appendLine(formattedMessage);
        }
    }

    info(message: string, ...args: any[]): void {
        const formattedMessage = this.formatMessage('info', message, ...args);
        console.info(formattedMessage);
        this.outputChannel.appendLine(formattedMessage);
    }

    warn(message: string, ...args: any[]): void {
        if (this.isDevelopment) {
            const formattedMessage = this.formatMessage('warn', message, ...args);
            console.warn(formattedMessage);
            this.outputChannel.appendLine(formattedMessage);
        }
    }

    error(message: string, ...args: any[]): void {
        const formattedMessage = this.formatMessage('error', message, ...args);
        console.error(formattedMessage);
        this.outputChannel.appendLine(formattedMessage);
        // Show error message in VS Code UI
        vscode.window.showErrorMessage(message);
    }

    // Method to show the output channel
    show(): void {
        this.outputChannel.show();
    }

    // Method to dispose of the output channel
    dispose(): void {
        this.outputChannel.dispose();
    }
}

export const logger = ExtensionLogger.getInstance(); 