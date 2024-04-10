/* eslint-disable no-mixed-spaces-and-tabs */
export type TryCatchReturnType<T> =
	| {
			success: false;
			error: Error;
	  }
	| {
			success: true;
			result: T;
	  };

async function tryCatch<T>(func: () => Promise<T>): Promise<TryCatchReturnType<T>> {
	try {
		const result = await func();
		return { result, success: true };
	} catch (e) {
		return { error: e, success: false };
	}
}

export { tryCatch };
