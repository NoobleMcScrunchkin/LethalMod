function objectContains(obj: Record<string, unknown>, term: string): boolean {
	for (const key in obj) {
		if (typeof obj[key] === "string" && (obj[key] as string).toLowerCase().includes(term.toLowerCase().replace(/ /g, ""))) return true;
	}
	return false;
}

export { objectContains };
