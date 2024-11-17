class VSCodeAPIWrapper {
    private readonly vscode: any;
    private static instance: VSCodeAPIWrapper;

    private constructor() {
        // @ts-ignore
        this.vscode = window.acquireVsCodeApi();
    }

    public static getInstance(): VSCodeAPIWrapper {
        if (!VSCodeAPIWrapper.instance) {
            VSCodeAPIWrapper.instance = new VSCodeAPIWrapper();
        }
        return VSCodeAPIWrapper.instance;
    }

    public postMessage(message: any) {
        this.vscode.postMessage(message);
    }

    public getState(): any {
        return this.vscode.getState();
    }

    public setState(state: any) {
        this.vscode.setState(state);
    }
}

export const vscode = VSCodeAPIWrapper.getInstance(); 