import * as vscode from "vscode";
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
		const distPathOnDisk = vscode.Uri.joinPath(this.extensionUri, "dist", "client");
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

	public showWebview({ port }: { port: number }) {
		if (this.panel) {
			// If panel exists, show it
			this.panel.reveal(vscode.ViewColumn.One);

			return;
		}

		// Create new panel
		this.panel = vscode.window.createWebviewPanel("reactWebview", "React Webview", vscode.ViewColumn.One, {
			enableScripts: true,
			retainContextWhenHidden: true, // Keep the webview state when hidden
			localResourceRoots: [
				vscode.Uri.joinPath(this.extensionUri, "dist", "client"),
				vscode.Uri.joinPath(this.extensionUri, "dist"),
			],
			portMapping: [{ webviewPort: port, extensionHostPort: port }],
			enableForms: true,
		});

		// Set initial HTML content
		this.panel.webview.html = this.getWebviewContent(this.panel.webview);
		this.panel.webview.postMessage({ command: "serverPort", serverPort: port });

		// Handle messages from webview
		this.panel.webview.onDidReceiveMessage((message) => {
			switch (message.command) {
				case "alert":
					vscode.window.showInformationMessage(message.text);
					return;
				// Add more message handlers here
			}
		});

		// Reset panel reference when panel is disposed
		this.panel.onDidDispose(() => {
			this.panel = undefined;
		});
	}

	public postMessageToWebview(message: any) {
		if (this.panel) {
			this.panel.webview.postMessage(message);
		}
	}
}

export default WebviewManager;
