function generateBalancedDomTree(numElements: number) {
	let html = '';
	for (let i = 0; i < numElements; i++) {
		if (i === numElements - 1) {
			html += `<div id="last-div">👉🏽 This is the last of ${numElements} divs.</div>`;
		} else {
			html += `<div></div>`;
		}
	}
	return html;
}

function generateUnbalancedDomTree(numElements: number) {
	function createElement(remaining: number): string {
		if (remaining === 0) return `<div id="last-div">👉🏽 This is the last of ${numElements} divs.</div>`;

		return `<div>${createElement(remaining - 1)}</div>`;
	}

	return createElement(numElements);
}

function generateStyleTag() {
	return `
		<style>
			div {
				padding: 10px 0;
			}
		</style>
	`;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const numElements = parseInt(url.searchParams.get('elements') || '') || 1_000;
		const isNested = url.searchParams.get('nested') === 'true';
		const withCSS = url.searchParams.get('css') === 'true';

		const html = `

		<h1>DOM Depth Test</h1>
		<p>DOM Elements: ${numElements}</p>
		<p>DOM Depth: ${isNested ? numElements : 1}</p>
		${isNested ? generateUnbalancedDomTree(numElements) : generateBalancedDomTree(numElements)}
		${withCSS ? generateStyleTag() : ''}
		`;

		return new Response(html, {
			headers: {
				'content-type': 'text/html;charset=UTF-8',
			},
		});
	},
};
