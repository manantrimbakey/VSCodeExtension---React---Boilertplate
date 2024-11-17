// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

class WebviewManager {
	private static instance: WebviewManager;
	private panel: vscode.WebviewPanel | undefined;
	private readonly extensionUri: vscode.Uri;

	private constructor(extensionUri: vscode.Uri) {
		this.extensionUri = extensionUri;
	}

	static getInstance(extensionUri: vscode.Uri): WebviewManager {
		if (!WebviewManager.instance) {
			WebviewManager.instance = new WebviewManager(extensionUri);
		}
		return WebviewManager.instance;
	}

	private getWebviewContent(webview: vscode.Webview): string {
		const distPathOnDisk = vscode.Uri.joinPath(this.extensionUri, 'dist', 'client');
		const baseUri = webview.asWebviewUri(distPathOnDisk);
		
		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>React App</title>
				<base href="${baseUri}/">
			</head>
			<body>
				<div id="root"></div>
				<script type="module" src="${baseUri}/assets/index.js"></script>
				<link rel="stylesheet" href="${baseUri}/assets/index.css">
			</body>
			</html>`;
	}

	public showWebview() {
		if (this.panel) {
			// If panel exists, show it
			this.panel.reveal(vscode.ViewColumn.One);
			return;
		}

		// Create new panel
		this.panel = vscode.window.createWebviewPanel(
			'reactWebview',
			'React Webview',
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				retainContextWhenHidden: true, // Keep the webview state when hidden
				localResourceRoots: [
					vscode.Uri.joinPath(this.extensionUri, 'dist', 'client'),
					vscode.Uri.joinPath(this.extensionUri, 'dist')
				]
			}
		);

		// Set initial HTML content
		this.panel.webview.html = this.getWebviewContent(this.panel.webview);

		// Handle messages from webview
		this.panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'alert':
						vscode.window.showInformationMessage(message.text);
						return;
					// Add more message handlers here
				}
			}
		);

		// Reset panel reference when panel is disposed
		this.panel.onDidDispose(
			() => {
				this.panel = undefined;
			}
		);
	}

	public postMessageToWebview(message: any) {
		if (this.panel) {
			this.panel.webview.postMessage(message);
		}
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Extension "test-extension" is now active!');

	const webviewManager = WebviewManager.getInstance(context.extensionUri);

	let disposable = vscode.commands.registerCommand('test-extension.openWebview', () => {
		webviewManager.showWebview();
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
