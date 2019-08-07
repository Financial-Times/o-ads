const perfmarks = [];

export const mark = markName => {
	perfmarks.push({
		type: 'mark',
		name: markName,
		startTime: (new Date()).getMilliseconds()
	});
};

export const getEntriesByType = type => {
	const marks = perfmarks.filter( m => m.type === type );
	return marks;
};

export const getEntriesByName = name => {
	const marks = perfmarks.filter( m => m.name === name );
	return marks;
};
