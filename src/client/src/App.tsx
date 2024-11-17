import { useEffect, useState, useCallback, memo } from "react";
import { vscode } from "./vscode";
import "./App.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { logger } from "./utils/logger";
import { usePort } from "./contexts/PortContext";
import { Typography } from "@mui/material";

const App = memo(() => {
	const [state, setState] = useState(() => vscode.getState() || { count: 0 });
	const { port, setPort } = usePort();

	const messageHandler = useCallback(
		(event: MessageEvent) => {
			const message = event.data;
			switch (message.command) {
				case "serverPort":
					logger.info("Setting port to:", message.serverPort);
					setPort(message.serverPort);
					break;
				case "update":
					logger.debug("Update message received", message);
					break;
				default:
					break;
			}
		},
		[setPort]
	);

	useEffect(() => {
		logger.info("Initializing message handler");
		window.addEventListener("message", messageHandler);
		vscode.postMessage({ command: "getServerPort" });

		return () => {
			logger.debug("Cleaning up message handler");
			window.removeEventListener("message", messageHandler);
		};
	}, [messageHandler]);

	const handleButtonClick = useCallback(() => {
		setState((prevState: any) => {
			const newCount = prevState.count + 1;
			vscode.setState({ count: newCount });
			logger.debug("Incrementing count", { newCount });
			vscode.postMessage({
				command: "alert",
				text: `Count is now ${newCount}`,
			});
			return { count: newCount };
		});
	}, []);

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
			<Typography variant="body1">
				Port Status: {port === null ? "Not Connected" : `Connected on port ${port}`}
			</Typography>
		</div>
	);
});

export default App;
