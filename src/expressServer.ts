import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";

const app: Express = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Basic route
app.get("/", (req: Request, res: Response) => {
	res.json({ message: "Server is running" });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).json({ error: "Something went wrong!" });
});

// Start server with port checking
const startServer = async (initialPort: number): Promise<number> => {
	let currentPort = initialPort;

	const tryPort = (port: number): Promise<boolean> => {
		return new Promise((resolve) => {
			const server = app
				.listen(port)
				.once("listening", () => {
					server.close();
					resolve(true);
				})
				.once("error", (err: any) => {
					if (err.code === "EADDRINUSE") {
						resolve(false);
					}
				});
		});
	};

	while (true) {
		const isPortAvailable = await tryPort(currentPort);
		if (isPortAvailable) {
			app.listen(currentPort, () => {
				console.log(`Server is running on port ${currentPort}`);
			});
			break;
		} else {
			console.log(`Port ${currentPort} is in use, trying ${currentPort + 1}`);
			currentPort++;
		}
	}

	return currentPort;
};

export { startServer };
