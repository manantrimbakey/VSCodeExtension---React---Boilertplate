import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { logger } from "./utils/logger";

const app: Express = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Store the server instance
let server: ReturnType<typeof app.listen>;

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
			const testServer = app
				.listen(port)
				.once("listening", () => {
					testServer.close();
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
			server = app.listen(currentPort, () => {
				logger.info(`Server is running on port ${currentPort}`);
			});
			break;
		} else {
			logger.info(`Port ${currentPort} is in use, trying ${currentPort + 1}`);
			currentPort++;
		}
	}

	return currentPort;
};

// Add shutdown function
const shutdownServer = async (): Promise<void> => {
	return new Promise((resolve, reject) => {
		if (!server) {
			resolve();
			return;
		}

		server.close((err) => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
	});
};

export { startServer, shutdownServer };
