// cypress/support/auth-commands.ts

Cypress.Commands.add('login', () => {
	cy.get('#access_code').type(Cypress.env('accessCode'));
	cy.get('#login').type(Cypress.env('userName'));
	cy.get('#j_password').type(Cypress.env('passWord'));

	cy.get('form#mainform button[type="submit"]').click();
});

/// <reference types="cypress" />

Cypress.Commands.add('visitAndSyncCookies', (url: string) => {
	cy
		.request({
			url,
			failOnStatusCode: false,
		})
		.then((response) => {
			const setCookieHeader = response.headers['set-cookie'];

			const cookies: string[] = Array.isArray(setCookieHeader) ? setCookieHeader : typeof setCookieHeader === 'string' ? [setCookieHeader] : [];

			cookies.forEach((cookieStr) => {
				const nameValueMatch = cookieStr.match(/^([^=]+)=([^;]+)/);
				const pathMatch = cookieStr.match(/;\s*Path=([^;]+)/i);

				if (nameValueMatch) {
					const name = nameValueMatch[1];
					const value = nameValueMatch[2];
					const path = pathMatch ? pathMatch[1] : '/';

					// Clear existing cookie with same name (path-agnostic)
					cy.clearCookie(name).then(() => {
						// Set the new cookie with value and path
						cy.setCookie(name, value, { path });
					});
				}
			});

			cy.visit(url);
		});
});

Cypress.Commands.add('handleEscalateRole', (password: string) => {
	cy.url().then((url) => {
		if (url.toLowerCase().includes('escalaterole')) {
			cy.get('#password').type(password);
			cy.get('#confirmBtn').click();
		}
	});
});

