/// <reference types="cypress" />
export {}; // Ensures this file is treated as a module

declare global {
	namespace Cypress {
		interface Chainable<Subject = any> {
			login(): Chainable<void>;
			visitAndSyncCookies(url: string): Chainable<void>;
			handleEscalateRole(password: string): Chainable<void>;
		}
	}
}

