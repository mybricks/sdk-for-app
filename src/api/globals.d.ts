// @ts-ignore
declare module globalThis {
	var emitGlobalEvent: (path: string, method: string, params: Record<string, unknown>) => Promise<any>;
}