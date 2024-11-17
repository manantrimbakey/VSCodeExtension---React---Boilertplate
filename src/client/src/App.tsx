import { useEffect, useState } from "react";
import { vscode } from "./vscode";
import "./App.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { logger } from "./utils/logger";

function App() {
	const [state, setState] = useState(vscode.getState() || { count: 0 });
	const [port, setPort] = useState<number | null>(null);

	useEffect(() => {
		// Handle messages from extension
		const messageHandler = (event: MessageEvent) => {
			const message = event.data;
			switch (message.command) {
				case "serverPort":
					setPort(message.serverPort);
					logger.info("Server port received", message.serverPort);
					break;
				case "update":
					logger.debug("Update message received", message);
					break;
				// Add more message handlers here
			}
		};

		logger.info("Initializing message handler");
		window.addEventListener("message", messageHandler);

		return () => {
			logger.debug("Cleaning up message handler");
			window.removeEventListener("message", messageHandler);
		};
	}, []);

	// Example of sending message to extension
	const handleButtonClick = () => {
		const newCount = state.count + 1;
		setState({ count: newCount });
		vscode.setState({ count: newCount }); // Persist state
		logger.debug("Incrementing count", { newCount });
		vscode.postMessage({
			command: "alert",
			text: `Count is now ${newCount}`,
		});
	};

	return (
		<div>
			<h1>VSCode Webview React App</h1>
			<p>Count: {state.count}</p>
			<button onClick={handleButtonClick}>Increment and Send Message</button>
			<div>
				<a href="https://vite.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
		</div>
	);
}

export default App;
