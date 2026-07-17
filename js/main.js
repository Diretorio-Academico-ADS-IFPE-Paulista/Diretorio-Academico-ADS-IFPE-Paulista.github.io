document.addEventListener('DOMContentLoaded', async () => {
	const includeElements = document.querySelectorAll('[data-include]');

	await Promise.all(
		Array.from(includeElements).map(async (element) => {
			const includePath = element.getAttribute('data-include');

			if (!includePath) {
				return;
			}

			try {
				const response = await fetch(includePath);

				if (!response.ok) {
					throw new Error(`Falha ao carregar ${includePath}: ${response.status}`);
				}

				element.outerHTML = await response.text();
			} catch (error) {
				console.error(error);
			}
		})
	);

	const currentPage = window.location.pathname.split('/').pop() || 'index.html';

	document.querySelectorAll('[data-nav-link]').forEach((link) => {
		const linkPage = link.getAttribute('href');

		if (linkPage === currentPage) {
			link.classList.add('active');
			link.setAttribute('aria-current', 'page');
		}
	});
});
