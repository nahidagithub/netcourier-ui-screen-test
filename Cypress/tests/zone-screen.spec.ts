import {
  addZone,
  updateZone,
  placeZone,
  copyZone,
} from "cypress/fixtures/zone-screen.json";
import { slowCypressDown } from "cypress-slow-down";
import { format } from "date-fns";
import { contains } from "cypress/types/jquery";

slowCypressDown(Cypress.env("slowdownms"));

describe("Zone ScreenTests", () => {
  before("Loggin in", () => {
    cy.clearAllCookies();
    cy.session("authSession", () => {
      cy.visit("/netcourier-data");
      cy.login();
    });
  });

  describe(" TC 1 - Appearance of the Zone Screen ", () => {
    it("TC 1.1 - Check if login successful", () => {
      cy.visit("/app");
      cy.get("#godSearch", { timeout: 100000 }).should("be.visible");
    });

    it("TC 1.2 - Go to Zone screen", () => {
      cy.visit("/netcourier-data/geography/zone/");
      cy.handleEscalateRole(Cypress.env("passWord"));
      cy.url().should("include", "/netcourier-data/geography/zone/");
    });

    it("TC 1.3 - Checking for the following heading sections", () => {
      cy.get(".navbar-inner").within(() => {
        cy.get('input[placeholder="Search"]').should("exist");
        cy.contains("Add").should("exist");
        cy.contains("Update").should("exist");
        cy.contains("Confirm").should("exist");
        cy.contains("Cancel").should("exist");
        cy.contains("Actions").should("exist");
      });
    });

    /*
    it("TC 1.4 - Checking for the following sections", () => {
      cy.contains("#subnavscroll a", "Place Allocation").should("be.visible");

      cy.contains("#subnavscroll a", "Place Line").should("be.visible");

      cy.contains("a", "Audit trail").should("be.visible");
    });
*/
    it("TC 1.4 - Checking for the following section under Zone section", () => {
      cy.get("#name").should("be.visible");

      cy.get("#groupId").should("be.visible");

      cy.get("#zonetypes").should("be.visible");
      cy.get("#type1").should("be.visible");
      cy.get("#type2").should("be.visible");
      cy.get("#type3").should("be.visible");

      cy.get("#plot").should("be.visible");
    });
  });

  describe(" TC 2 - Add Zone", () => {
    context("Add zone ", () => {
      it("TC 2.1 - Verify required field validation error", () => {
        cy.visit("/netcourier-data/geography/zone");

        cy.get("#headerconfirmbutton").click();

        cy.get("body").contains("This field is required").should("be.visible");

        cy.get("body").contains("This field is required").should("be.visible");
      });

      it("TC 2.2 - System should show required validation error for Zone Group field", () => {
        cy.visit("/netcourier-data/geography/zone");

        cy.get("#name")
          .should("be.visible")
          .clear()
          .type(addZone[0].nameofzone);

        cy.get('#zonetypes input[type="radio"]').first().check();
        //cy.get('#plot').should('be.visible').click();

        cy.get("#headerconfirmbutton").click();

        //Assertion
        cy.contains("This field is required").should("be.visible");
      });

      it("TC 2.3 - System should show required validation error for Zone Name field", () => {
        cy.get("#groupId").should("be.visible").select(addZone[0].zoneGroup);

        cy.get("#name").should("be.visible").clear();

        cy.get("#headerconfirmbutton").click();

        //Assertion

        cy.get("#name")
          .closest("div")
          .find("span.error")
          .should("contain.text", "This field is required");
      });

      addZone.forEach((data) => {
        it("TC 2.4 - Verify zone will add the user successfully without checkbox", () => {
          cy.get("#name").should("be.visible").clear().type(data.nameofzone);

          cy.get("#groupId").should("be.visible").select(data.zoneGroup);

          //cy.get('#plot').should('be.visible').click()

          cy.get("#headerconfirmbutton").click();

          //Assertion

          cy.get("#name").should("have.value", data.nameofzone);

          cy.get("#groupId")
            .find("option:selected")
            .should("have.text", data.zoneGroup);

          cy.get('#zonetypes input[type="radio"]').first().should("be.checked");
        });

        it("TC 2.5 - Verify zone will add the user successfully", () => {
          cy.get('a.editmode[href="/netcourier-data/geography/zone/new"]')
            .should("be.visible")
            .click();

          cy.get("#name").should("be.visible").clear().type(data.nameofzone);

          cy.get("#groupId").should("be.visible").select(data.zoneGroup);

          cy.get('#zonetypes input[type="radio"]').first().check();

          cy.get("#plot").should("be.visible").click();

          cy.get("#headerconfirmbutton").click();

          //Assertion

          cy.get("#name").should("have.value", data.nameofzone);

          cy.get("#groupId")
            .find("option:selected")
            .should("have.text", data.zoneGroup);

          cy.get('#zonetypes input[type="radio"]').first().should("be.checked");

          cy.get("#plot").should("be.visible").check().should("be.checked");
        });

        it("TC 2.6 - Verify system shows alert when trying to add an existing zone", () => {
          cy.get('a.editmode[href="/netcourier-data/geography/zone/new"]')
            .should("be.visible")
            .click();

          cy.get("#name").should("be.visible").clear().type(data.nameofzone);

          cy.get("#groupId").should("be.visible").select(data.zoneGroup);

          cy.get('#zonetypes input[type="radio"]').first().check();

          cy.get("#plot").should("be.visible").click();

          cy.get("#headerconfirmbutton").click();

          //Assertion

          cy.contains(
            "The following error has occurred:Zone name already in use"
          ).should("be.visible");
        });
      });
    });
  });

  describe("TC 3 - Update Zone", () => {
    updateZone.forEach((data) => {
      context(`Update and save user actions for ${data.userZone1}`, () => {
        it("TC 3.1 - Open Previously added zone", () => {
          cy.visit("/netcourier-data/geography/zone");
          cy.handleEscalateRole(`user.password`);

          cy.intercept("GET", /\/netcourier-data\/search\/zone\/.*/).as(
            "searchUser"
          );

          cy.get(".navbar-search > .typeahead").type(data.userZone1);

          cy.wait("@searchUser").then((interception) => {
            expect(interception.response).to.not.be.undefined;
            if (interception.response) {
              const userId = interception.response.body[0]?.key;
              Cypress.env("userId", userId);
              cy.visit(`/netcourier-data/geography/zone/${userId}`);
            }
          });
        });

        it("TC 3.2 - Verify update button with required field", () => {
          cy.get("#updatebutton").should("be.visible");
          cy.get("#updatebutton").click();

          cy.get("#name").should("be.visible").clear().type(data.updatename);

          // Update Zone group

          cy.get("#groupId").should("be.visible").select(data.updatezngroup);

          cy.get('#zonetypes input[type="radio"]').first().check();

          cy.get("#headerconfirmbutton").click();

          //Assertion

          cy.get("#name").should("have.value", data.updatename);

          cy.get("#groupId")
            .find("option:selected")
            .should("have.text", data.updatezngroup);

          cy.get('#zonetypes input[type="radio"]').first().should("be.checked");
        });
      });
    });
  });

  describe("TC 4 - Copy Zone", () => {
    copyZone.forEach((data) => {
      context(`Copy and save user actions for ${data.nameofzone}`, () => {
        it("TC 4.1 - Open previously added zone", () => {
          cy.visit("/netcourier-data/geography/zone");
          cy.handleEscalateRole(`user.password`);

          cy.intercept("GET", /\/netcourier-data\/search\/zone\/.*/).as(
            "searchUser"
          );

          cy.get(".navbar-search > .typeahead").type(data.nameofzone);

          cy.wait("@searchUser").then((interception) => {
            expect(interception.response).to.not.be.undefined;
            if (interception.response) {
              const userId = interception.response.body[0]?.key;
              Cypress.env("userId", userId);
              cy.visit(`/netcourier-data/geography/zone/${userId}`);
            }
          });
        });

        it("TC 4.2 - Click copy button", () => {
          cy.get("#copybutton").should("be.visible").click();

          cy.get('#zonetypes input[type="radio"]').first().check();

          cy.get("#plot").should("be.visible").click();

          //Assertion

          cy.get("#name").should("have.value", `Copy of ${data.nameofzone}`);

          cy.get('#zonetypes input[type="radio"]:checked').should(
            "have.attr",
            "id",
            "type1"
          );

          cy.get("#groupId")
            .find("option:selected")
            .should("have.text", data.zoneGroup);
        });

        it("TC 4.3 - Try to save copied zone ", () => {
          cy.get("#headerconfirmbutton").should("be.visible").click();

          //Assertion
          cy.get("#name").should("have.value", `Copy of ${data.nameofzone}`);

          cy.get('#zonetypes input[type="radio"]:checked').should(
            "have.attr",
            "id",
            "type1"
          );

          cy.get('#zonetypes input[type="radio"]').first().should("be.checked");

          cy.get("#groupId")
            .find("option:selected")
            .should("have.text", data.zoneGroup);
        });
      });
    });
  });

  describe("TC 5 - Archieve Zone", () => {
    addZone.forEach((data) => {
      context(`Archive zone actions for ${data.nameofzone}`, () => {
        it(" TC 5.1 - Open previously added zone", () => {
          cy.visit("/netcourier-data/geography/zone");
          cy.handleEscalateRole(`user.password`);

          cy.intercept("GET", /\/netcourier-data\/search\/zone\/.*/).as(
            "searchUser"
          );

          cy.get(".navbar-search > .typeahead").type(data.nameofzone);

          cy.wait("@searchUser").then((interception) => {
            expect(interception.response).to.not.be.undefined;
            if (interception.response) {
              const userId = interception.response.body[0]?.key;
              Cypress.env("userId", userId);
              cy.visit(`/netcourier-data/geography/zone/${userId}`);
            }
          });
        });

        it("TC 5.2 - Verify zone will be archieved", () => {
          cy.get("#archivebutton")
            .should("be.visible")
            .and("not.be.disabled")
            .click();

          //Assertion

          cy.get("#zone-row-10008304").should("not.exist");
        });

        it("TC 5.3 - Verify zone will be restored ", () => {
          cy.get("#restorebutton").should("be.visible").click();

          //Assertion
          cy.get("#name").should("have.value", data.nameofzone);
          cy.get('#zonetypes input[type="radio"]').first().should("be.checked");
        });
      });
    });
  });

  describe("TC 6 - Appearance of Place allocated section", () => {
    addZone.forEach((data) => {
      it(" TC 6.1 - Open previously added zone", () => {
        cy.visit("/netcourier-data/geography/zone");
        cy.handleEscalateRole(`user.password`);

        cy.intercept("GET", /\/netcourier-data\/search\/zone\/.*/).as(
          "searchUser"
        );

        cy.get(".navbar-search > .typeahead").type(data.nameofzone);

        cy.wait("@searchUser").then((interception) => {
          expect(interception.response).to.not.be.undefined;
          if (interception.response) {
            const userId = interception.response.body[0]?.key;
            Cypress.env("userId", userId);
            cy.visit(`/netcourier-data/geography/zone/${userId}`);
          }
        });
      });

      it(" TC 6.2 - Verify place allocated section is visible ", () => {
        cy.contains("#subnavscroll a", "Place Allocation").should("be.visible");
      });

      it("TC 6.3 -Verify the following columns under place allocated section", () => {
        cy.get("table thead tr th").eq(0).should("contain.text", "Place name");
        cy.get("table thead tr th")
          .eq(1)
          .should("contain.text", "Alternative name");
        cy.get("table thead tr th")
          .eq(2)
          .should("contain.text", "Country name");
        cy.get("table thead tr th")
          .eq(3)
          .should("contain.text", "Country code");
      });

      it("TC 6.4 -Verify add button and filter field button visible", () => {
        cy.get('button[data-target="#modalcontainer"][title="Add"]').should(
          "be.visible"
        );

        cy.contains("span", "Filter returned records:")
          .should("be.visible")
          .parent()
          .find("input")
          .should("be.visible")
          .and("have.attr", "type", "search");
      });

      it("TC 6.5 - Verify delete button visible before each place", () => {
        cy.get("#data_loaded_table tbody tr")
          .should("have.length.greaterThan", 0)
          .each(($row) => {
            cy.wrap($row)
              .find('button.confirm-delete[title="Delete"]')
              .should("be.visible");
          });
      });
    });
  });

  describe("TC 7 - Functionality of Place allocated section", () => {
    addZone.forEach((data) => {
      it(" TC 7.1 - Open previously added zone and click add button", () => {
        cy.visit("/netcourier-data/geography/zone");
        cy.handleEscalateRole(`user.password`);

        cy.intercept("GET", /\/netcourier-data\/search\/zone\/.*/).as(
          "searchUser"
        );

        cy.get(".navbar-search > .typeahead").type(data.nameofzone);

        cy.wait("@searchUser").then((interception) => {
          expect(interception.response).to.not.be.undefined;
          if (interception.response) {
            const userId = interception.response.body[0]?.key;
            Cypress.env("userId", userId);
            cy.visit(`/netcourier-data/geography/zone/${userId}`);

            cy.get("#name").should("contain", data.nameofzone);
          }
        });
      });

      it("TC 7.2 - Verify popup modal open", () => {
        cy.get("#updatebutton")
          .should("be.visible")
          .and("not.be.disabled")
          .click();

        cy.get('button[data-target="#modalcontainer"][title="Add"]')
          .should("be.visible")

          .click();

        cy.get("#modalcontainer .modal-body").should("be.visible");
      });

      it(" TC 7.3 - Verify the popup model with required field", () => {
        cy.get("#zonesearch").should("be.visible");

        cy.get("#savechanges").should("be.visible");

        cy.contains("button", "Close").should("be.visible");
      });

      it(" TC 7.4- Verify required validation errors ", () => {
        cy.get("#savechanges").click();

        cy.get("div.control-group").should(
          "contain.text",
          "This field is required"
        );
      });

      it("TC 7.5 - Verify new place is added", () => {
        cy.get("#zonesearch").type(data.searchname);

        cy.get(".ui-autocomplete")
          .should("be.visible")
          .contains("div.col.cell0", data.searchname)
          .click();

        // Press Enter to confirm the selection
        cy.get("#zonesearch").type("{enter}");

        cy.get("#savechanges")
          .should("be.visible")
          .should("be.enabled")
          .click();

        // Assertion
        cy.get("#data_loaded_table tbody").should(
          "contain.text",
          data.searchname
        );
      });

      it(" TC 7.6 -  Close modal and verify it disappears", () => {
        cy.contains("button", "Close").should("be.visible").click();

        cy.get("#placeallocation-section").should("not.be.visible");
      });

      placeZone.forEach((data) => {
        it("TC 7.7 - should show place and verify row values", () => {
          cy.get('td[data-headerdetails="Place name"]').should(
            "include.text",
            data.placename
          );

          cy.get('td[data-headerdetails="Alternative name"]').should(
            "include.text",
            data.altname
          );

          cy.get('td[data-headerdetails="Country name"]').should(
            "include.text",
            data.countryname
          );

          cy.get('td[data-headerdetails="Country code"]').should(
            "include.text",
            data.countrycode
          );
        });

        it("TC 7.8 - should delete the place and verify it disappears", () => {
          cy.get("#data_loaded_table > tbody > tr")
            .contains("td", data.placename)
            .parent("tr")
            .within(() => {
              cy.get('button.confirm-delete[title="Delete"]').click();
            });

          // Assertion
          cy.get("#data_loaded_table > tbody")
            .should("be.visible")
            .should("not.contain", data.placename);
        });
      });

      it("TC 7.9 - Verify filtered record", () => {
        cy.contains("span", "Filter returned records:")
          .should("be.visible")
          .parent()
          .find('input[type="search"]')
          .should("be.visible")
          .clear()
          .type(data.filteredrecord);

        // Assertion
        cy.get("#data_loaded_table > tbody > tr:visible").each(($row) => {
          cy.wrap($row)
            .invoke("text")
            .then((text) => {
              expect(text.toLowerCase()).to.include(
                data.filteredrecord.toLowerCase()
              );
            });
        });
      });
    });
  });
});

after("Logging out", () => {
  cy.visit("/app");
  cy.get(".account-user-name").click();
  cy.get('a[href="/app/account/logout"]').click();
});

