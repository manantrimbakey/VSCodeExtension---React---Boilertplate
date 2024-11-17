// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
	// Get path to dist folder
	const distPathOnDisk = vscode.Uri.joinPath(extensionUri, 'dist', 'client');
	
	// Get path to index.html file from dist folder
	const htmlPathOnDisk = vscode.Uri.joinPath(distPathOnDisk, 'index.html');
	const cssPathOnDisk = vscode.Uri.joinPath(distPathOnDisk, 'assets', 'index.css');
	
	// And get the special URI to use with the webview
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

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Extension "test-extension" is now active!');

	let currentPanel: vscode.WebviewPanel | undefined = undefined;

	const disposable = vscode.commands.registerCommand('test-extension.openWebview', () => {
		// If we already have a panel, show it
		if (currentPanel) {
			currentPanel.reveal(vscode.ViewColumn.One);
			return;
		}

		// Otherwise, create a new panel
		currentPanel = vscode.window.createWebviewPanel(
			'reactWebview',
			'React Webview',
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				localResourceRoots: [
					vscode.Uri.joinPath(context.extensionUri, 'dist', 'client'),
					vscode.Uri.joinPath(context.extensionUri, 'dist')
				],
				portMapping: [
					{
						webviewPort: 3000,
						extensionHostPort: 3000
					}
				]
			}
		);

		// Set the webview's HTML content
		currentPanel.webview.html = getWebviewContent(currentPanel.webview, context.extensionUri);

		// Reset when the current panel is closed
		currentPanel.onDidDispose(
			() => {
				currentPanel = undefined;
			},
			null,
			context.subscriptions
		);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
