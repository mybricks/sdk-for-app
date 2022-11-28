export const getCookies = () => {
	return document.cookie.split('; ').reduce((s, e) => {
		const p = e.indexOf('=');
		s[e.slice(0, p)] = e.slice(p + 1);
		return s;
	}, {});
};