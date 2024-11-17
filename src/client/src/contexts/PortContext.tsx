import { createContext, useContext, ReactNode, useState } from "react";

interface PortContextType {
	port: number | null;
	setPort: (port: number | null) => void;
}

const PortContext = createContext<PortContextType | undefined>(undefined);

export function usePort() {
	const context = useContext(PortContext);
	if (context === undefined) {
		throw new Error("usePort must be used within a PortProvider");
	}
	return context;
}

interface PortProviderProps {
	children: ReactNode;
}

export function PortProvider({ children }: PortProviderProps) {
	const [port, setPort] = useState<number | null>(null);

	return <PortContext.Provider value={{ port, setPort }}>{children}</PortContext.Provider>;
}
