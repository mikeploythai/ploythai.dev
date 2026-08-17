export const getCurrentMonth = () => {
	const now = new Date();

	return {
		start: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)),
		end: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1) - 1),
	};
};
