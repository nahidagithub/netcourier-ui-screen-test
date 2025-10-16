import {
  appearance,
  addUser,
  updateUser,
  copyUser,
  archiveUser,
  vehicleSectionAppearance,
  vehicleSectionFunctionality,
  taskSectionAppearance,
  taskSectionFunctionality,
  userTocheckAPIKeyField,
  scheduleDeductionSectionAppearance,
  scheduleDeductionSectionFunctionality,
} from "cypress/fixtures/user-screen.json";
import { slowCypressDown } from "cypress-slow-down";
import { format, addMinutes, addHours } from "date-fns";
import { contains } from "cypress/types/jquery";
import "cypress-mochawesome-reporter/register";
import { forEach } from "cypress/types/lodash";
import { any } from "cypress/types/bluebird";
import { should } from "chai";

slowCypressDown(Cypress.env("slowdownms"));

describe("User ScreenTests", () => {
  before("Loggin in", () => {
    cy.clearAllCookies();
    cy.session("authSession", () => {
      cy.visit("/netcourier-data");
      cy.login();
    });
  });

  describe("TC 1 - Appearance of the User Screen", () => {
    it("TC 1.1 - Check if login successful", () => {
      cy.visit("/app");
      cy.get("#godSearch", { timeout: 10000 }).should("be.visible");

      //store version id
      cy.get("#versioninfotext")
        .invoke("attr", "title")
        .then((titleText) => {
          let siteVersion: string;

          if (!titleText) {
            // fallback if title is missing
            siteVersion = "vUnknown";
          } else if (titleText.includes("SNAPSHOT")) {
            // Example: "Version 19-SNAPSHOT (19-SNAPSHOT-2025-10-08T05:16:48Z)"
            const match = titleText.match(/Version\s+(\d+)-SNAPSHOT/);
            siteVersion = match ? `v${match[1]}` : "vUnknown";
          } else {
            // Example: "Version 16.11 (16.11.1)"
            const match = titleText.match(/Version\s+([\d.]+)/);
            siteVersion = match ? `v${match[1]}` : "vUnknown";
          }
          cy.log(siteVersion);
          // Send to Node via task
          cy.task("setSiteVersion", siteVersion);
        });
    });

    it("TC 1.2 - Go to user screen", () => {
      cy.visit("/netcourier-data/system/user");
      cy.handleEscalateRole(Cypress.env("passWord"));
      cy.url().should("include", "netcourier-data/system/user");
    });

    it("TC 1.3 - Checking for the sections", () => {
      cy.get(".navbar-inner").within(() => {
        cy.get('input[placeholder="Search"]').should("exist");
        cy.contains("Update").should("exist");
        cy.contains("Confirm").should("exist");
        cy.contains("Cancel").should("exist");
        cy.contains("Actions").should("exist");
      });

      cy.get("#subnavscroll")
        .should("contain", "User")
        .should("contain", "Tasks");

      cy.get("#user-section").should("exist");
      cy.get("#driver").should("exist");
      cy.get("#divTasksList").should("exist");
    });

    it("TC 1.4 - Check for fields under user section", () => {
      cy.get("#user-section").within(() => {
        cy.get("#name").should("be.visible");
        cy.get("#userCode").should("be.visible");
        cy.get("#password").should("be.visible");
        cy.get("#mobile").should("be.visible");
        cy.get("#email").should("be.visible");
        cy.get("#officePhone").should("be.visible");
        cy.get("#extension").should("be.visible");
        cy.get("#homePhone").should("be.visible");
        cy.get("#supplierSearch").should("be.visible");
        cy.get("#productId").should("be.visible");
        cy.get("#displayRecordNo").should("be.visible");
        cy.get("#language").should("be.visible");

        cy.contains(".control-group", "User type").within(() => {
          cy.get("label.radio").should("have.length", 3);
          cy.contains("label.radio", "Standard");
          cy.contains("label.radio", "Handheld");
          cy.contains("label.radio", "Both standard and handheld");
        });
      });
    });

    it("TC 1.5 - Check for fields under driver section", () => {
      cy.get("section#driver").within(() => {
        cy.get("#taxStatus").should("exist");
        cy.get('input#invoiceEmail[type="text"]').should("exist");
        cy.get("#invoiceTemplate").should("exist");
        cy.get("#weightUnit").should("exist");
        cy.get("#lengthUnit").should("exist");
        cy.get("#distanceUnit").should("exist");
        cy.get('#currencySearch[type="text"]').should("exist");
      });
    });
    it("TC 1.6 - Check handheld user dropdown", () => {
      cy.get("#handheldUserType").should("not.be.visible");
      cy.get('input[name="type"][value="H"]').click();
      cy.get("#handheldUserType").should("be.visible");
    });
    it("TC 1.7 - Check for the handheld user type dropdown option", () => {
      cy.get("#handheldUserType").should("be.visible");
      const expectedTexts = appearance.handheldType;

      cy.get("#handheldUserType option").then((options) => {
        const actualTexts = [...options].map((o) => o.innerText.trim());
        expect(actualTexts).to.deep.eq(expectedTexts);
      });
    });
    it("TC 1.8 - Check for the additional fields under driver info section", () => {
      it("should have all required fields under Driver Info section", () => {
        cy.get("section#driver").within(() => {
          const expectedTexts = appearance.transportmode;

          cy.get("#driverNumber").should("be.visible");
          cy.get("#driverlicencenumber").should("be.visible");
          cy.get("#drlicenexpir").should("be.visible");
          cy.get("#drlicenissue").should("be.visible");
          cy.get("#insuranceexpir").should("be.visible");
          cy.get("#vhlicencatg").should("be.visible");
          cy.get("#vehicleType").should("be.visible");
          cy.get("#handheldUserType option").then((options) => {
            const actualTexts = [...options].map((o) => o.innerText.trim());
            expect(actualTexts).to.deep.eq(expectedTexts);
          });
          cy.get("#vatNo").should("be.visible");
        });
      });
    });
    it("TC 1.9 - Check handheld user dropdown for user type - Both", () => {
      cy.get('input[name="type"][value="B"]').click();
      cy.get("#handheldUserType").should("be.visible");
    });
    it("TC 1.10 - Check for the handheld user type dropdown option for user type - Both", () => {
      cy.get("#handheldUserType").should("be.visible");
      const expectedTexts = appearance.handheldType;

      cy.get("#handheldUserType option").then((options) => {
        const actualTexts = [...options].map((o) => o.innerText.trim());
        expect(actualTexts).to.deep.eq(expectedTexts);
      });
    });
    it("TC 1.11 - Check for the additional fields under driver info section for the user type - Both", () => {
      it("should have all required fields under Driver Info section", () => {
        cy.get("section#driver").within(() => {
          const expectedTexts = appearance.transportmode;

          cy.get("#driverNumber").should("be.visible");
          cy.get("#driverlicencenumber").should("be.visible");
          cy.get("#drlicenexpir").should("be.visible");
          cy.get("#drlicenissue").should("be.visible");
          cy.get("#insuranceexpir").should("be.visible");
          cy.get("#vhlicencatg").should("be.visible");
          cy.get("#vehicleType").should("be.visible");
          cy.get("#handheldUserType option").then((options) => {
            const actualTexts = [...options].map((o) => o.innerText.trim());
            expect(actualTexts).to.deep.eq(expectedTexts);
          });
          cy.get("#vatNo").should("be.visible");
        });
      });
    });
    it("TC 1.12 - Check for the current vehicle field appearance", () => {
      cy.get("#curvehicle").should("not.be.visible");
      cy.get("#vehicleType")
        .should("be.visible")
        .select(appearance.transportmode[1]);
      cy.get("#curvehicle").should("be.visible");
    });
  });

  describe("TC 2 - Add User", () => {
    context("Add standard user", () => {
      it("TC 2.1 - Required field validation keeping all the fiels blank", () => {
        cy.visit("/netcourier-data/system/user");
        cy.handleEscalateRole(Cypress.env("passWord"));
        cy.get("#headerconfirmbutton").click();
        cy.get(".headeralert").should(
          "contain",
          "Please provide at least one contact info (office/home/mobile phone or contact email). Please select a user privilege for this user"
        );
        cy.get('span.error[for="name"]')
          .should("be.visible")
          .and("contain", "This field is required.");
        cy.get('span.error[for="userCode"]')
          .should("be.visible")
          .and("contain", "This field is required.");
        cy.get('span.error[for="password"]')
          .should("be.visible")
          .and("contain", "This field is required.");
      });
      it("TC 2.2 - Required field validation other than the fullname field", () => {
        cy.visit("/netcourier-data/system/user");
        cy.get("#name").type(addUser.standardUser[0].fullName);
        cy.get("#headerconfirmbutton").click();
        cy.get(".headeralert").should(
          "contain",
          "Please provide at least one contact info (office/home/mobile phone or contact email). Please select a user privilege for this user"
        );
        cy.get('span.error[for="userCode"]')
          .should("be.visible")
          .and("contain", "This field is required.");
        cy.get('span.error[for="password"]')
          .should("be.visible")
          .and("contain", "This field is required.");
      });
      it("TC 2.3 - Add standard user - required field validation other than the fullname and username field", () => {
        //cy.visit("/netcourier-data/system/user");
        cy.get("#name").type(addUser.standardUser[0].fullName);
        cy.get("#userCode").type(addUser.standardUser[0].username);
        cy.get("#headerconfirmbutton").click();
        cy.get(".headeralert").should(
          "contain",
          "Please provide at least one contact info (office/home/mobile phone or contact email). Please select a user privilege for this user"
        );
        cy.get('span.error[for="password"]')
          .should("be.visible")
          .and("contain", "This field is required.");
      });
      it("TC 2.4 - Add standard user - required field validation other than the fullname,username field and password", () => {
        //cy.visit("/netcourier-data/system/user");
        cy.get("#name").type(addUser.standardUser[0].fullName);
        cy.get("#userCode").type(addUser.standardUser[0].username);
        cy.get("#password").type(addUser.standardUser[0].password);
        cy.get("#headerconfirmbutton").click();
        cy.get(".headeralert").should(
          "contain",
          "Please provide at least one contact info (office/home/mobile phone or contact email). Please select a user privilege for this user"
        );
      });
      it("TC 2.5 - Add standard user - required field validation other than the fullname,username field,password and user role", () => {
        //cy.visit("/netcourier-data/system/user");
        cy.get("#name").type(addUser.standardUser[0].fullName);
        cy.get("#userCode").type(addUser.standardUser[0].username);
        cy.get("#password").type(addUser.standardUser[0].password);
        cy.get("#userPrivilege .ui-multiselect").should("be.visible").click();
        cy.get(".ui-multiselect-menu .ui-multiselect-all").should("be.visible");
        cy.get(".ui-multiselect-menu .ui-multiselect-all").click();
        cy.get("#userPrivilege .ui-multiselect").should("be.visible").click();
        cy.get("#headerconfirmbutton").click();
        cy.get(".headeralert").should(
          "contain",
          "Please provide at least one contact info (office/home/mobile phone or contact email)."
        );
      });
      addUser.standardUser.forEach((standardUser) => {
        context(`Adding a standard user named ${standardUser.fullName}`, () => {
          it("TC 2.6 - Add standard user with email address", () => {
            cy.visit("/netcourier-data/system/user");

            cy.get("#name").type(standardUser.fullName);
            cy.get("#userCode").type(standardUser.username);
            cy.get("#password").type(standardUser.password);
            cy.get("#email").type(standardUser.email);
            cy.get("#userPrivilege .ui-multiselect")
              .should("be.visible")
              .click();
            cy.get(".ui-multiselect-menu .ui-multiselect-all").should(
              "be.visible"
            );
            cy.get(".ui-multiselect-menu .ui-multiselect-all").click();
            cy.get("#userPrivilege .ui-multiselect")
              .should("be.visible")
              .click();
            cy.get("#headerconfirmbutton").should("be.visible").click();
            cy.get("#updatebutton").should("be.visible");
            //assertion
            cy.get("#name").should("have.value", standardUser.fullName);
            cy.get("#userCode").should("have.value", standardUser.username);
            // cy.get('#password').should('have.value',standardUser.password);
            cy.get("#email").should("have.value", standardUser.email);
          });
          it("TC 2.7 - Add the user with office phone no", () => {
            cy.get("#updatebutton").should("be.visible").click();
            cy.get("#email").clear();
            cy.get("#officePhone").type(standardUser.office);
            cy.get("#headerconfirmbutton").should("be.visible").click();
            cy.get("#updatebutton").should("be.visible");
            //assertion
            cy.get("#email").should("have.value", "");
            cy.get("#officePhone").should("have.value", standardUser.office);
          });
          it("TC 2.8 - Add standard user with mobile no", () => {
            cy.get("#updatebutton").should("be.visible").click();
            cy.get("#officePhone").clear();
            cy.get("#mobile").type(standardUser.mobile);
            cy.get("#headerconfirmbutton").should("be.visible").click();
            cy.get("#updatebutton").should("be.visible");
            //assertion
            cy.get("#officePhone").should("have.value", "");
            cy.get("#mobile").should("have.value", standardUser.mobile);
          });
          it("TC 2.9 - Add standard user with home phone no", () => {
            cy.get("#updatebutton").should("be.visible").click();
            cy.get("#mobile").clear();
            cy.get("#homePhone").type(standardUser.homeNo);
            cy.get("#headerconfirmbutton").should("be.visible").click();
            cy.get("#updatebutton").should("be.visible");
            //assertion
            cy.get("#mobile").should("have.value", "");
            // cy.get('#password').should('have.value',standardUser.password);
            cy.get("#homePhone").should("have.value", standardUser.homeNo);
          });
        });
      });
    });
    context("Add Handheld user", () => {
      it("TC 2.10 - Required field validation", () => {
        cy.visit("/netcourier-data/system/user");
        cy.handleEscalateRole(Cypress.env("passWord"));

        cy.get('input[name="type"][value="H"]').click();
        cy.get("#headerconfirmbutton").click();

        cy.get(".headeralert").should(
          "contain",
          "Please provide at least one contact info (office/home/mobile phone or contact email). Please select a user privilege for this user"
        );
        cy.get('span.error[for="name"]')
          .should("be.visible")
          .and("contain", "This field is required.");
        cy.get('span.error[for="userCode"]')
          .should("be.visible")
          .and("contain", "This field is required.");
        cy.get('span.error[for="password"]')
          .should("be.visible")
          .and("contain", "This field is required.");
      });
      addUser.handheldUser.forEach((handheldUser) => {
        it("TC 2.11 - Add Handheld user with required fields", () => {
          cy.visit("/netcourier-data/system/user");
          cy.handleEscalateRole(Cypress.env("passWord"));

          cy.get("#name").should("be.visible").type(handheldUser.fullName);
          cy.get("#userCode").should("be.visible").type(handheldUser.username);
          cy.get("#password").should("be.visible").type(handheldUser.password);
          cy.get("#type2").should("be.visible").click();
          cy.get("#email").should("be.visible").type(handheldUser.email);

          cy.get("#userPrivilege .ui-multiselect").should("be.visible").click();
          cy.get(".ui-multiselect-menu .ui-multiselect-all").should(
            "be.visible"
          );
          cy.get(".ui-multiselect-menu .ui-multiselect-all").click();
          cy.get("#userPrivilege .ui-multiselect").should("be.visible").click();
          cy.get("#headerconfirmbutton").should("be.visible").click();

          cy.get("#updatebutton").should("be.visible");

          // assertions
          cy.get("#name").should("have.value", handheldUser.fullName);
          cy.get("#userCode").should("have.value", handheldUser.username);
          cy.get("#email").should("have.value", handheldUser.email);
        });

        it("TC 2.12 - Add handheld user with handheld type", () => {
          cy.get("#updatebutton").should("be.visible").click();

          cy.get("#handheldUserType")
            .should("be.visible")
            .select(handheldUser.handheldType);

          cy.get("#headerconfirmbutton").should("be.visible").click();

          // add assertion here,
        });
        it("TC 2.13 - Add handheld user with driver informations", () => {
          cy.get("#updatebutton").should("be.visible").click();

          cy.get("#driverNumber")
            .should("be.visible")
            .clear()
            .type(handheldUser.driverNo);

          cy.get("#driverlicencenumber")
            .should("be.visible")
            .clear()
            .type(handheldUser.licence);

          cy.get("#vehicleType")
            .should("be.visible")
            .select(handheldUser.vehicleType);

          cy.get("#curvehicle")
            .should("be.visible")
            .clear()
            .type(handheldUser.vehicle);

          cy.get("#ui-id-4")
            .should("be.visible")
            .contains(handheldUser.vehicle)
            .click();

          cy.get("#vatNo")
            .should("be.visible")
            .clear()
            .type(handheldUser.vatNo);

          cy.get("#headerconfirmbutton").should("be.visible").click();
          //assertion
        });
        it("TC 2.14 - Data validation - insurance expiry date could not be in past", () => {
          cy.get("#updatebutton").click();
          const pastDate = new Date();
          pastDate.setDate(pastDate.getDate() - 2);

          const day = String(pastDate.getDate()).padStart(2, "0");
          const month = String(pastDate.getMonth() + 1).padStart(2, "0");
          const year = pastDate.getFullYear();

          const pdate = `${day}-${month}-${year}`;

          cy.get("#insuranceexpir").clear();
          cy.get("#insuranceexpir").type(pdate);
          cy.get("#headerconfirmbutton").should("be.visible").click();
          cy.get(".headeralert.alert-error", { timeout: 10000 }).should(
            "contain",
            "Insurance expiry date must be today or future date;"
          );
        });
        it("TC 2.15 - Data validation - insurance expiry date could not be in more than 20 years in future", () => {
          //cy.get('#updatebutton').click();
          const futureDate = new Date();
          futureDate.setFullYear(futureDate.getFullYear() + 20);
          futureDate.setDate(futureDate.getDate() + 1);

          const day = String(futureDate.getDate()).padStart(2, "0");
          const month = String(futureDate.getMonth() + 1).padStart(2, "0");
          const year = futureDate.getFullYear();

          const fdate = `${day}-${month}-${year}`;

          cy.get("#insuranceexpir").clear();
          cy.get("#insuranceexpir").type(fdate);
          cy.get("#headerconfirmbutton").should("be.visible").click();
          cy.get(".headeralert.alert-error", { timeout: 10000 }).should(
            "contain",
            "Insurance expiry date must be less than or equal to 20 years from today;"
          );
        });
        it("TC 2.16 - Data validation - insurance expiry date is today", () => {
          //cy.get('#updatebutton').click();
          const futureDate = new Date();

          const day = String(futureDate.getDate()).padStart(2, "0");
          const month = String(futureDate.getMonth() + 1).padStart(2, "0");
          const year = futureDate.getFullYear();

          const fdate = `${day}-${month}-${year}`;

          cy.get("#insuranceexpir").clear();
          cy.get("#insuranceexpir").type(fdate);
          cy.get("#headerconfirmbutton").should("be.visible").click();
          cy.get("#updatebutton").should("be.visible");
        });

        it("TC 2.17 - Data validation - driver licence expiry date could not be in past", () => {
          cy.get("#updatebutton").click();
          const pastDate = new Date();
          pastDate.setDate(pastDate.getDate() - 2);

          const day = String(pastDate.getDate()).padStart(2, "0");
          const month = String(pastDate.getMonth() + 1).padStart(2, "0");
          const year = pastDate.getFullYear();

          const pdate = `${day}-${month}-${year}`;

          cy.get("#drlicenexpir").clear();
          cy.get("#drlicenexpir").type(pdate);
          cy.get("#headerconfirmbutton").should("be.visible").click();
          cy.get(".headeralert.alert-error", { timeout: 10000 }).should(
            "contain",
            "Driver expiry date must be today or future date;"
          );
        });

        it("TC 2.18 - Data validation - driver licence expiry date should not be in more than 20 years", () => {
          //cy.get('#updatebutton').click();
          const futureDate = new Date();
          futureDate.setFullYear(futureDate.getFullYear() + 20);
          futureDate.setDate(futureDate.getDate() + 1);

          const day = String(futureDate.getDate()).padStart(2, "0");
          const month = String(futureDate.getMonth() + 1).padStart(2, "0");
          const year = futureDate.getFullYear();

          const fdate = `${day}-${month}-${year}`;

          cy.get("#drlicenexpir").clear();
          cy.get("#drlicenexpir").type(fdate);
          cy.get("#headerconfirmbutton").should("be.visible").click();
          cy.get(".headeralert.alert-error", { timeout: 10000 }).should(
            "contain",
            "Driver expiry date must be less than or equal to 20 years from today;"
          );
        });
        it("TC 2.19 - Add driver where driver licence expiry date is today", () => {
          //cy.get('#updatebutton').click();
          const futureDate = new Date();

          const day = String(futureDate.getDate()).padStart(2, "0");
          const month = String(futureDate.getMonth() + 1).padStart(2, "0");
          const year = futureDate.getFullYear();

          const tdate = `${day}-${month}-${year}`;

          cy.get("#drlicenexpir").clear();
          cy.get("#drlicenexpir").type(tdate);
          cy.get("#headerconfirmbutton").should("be.visible").click();
          cy.get("#updatebutton").should("be.visible");
        });

        it("TC 2.20 - Data validation - Driver licence issue date should not be in future", () => {
          cy.get("#updatebutton").click();
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + 1);

          const day = String(futureDate.getDate()).padStart(2, "0");
          const month = String(futureDate.getMonth() + 1).padStart(2, "0");
          const year = futureDate.getFullYear();

          const fdate = `${day}-${month}-${year}`;

          cy.get("#drlicenissue").clear();
          cy.get("#drlicenissue").type(fdate);
          cy.get("#headerconfirmbutton").should("be.visible").click();
          cy.get(".headeralert.alert-error", { timeout: 10000 }).should(
            "contain",
            "Driver issue date must be today or past date;"
          );
        });

        it("TC 2.21 - Data validation - Driver licence issue date should not be in more than 20 years in past", () => {
          //cy.get('#updatebutton').click();
          const futureDate = new Date();
          futureDate.setFullYear(futureDate.getFullYear() - 20);
          futureDate.setDate(futureDate.getDate() - 1);

          const day = String(futureDate.getDate()).padStart(2, "0");
          const month = String(futureDate.getMonth() + 1).padStart(2, "0");
          const year = futureDate.getFullYear();

          const fdate = `${day}-${month}-${year}`;

          cy.get("#drlicenissue").clear();
          cy.get("#drlicenissue").type(fdate);
          cy.get("#headerconfirmbutton").should("be.visible").click();
          cy.get(".headeralert.alert-error", { timeout: 10000 }).should(
            "contain",
            "Driver issue date must be greater than or equal to past 20 years from today;"
          );
        });

        it("TC 2.22 - Driver licence issue date is today", () => {
          const futureDate = new Date();

          const day = String(futureDate.getDate()).padStart(2, "0");
          const month = String(futureDate.getMonth() + 1).padStart(2, "0");
          const year = futureDate.getFullYear();

          const tdate = `${day}-${month}-${year}`;

          cy.get("#drlicenissue").clear();
          cy.get("#drlicenissue").type(tdate);
          cy.get("#headerconfirmbutton").should("be.visible").click();
        });

        it("TC 2.23 - Driver licence no field value length should not be more than 16 characters", () => {
          cy.get("#updatebutton").should("be.visible");
          cy.get("#updatebutton").click();
          cy.get("#driverlicencenumber").clear();
          cy.get("#driverlicencenumber").type("28-US-0012-22-0090");
          cy.get("#headerconfirmbutton").should("be.visible").click();
          cy.get(".headeralert.alert-error", { timeout: 10000 }).should(
            "contain",
            "The following error has occurred:Driver licence number should be less than 17 character"
          );
        });

        it("TC 2.24 - Driver licence no field value length is less than 17 characters", () => {
          cy.get("#driverlicencenumber").clear();
          cy.get("#driverlicencenumber").type("28-US-0012-22-99");
          cy.get("#headerconfirmbutton").should("be.visible").click();
          cy.get("#updatebutton").should("be.visible");
        });
      });
    });
  });

  describe("TC 3 - Update user", () => {
    updateUser.updatedUser.forEach((data) => {
      context("updating the information of the user ", () => {
        it("TC 3.1 - Checking navbar options", () => {
          cy.visit("/netcourier-data/system/user");
          cy.handleEscalateRole(Cypress.env("passWord"));
          cy.intercept("GET", /\/netcourier-data\/search\/advanced\/us\/.*/).as(
            "searchUser"
          );
          cy.get(".navbar-search > .typeahead").type(
            updateUser.existingUser.username
          );
          cy.wait("@searchUser").then((interception) => {
            expect(interception.response, "response should exist").to.not.be
              .undefined;
            if (interception.response) {
              const userId = interception.response.body[0]?.key;
              Cypress.env("userId", userId);
              expect(interception.response.statusCode).to.eq(200);
              //cy.log('Found User id: ',serId);
              //cy.log('Search response: ', interception.response.body);
              cy.visit(`/netcourier-data/system/user/${userId}`);
            }
          });
          cy.get(".navbar-inner").should("be.visible");
          cy.get(".navbar-inner")
            .should("contain", "Add")
            .should("contain", "Update")
            .should("contain", "Archive")
            .should("contain", "Copy")
            .should("contain", "Actions");
        });

        it(`TC 3.2 - Updating information for the user with user name ${updateUser.existingUser.username}`, () => {
          cy.get("#updatebutton").click();

          // Wait for password input to be visible and type
          cy.get("#password").should("be.visible").clear().type(data.pass);

          // Home phone
          cy.get("#homePhone").should("be.visible").clear().type(data.home);

          // Office phone
          cy.get("#officePhone").should("be.visible").clear().type(data.office);

          // Mobile
          cy.get("#mobile").should("be.visible").clear().type(data.mobile);

          // Email
          cy.get("#email").should("be.visible").clear().type(data.email);

          // Product select
          cy.get("#productId").should("be.visible").select(data.product);

          // Language select
          cy.get("#language").should("be.visible").select(data.language);

          // Supplier search
          cy.get("#supplierSearch")
            .should("be.visible")
            .clear()
            .type(data.supplier);

          // Ensure autocomplete appears and pick supplier
          cy.get("#ui-id-2")
            .should("be.visible")
            .contains(data.supplier)
            .click();
          cy.get('input[name="type"]:checked')
            .invoke("val")
            .then((value) => {
              if (value !== "S") {
                // Driver number
                cy.get("#driverNumber")
                  .should("be.visible")
                  .clear()
                  .type(data.driverNo);

                // Licence
                cy.get("#driverlicencenumber")
                  .should("be.visible")
                  .clear()
                  .type(data.licence);

                // VAT
                cy.get("#vatNo").should("be.visible").clear().type(data.vatNo);
              }
            });

          // Confirm
          cy.get("#headerconfirmbutton").should("be.visible").click();

          // Final update button visible check
          cy.get("#updatebutton").should("be.visible");

          //cy.reload();
          cy.get(".navbar-inner").should("be.visible");
          // Assertions
          cy.get("#homePhone").should("have.value", data.home);
          cy.get("#mobile").should("have.value", data.mobile);
          cy.get("#email").should("have.value", data.email);
          cy.get("#productId").should("contain", data.product);
          cy.get("#language").should("contain", data.language);
          cy.get('input[name="type"]:checked')
            .invoke("val")
            .then((value) => {
              if (value !== "S") {
                cy.get("#driverNumber").should("have.value", data.driverNo);
                cy.get("#driverlicencenumber").should(
                  "have.value",
                  data.licence
                );
                cy.get("#vatNo").should("have.value", data.vatNo);
              }
            });
          cy.get("#supplierSearch").should("have.value", data.supplier);
        });
      });
    });
  });

  describe("TC 4 - Copy User Tests", () => {
    copyUser.existingUser.forEach((user, index) => {
      const copied = copyUser.copiedUser[index]; // match by index

      it("TC 4.1 - Try to open user in new screen", () => {
        cy.visit("/netcourier-data/system/user");
        cy.handleEscalateRole(Cypress.env("passWord"));

        cy.intercept("GET", /\/netcourier-data\/search\/advanced\/us\/.*/).as(
          "searchUser"
        );
        cy.get(".navbar-search > .typeahead").type(user.username);

        cy.wait("@searchUser").then((interception) => {
          expect(interception.response, "response should exist").to.not.be
            .undefined;
          if (interception.response) {
            const userId = interception.response.body[0]?.key;
            Cypress.env("userId", userId);
            expect(interception.response.statusCode).to.eq(200);
            cy.log("Found User id: ", userId);
            cy.log("Search response: ", interception.response.body);
          }
        });

        cy.then(() => {
          const userId = Cypress.env("userId");
          expect(userId, "userId should exist").to.not.be.undefined;
          cy.visit(`/netcourier-data/system/user/${userId}`);
          cy.get("#userCode").should("have.value", user.username);
        });
      });

      it("TC 4.2 - Required field validation for copied user", () => {
        cy.get("#copybutton").should("be.visible").click();
        cy.get("#headerconfirmbutton").should("be.visible").click();
        cy.get('span.error[for="userCode"]')
          .should("be.visible")
          .and("contain", "This field is required.");
        cy.get('span.error[for="password"]')
          .should("be.visible")
          .and("contain", "This field is required.");
      });

      it(`TC 4.3 - Copy user ${user.fullName}`, () => {
        cy.get("#userCode").type(copied.username);
        cy.get("#password").type(copied.password);
        cy.get('input[name="type"]:checked')
          .invoke("val")
          .then((value) => {
            if (value !== "S") {
              cy.get("#headerconfirmbutton").should("be.visible").click();
              cy.get(".headeralert").should(
                "contain",
                "The following error has occurred:Driver number already exists"
              );
              cy.get("#driverNumber")
                .should("be.visible")
                .clear()
                .type(copied.driverNo);
            }
          });
        cy.get("#headerconfirmbutton").should("be.visible").click();
        cy.get("#updatebutton").should("be.visible");
        cy.get("#userCode").should("have.value", copied.username);
      });
    });
  });

  describe("TC 5 - Archive a user", () => {
    archiveUser.forEach((archivingUser) => {
      context(
        `Archive User Test for User Code ${archivingUser.fullName}`,
        () => {
          it("TC 5.1 Try to open user in new screen", () => {
            cy.visit("/netcourier-data/system/user");
            cy.handleEscalateRole(Cypress.env("passWord"));
            cy.intercept(
              "GET",
              /\/netcourier-data\/search\/advanced\/us\/.*/
            ).as("searchUser");

            cy.get(".navbar-search > .typeahead").type(archivingUser.username);
            cy.wait("@searchUser").then((interception) => {
              expect(interception.response, "response should exist").to.not.be
                .undefined;
              if (interception.response) {
                const userId = interception.response.body[0]?.key;
                Cypress.env("userId", userId);
                expect(interception.response.statusCode).to.eq(200);
                cy.log("Found User id: ", userId);
                cy.log("Search response: ", interception.response.body);
              }
            });

            cy.then(() => {
              const userId = Cypress.env("userId");
              expect(userId, "userId should exist").to.not.be.undefined;
              cy.visit(`/netcourier-data/system/user/${userId}`);
              cy.get("#userCode").should("have.value", archivingUser.username);
            });
          });

          it("TC 5.2 Try to archive user", () => {
            cy.get("#archivebutton").should("be.visible");
            cy.get("#archivebutton").click();
          });
        }
      );
    });
  });
  describe("TC 6 - Appearnace of Vehicle details section on user screen", () => {
    const vehicle = vehicleSectionAppearance.vehicle;
    it(`TC 6.1 Open a user named ${vehicleSectionAppearance.driver.fullname} `, () => {
      cy.visit("/netcourier-data/system/user");
      cy.handleEscalateRole(Cypress.env("passWord"));
      cy.intercept("GET", /\/netcourier-data\/search\/advanced\/us\/.*/).as(
        "searchUser"
      );

      cy.get(".navbar-search > .typeahead").type(
        vehicleSectionAppearance.driver.username
      );
      cy.wait("@searchUser").then((interception) => {
        expect(interception.response, "response should exist").to.not.be
          .undefined;
        if (interception.response) {
          const userId = interception.response.body[0]?.key;
          Cypress.env("userId", userId);
          expect(interception.response.statusCode).to.eq(200);
          cy.log("Found User id: ", userId);
          cy.log("Search response: ", interception.response.body);
        }
      });

      cy.then(() => {
        const userId = Cypress.env("userId");
        expect(userId, "userId should exist").to.not.be.undefined;
        cy.visit(`/netcourier-data/system/user/${userId}`);
        cy.get("#userCode").should(
          "have.value",
          vehicleSectionAppearance.driver.username
        );
      });
    });

    it("TC 6.2 Click on update button ", () => {
      cy.get("#updatebutton").click();
      cy.get("#userCode").should("be.visible").and("not.be.disabled");
      cy.get("#name").should("be.visible").and("not.be.disabled");
    });
    it("TC 6.3  Try to select vehicle type as Motorbike", () => {
      cy.get("#vehicleType").should("be.visible");
      cy.get("#vehicleType").select(vehicle.vehicletype);
      cy.get("#curvehicle").should("be.visible");
    });

    it("TC 6.4 , 6.5 Try to search and select number plate as Suzuki", () => {
      cy.get("#vehicleType").should("be.visible");
      cy.get("#vehicleType").select(vehicle.vehicletype);
      cy.get("#curvehicle").should("be.visible");
      cy.get("#curvehicle").type(vehicle.numberplate);
      cy.get(".ui-autocomplete li").first().click();
      cy.get("#headerconfirmbutton").click();
    });

    it("TC 6.6 Click confirm button", () => {
      cy.get("#headerconfirmbutton").click();
      cy.get("#vehicleType").should("have.value", vehicle.vehicletype);
      cy.get("#curvehicle").should(
        "have.value",
        vehicle.numberplate + " - " + vehicle.vehicletype
      );
    });

    it("TC 6.7  Try to check that a vehicle section is appearing", () => {
      cy.get("#vehicle").should("be.visible");
    });

    it("TC 6.8  Try to check vehicle section data ", () => {
      cy.get("#vehicle").should("be.visible");
      cy.get("#vehicle").within(() => {
        cy.get('input[name="numberPlate"], input[disabled][type="text"]')
          .first()
          .should("have.value", "Suzuki");
        cy.get("#motExpiryDate").should("have.value", vehicle.motexpirydate);
        cy.get("#taxExpiryDate").should("have.value", vehicle.taxexpirydate);
        cy.contains("label", "Vehicle type")
          .siblings(".controls")
          .find("input[disabled]")
          .should("have.value", vehicle.vehicletype);
        cy.contains("label", "Emission")
          .siblings(".controls")
          .find("input[disabled]")
          .should("have.value", "6.10");
        cy.contains("label", "Current driver")
          .siblings(".controls")
          .find("input[disabled]")
          .should(
            "have.value",
            vehicleSectionAppearance.driver.username +
              " - " +
              vehicleSectionAppearance.driver.fullname
          );
      });
    });
  });
  describe("TC 7 - Functionality of vehicle details section on user screen", () => {
    const users = vehicleSectionFunctionality.assigntousers;
    const curvehicle = vehicleSectionFunctionality.currentVehicle;
    const updatevehicle = vehicleSectionFunctionality.updatedVehicle;

    it(`TC 7.1 Try to open user ${users.assignToFristFullName}`, () => {
      cy.visit("/netcourier-data/system/user");
      cy.handleEscalateRole(Cypress.env("passWord"));
      cy.intercept("GET", /\/netcourier-data\/search\/advanced\/us\/.*/).as(
        "searchUser"
      );

      cy.get(".navbar-search > .typeahead").type(users.assignToFristUserName);
      cy.wait("@searchUser").then((interception) => {
        expect(interception.response, "response should exist").to.not.be
          .undefined;
        if (interception.response) {
          const userId = interception.response.body[0]?.key;
          Cypress.env("userId", userId);
          expect(interception.response.statusCode).to.eq(200);
          cy.log("Found User id: ", userId);
          cy.log("Search response: ", interception.response.body);
        }
      });

      cy.then(() => {
        const userId = Cypress.env("userId");
        expect(userId, "userId should exist").to.not.be.undefined;
        cy.visit(`/netcourier-data/system/user/${userId}`);
        cy.get("#userCode").should("have.value", users.assignToFristUserName);
      });
    });

    it("TC 7.2 Will click the update button", () => {
      cy.get("#updatebutton").click();
      cy.get("#userCode").should("be.visible").and("not.be.disabled");
      cy.get("#name").should("be.visible").and("not.be.disabled");
    });

    it(`TC 7.3 Try to select vehicle type as ${curvehicle.vehicletype}`, () => {
      cy.get("#vehicleType").should("be.visible");
      cy.get("#vehicleType").select(curvehicle.vehicletype);
      cy.get("#vehicleType").should("have.value", curvehicle.vehicletype);
    });

    it(`TC 7.4, TC 7.5, TC 7.6 Try to search number plate of the vehicle which is type ${curvehicle.vehicletype} and select it`, () => {
      cy.get(".navbar-search > .typeahead").type(users.assignToFristUserName);
      cy.get("#curvehicle").type(curvehicle.numberplate);
      cy.get(".ui-autocomplete li").first().click();
      cy.get("#curvehicle").should(
        "have.value",
        curvehicle.numberplate + " - " + curvehicle.vehicletype
      );
      cy.get("#headerconfirmbutton").click();
    });

    it("TC 7.7 Try to check that a vehicle section is appearing", () => {
      cy.get("#vehicle").should("be.visible");
    });

    it(`TC 7.8 Try to go to vehicle maintenance screen where the number plate is ${curvehicle.numberplate}`, () => {
      cy.visit("/netcourier-data/system/user");
      cy.handleEscalateRole(Cypress.env("passWord"));
      cy.intercept("GET", /\/netcourier-data\/search\/advanced\/us\/.*/).as(
        "searchVehicle"
      );

      cy.get(".navbar-search > .typeahead").type(curvehicle.numberplate);

      cy.wait("@searchVehicle").then((interception) => {
        expect(interception.response, "response should exist").to.not.be
          .undefined;
        if (interception.response) {
          const vehicleId = interception.response.body[0]?.key;
          Cypress.env("vehicleId", vehicleId);
          expect(interception.response.statusCode).to.eq(200);
          expect(interception.response.body[0]?.type).to.eq("vh");
          cy.log("Found Vehicle id: ", vehicleId);
          cy.log("Search response: ", interception.response.body);
        }
      });

      cy.then(() => {
        const vehicleId = Cypress.env("vehicleId");
        expect(vehicleId, "Vehicle Id should exist").to.not.be.undefined;
        cy.visit(`/netcourier-data/vehicle/${vehicleId}`);
        cy.get("#numberPlate").should("have.value", curvehicle.numberplate);
      });
    });

    it("TC 7.9 Try to remove current driver", () => {
      cy.get("#updatebutton").click();
      cy.get("#assignedToSearch").clear();
      cy.get("#headerconfirmbutton").click();
    });

    it(`TC 7.10 Visit user ${addUser.handheldUser[0].fullName}`, () => {
      cy.visit("/netcourier-data/system/user");
      cy.handleEscalateRole(Cypress.env("passWord"));
      cy.intercept("GET", /\/netcourier-data\/search\/advanced\/us\/.*/).as(
        "searchUser"
      );

      cy.get(".navbar-search > .typeahead").type(users.assignToFristFullName);
      cy.wait("@searchUser").then((interception) => {
        expect(interception.response, "response should exist").to.not.be
          .undefined;
        if (interception.response) {
          const userId = interception.response.body[0]?.key;
          Cypress.env("userId", userId);
          expect(interception.response.statusCode).to.eq(200);
          cy.log("Found User id: ", userId);
          cy.log("Search response: ", interception.response.body);
        }
      });

      cy.then(() => {
        const userId = Cypress.env("userId");
        expect(userId, "userId should exist").to.not.be.undefined;
        cy.visit(`/netcourier-data/system/user/${userId}`);
        cy.get("#userCode").should("have.value", users.assignToFristUserName);
      });
    });

    it("TC 7.11 Check that vehicle section does not appear", () => {
      cy.get("body").find("#vehicle").should("not.exist");
    });

    it(`TC 7.12 Go to vehicle maintenance screen where numberplate is ${curvehicle.numberplate}`, () => {
      cy.intercept("GET", /\/netcourier-data\/search\/advanced\/us\/.*/).as(
        "searchVehicle"
      );

      cy.get(".navbar-search > .typeahead").type(curvehicle.numberplate);

      cy.wait("@searchVehicle").then((interception) => {
        expect(interception.response, "response should exist").to.not.be
          .undefined;
        if (interception.response) {
          const vehicleId = interception.response.body[0]?.key;
          Cypress.env("vehicleId", vehicleId);
          expect(interception.response.statusCode).to.eq(200);
          expect(interception.response.body[0]?.type).to.eq("vh");
          cy.log("Found Vehicle id: ", vehicleId);
          cy.log("Search response: ", interception.response.body);
        }
      });

      cy.then(() => {
        const vehicleId = Cypress.env("vehicleId");
        expect(vehicleId, "Vehicle Id should exist").to.not.be.undefined;
        cy.visit(`/netcourier-data/vehicle/${vehicleId}`);
        cy.get("#numberPlate").should("have.value", curvehicle.numberplate);
      });
    });

    it("TC 7.13 Try to set vehicle details", () => {
      cy.get("#updatebutton").click();

      const dateMotExprStr = updatevehicle.motexpirydate;
      const dateTaxExprStr = updatevehicle.taxexpirydate;

      const motExprTemp = new Date(dateMotExprStr);
      const taxExprTemp = new Date(dateTaxExprStr);

      const formattedMot = format(motExprTemp, "dd-MM-yyyy");
      const formattedTax = format(taxExprTemp, "dd-MM-yyyy");

      cy.get("#numberPlate").type(updatevehicle.numberplate);
      cy.get("#MotExpir").type(formattedMot);
      cy.get("#TaxExpir").type(formattedTax);

      cy.get("#assignedToSearch").type(addUser.handheldUser[1].username);
      cy.get(".ui-autocomplete li").first().click();
      cy.get("#headerconfirmbutton").click();
    });

    it(`TC 7.14 Visit user ${users.assignToFristFullName}`, () => {
      cy.visit("/netcourier-data/system/user");
      cy.handleEscalateRole(Cypress.env("passWord"));
      cy.intercept("GET", /\/netcourier-data\/search\/advanced\/us\/.*/).as(
        "searchUser"
      );

      cy.get(".navbar-search > .typeahead").type(users.assignToFristUserName);
      cy.wait("@searchUser").then((interception) => {
        expect(interception.response, "response should exist").to.not.be
          .undefined;
        if (interception.response) {
          const userId = interception.response.body[0]?.key;
          Cypress.env("userId", userId);
          expect(interception.response.statusCode).to.eq(200);
          cy.log("Found User id: ", userId);
          cy.log("Search response: ", interception.response.body);
        }
      });

      cy.then(() => {
        const userId = Cypress.env("userId");
        expect(userId, "userId should exist").to.not.be.undefined;
        cy.visit(`/netcourier-data/system/user/${userId}`);
        cy.get("#userCode").should("have.value", users.assignToFristUserName);
      });
    });

    it(`TC 7.15 Vehicle Section does not appear for ${users.assignToFristUserName}`, () => {
      cy.get("body").find("#vehicle").should("not.exist");
    });

    it(`TC 7.16 Try to open user ${users.assignToNextFullName}`, () => {
      cy.visit("/netcourier-data/system/user");
      cy.handleEscalateRole(Cypress.env("passWord"));
      cy.intercept("GET", /\/netcourier-data\/search\/advanced\/us\/.*/).as(
        "searchUser"
      );

      cy.get(".navbar-search > .typeahead").type(users.assignToNextUserName);
      cy.wait("@searchUser").then((interception) => {
        expect(interception.response, "response should exist").to.not.be
          .undefined;
        if (interception.response) {
          const userId = interception.response.body[0]?.key;
          Cypress.env("userId", userId);
          expect(interception.response.statusCode).to.eq(200);
          cy.log("Found User id: ", userId);
          cy.log("Search response: ", interception.response.body);
        }
      });

      cy.then(() => {
        const userId = Cypress.env("userId");
        expect(userId, "userId should exist").to.not.be.undefined;
        cy.visit(`/netcourier-data/system/user/${userId}`);
        cy.get("#userCode").should("have.value", users.assignToNextUserName);
      });
    });

    it(`TC 7.17 Try to add vehicle to user ${users.assignToFristUserName}`, () => {
      cy.get("#updatebutton").should("be.visible").click();
      cy.get("#userCode").should("be.visible").and("not.be.disabled");
      cy.get("#name").should("be.visible").and("not.be.disabled");

      cy.get("#vehicleType").should("be.visible");
      cy.get("#vehicleType").select(updatevehicle.vehicletype);
      cy.get("#vehicleType").should("have.value", updatevehicle.vehicletype);

      cy.get("#curvehicle").type(updatevehicle.numberplate);
      cy.get(".ui-autocomplete li").first().click();
      cy.get("#curvehicle").should(
        "have.value",
        updatevehicle.numberplate + " - " + updatevehicle.vehicletype
      );
      cy.get("#headerconfirmbutton").click();
    });
  });

  describe("TC 8 - Appearence of tasks section", () => {
    it(`TC 8.1 Try to open user ${taskSectionAppearance.userLinkedToTask.fullname} `, () => {
      cy.visit("/netcourier-data/system/user");
      cy.handleEscalateRole(Cypress.env("passWord"));
      cy.intercept("GET", /\/netcourier-data\/search\/advanced\/us\/.*/).as(
        "searchUser"
      );

      cy.get(".navbar-search > .typeahead").type(
        taskSectionAppearance.userLinkedToTask.username
      );
      cy.wait("@searchUser").then((interception) => {
        expect(interception.response, "response should exist").to.not.be
          .undefined;
        if (interception.response) {
          const userId = interception.response.body[0]?.key;
          Cypress.env("userId", userId);
          expect(interception.response.statusCode).to.eq(200);
          cy.log("Found User id: ", userId);
          cy.log("Search response: ", interception.response.body);
        }
      });

      cy.then(() => {
        const userId = Cypress.env("userId");
        expect(userId, "userId should exist").to.not.be.undefined;
        cy.visit(`/netcourier-data/system/user/${userId}`);
        cy.get("#userCode").should(
          "have.value",
          taskSectionAppearance.userLinkedToTask.username
        );
      });
    });

    it("TC 8.2 - Check for task section on the user screen", () => {
      cy.get("#tasks").should("be.visible");
    });

    it("TC 8.2 - Check task section table columns on the user screen", () => {
      cy.get("#taskstable thead tr th").then(($headers) => {
        const headerTexts = $headers
          .map((index, th) => Cypress.$(th).text().trim())
          .get();
        const expectedHeaders = [
          "Assigned to",
          "Status",
          "Deadline",
          "Task type",
          "Task",
          "",
        ];
        expect(headerTexts).to.deep.eq(expectedHeaders);
      });
    });

    it("TC 8.3 - Check for add task button on the user screen", () => {
      cy.get("#tasksmodalnewbutton").should("exist").and("be.visible");
    });

    it("TC 8.4 - Check for add task button on the user screen", () => {
      cy.get("#tasksmodalnewbutton").should("exist").and("be.visible");
    });
  });

  describe("TC 9 - Functionality of task section", () => {
    let taskSectionUser: string | null = null;
    let curTaskId: string | null = null;
    let taskIds: string[] = []; // store multiple task IDs
    let iterator = 0;
    context("Task modal appearance and field validation test", () => {
      it("TC 9.1 Task modal appeared", () => {
        cy.visit("/netcourier-data/system/user");
        cy.handleEscalateRole(Cypress.env("passWord"));
        cy.intercept("GET", /\/netcourier-data\/search\/advanced\/us\/.*/).as(
          "searchUser"
        );
        cy.get(".navbar-search > .typeahead").type(
          taskSectionFunctionality.userLinkedToTask.username
        );
        cy.wait("@searchUser").then((interception) => {
          expect(interception.response, "response should exist").to.not.be
            .undefined;
          if (interception.response) {
            taskSectionUser = interception.response.body[0]?.key;
            Cypress.env("userId", taskSectionUser);
            expect(interception.response.statusCode).to.eq(200);
            cy.log("Found User id: ", taskSectionUser);
            cy.log("Search response: ", interception.response.body);
            cy.visit(`/netcourier-data/system/user/${taskSectionUser}`);
          }
        });
        cy.get("#updatebutton").should("be.visible");
        cy.get("#updatebutton").click();
        cy.get("#tasksmodalnewbutton").click();
        cy.get("#tasksform").should("exist").and("be.visible");
      });
      it("TC 9.2 Check for the fields on the task modal", () => {
        cy.get("div.controls.disabled span.not-editable")
          .should("have.prop", "tagName", "SPAN")
          .and("have.attr", "disabled");
        cy.get("#linkedToCode")
          .should("have.prop", "tagName", "SELECT")
          .and("be.disabled");
        cy.get("#referenceSearch")
          .should("have.prop", "tagName", "INPUT")
          .and("be.disabled");
        cy.get("#taskType")
          .should("have.prop", "tagName", "SELECT")
          .and("not.be.disabled");
        cy.get("#task")
          .should("have.prop", "tagName", "TEXTAREA")
          .and("not.be.disabled");
        cy.get("#status")
          .should("have.prop", "tagName", "SELECT")
          .and("not.be.disabled");
        cy.get("#assignedToSearch")
          .should("have.prop", "tagName", "INPUT")
          .and("not.be.disabled");
        cy.get("#supervisorSearch")
          .should("have.prop", "tagName", "INPUT")
          .and("not.be.disabled");
        cy.get("#deadlineDate")
          .should("have.prop", "tagName", "INPUT")
          .and("not.be.disabled");
        cy.get("#deadlineTime")
          .should("have.prop", "tagName", "INPUT")
          .and("not.be.disabled");
        cy.get("#reminderDate")
          .should("have.prop", "tagName", "INPUT")
          .and("not.be.disabled");
        cy.get("#reminderTime")
          .should("have.prop", "tagName", "INPUT")
          .and("not.be.disabled");
        cy.get("#note")
          .should("have.prop", "tagName", "TEXTAREA")
          .and("not.be.disabled");
        cy.get("#btntasksmodalsubmit").should("exist").and("be.visible");
        cy.get('button.btn[data-dismiss="modal"]')
          .should("exist")
          .and("be.visible");
      });

      it("TC 9.3 Check for the required field validation on task modal", () => {
        cy.get("#btntasksmodalsubmit").should("be.visible");
        cy.get("#btntasksmodalsubmit").click();
        cy.get("#taskType").should("exist").and("be.visible");
        cy.get('span[for="taskType"].error')
          .should("exist")
          .and("be.visible")
          .and("contain.text", "This field is required.");
        cy.get("#task").should("exist").and("be.visible");
        cy.get('span[for="task"].error')
          .should("exist")
          .and("be.visible")
          .and("contain.text", "This field is required.");
        cy.get("#status").should("exist").and("be.visible");
        cy.get('span[for="status"].error')
          .should("exist")
          .and("be.visible")
          .and("contain.text", "This field is required.");
        cy.get("#assignedToSearch").should("exist").and("be.visible");
        cy.get('span[for="assignedToSearch"].error')
          .should("exist")
          .and("be.visible")
          .and("contain.text", "This field is required.");
        cy.get("#supervisorSearch").should("exist").and("be.visible");
        cy.get('span[for="supervisorSearch"].error')
          .should("exist")
          .and("be.visible")
          .and("contain.text", "This field is required.");
      });

      it("TC 9.4 check for close button", () => {
        cy.get('button.btn[data-dismiss="modal"]').should("be.visible");
        cy.get('button.btn[data-dismiss="modal"]').click();
        cy.get("#headerconfirmbutton").should("be.visible");
        cy.get("#tasksmodal").should("not.be.visible");
        cy.get("#headerconfirmbutton").click();
      });
    });

    taskSectionFunctionality.tasks.tasksAdd.forEach((task) => {
      context("Add operation test", () => {
        it("TC 9.6 Add a new task - ", () => {
          cy.visit(`/netcourier-data/system/user/${taskSectionUser}`);
          cy.get("#updatebutton").should("be.visible");
          cy.get("#updatebutton").click();
          cy.get("#tasksmodalnewbutton").should("be.visible");
          cy.get("#tasksmodalnewbutton").click();

          cy.get("#tasksform").should("be.visible");
          cy.get("#taskType").select(task.tasktype);

          cy.get("#task").clear().type(task.task);

          cy.get("#status").select(task.status);

          cy.get("#supervisorSearch").clear().type(task.supervisorUserName);
          cy.get(".ui-autocomplete li", { timeout: 2000 }).first().click();

          cy.get("#assignedToSearch").type(
            taskSectionFunctionality.userLinkedToTask.username
          );
          cy.get(".ui-autocomplete li", { timeout: 2000 })
            .should("be.visible")
            .first()
            .click();

          cy.get("#deadlineDate").clear().type(task.deadlineDate);
          cy.get("#deadlineTime").clear().type(task.deadlineTime);

          cy.get("#reminderDate").clear().type(task.deadlineDate);
          cy.get("#reminderTime").clear().type(task.deadlineTime);
          cy.get("#btntasksmodalsubmit").should("be.visible");
          cy.get("#btntasksmodalsubmit").click();
        });

        it("TC 9.7 Check that task has been added under task section", () => {
          cy.get("#taskstable tbody tr").first().as("firstRow");

          cy.get("@firstRow")
            .find(".tasktableassigneefirstname")
            .invoke("text")
            .should("eq", taskSectionFunctionality.userLinkedToTask.fullname);

          cy.get("@firstRow")
            .find(".tasktableassigneestatus")
            .invoke("text")
            .then((text) => {
              expect(text.trim().toLowerCase()).to.eq(
                task.status.toLowerCase()
              );
            });

          cy.get("@firstRow")
            .find(".tasttabletasktype")
            .invoke("text")
            .then((text) => {
              expect(text.trim().toLowerCase()).to.eq(
                task.tasktype.toLowerCase()
              );
            });

          cy.get("@firstRow")
            .find(".tasktabletask")
            .invoke("text")
            .should("eq", task.task);
        });
      });
      context("Tasks update operation tests", () => {
        it("TC 9.8 Check for a tick, edit and delete button beside each tasks", () => {
          cy.get("#taskstable tbody tr").each(($row) => {
            cy.wrap($row).find("button#tasksmodaleditbutton").should("exist");
            cy.wrap($row).find("button.confirm-delete").should("exist");
            cy.wrap($row)
              .find('td[data-headerdetails="Status"]')
              .invoke("text")
              .then((statusText) => {
                const status = statusText.trim();
                if (status !== "DONE") {
                  cy.wrap($row).find("button.taskdone").should("exist");
                } else {
                  cy.wrap($row).find("button.taskdone").should("not.exist");
                }
              });
          });
        });

        it("TC 9.9 Click on the edit button", () => {
          cy.get("#updatebutton").click();
          cy.get("#taskstable tbody tr").first().as("firstRow");
          cy.get("@firstRow")
            .find(".tasktabletask")
            .invoke("text")
            .should("eq", task.task);
          cy.get("@firstRow")
            .find("#tasksmodaleditbutton")
            .should("not.be.disabled")
            .click();

          cy.get('label[for="taskId"]')
            .parent()
            .find("span.not-editable")
            .invoke("text")
            .then((text) => {
              curTaskId = text.trim();
              cy.log("Task ID is: " + curTaskId);
              taskIds.push(curTaskId);
            });
          cy.get("#task").should("contain.text", task.task);
          cy.get("#status").should("contain.text", task.status);
        });

        it("TC 9.10 Change the status of the task from New to In progress", () => {
          cy.get("#status").select("In progress");
          cy.get("#btntasksmodalsubmit").should("be.visible");
          cy.get("#btntasksmodalsubmit").click();
        });

        it("TC 9.11 Check that the task in the user screen is updated accordingly", () => {
          cy.get("#updatebutton").should("be.visible");
          cy.get("#updatebutton").click();
          cy.get(
            `#task_${curTaskId} > [data-headerdetails=""] > #tasksmodaleditbutton`
          )
            .should("be.visible")
            .click();

          cy.get("#status").should("contain.text", "In progress");
          cy.get("#task").should("contain.text", task.task);
        });

        it("TC 9.12 Mark task as done", () => {
          cy.get('button.btn[data-dismiss="modal"]').click();
          cy.get("#tasksmodal").should("not.be.visible");
          cy.get(`#task_${curTaskId} > [data-headerdetails=""] > .taskdone`)
            .should("be.visible")
            .click();
          cy.get("#headerconfirmbutton").should("be.visible");
          cy.get("#headerconfirmbutton").click();
          cy.get(
            `#task_${curTaskId} > [data-headerdetails=""] > .taskdone`
          ).should("not.exist");
        });
      });
      context("Tasks sorting and filter test", () => {
        it("TC 9.13 Check sorting ", () => {
          cy.visit(`/netcourier-data/system/user/${taskSectionUser}`);

          cy.get(
            '[aria-label="Task: activate to sort column ascending"]'
          ).should("be.visible");
          cy.get(
            '[aria-label="Task: activate to sort column ascending"]'
          ).click();

          cy.get("#taskstable tbody tr .tasktabletask").then(($cells) => {
            const texts = [...$cells].map((cell) => cell.innerText.trim());

            const sorted = [...texts].sort((a, b) => a.localeCompare(b));

            cy.log("Actual: " + JSON.stringify(texts));
            cy.log("Sorted: " + JSON.stringify(sorted));
            console.log("Actual:", texts);
            console.log("Sorted:", sorted);

            expect(texts).to.deep.equal(sorted);
          });
        });

        it("TC 9.14 Check filter ", () => {
          cy.visit(`/netcourier-data/system/user/${taskSectionUser}`);
          cy.handleEscalateRole(Cypress.env("passWord"));
          cy.get("#taskstable_filter > label > input").type(task.task);
          cy.get("#taskstable tbody tr").should("be.visible");
          cy.get("#taskstable tbody tr").first().as("firstRow");
          cy.get("@firstRow")
            .find(".tasktabletask")
            .invoke("text")
            .should("eq", task.task);
        });
      });
    });
    context("Delete oparation of task", () => {
      taskSectionFunctionality.tasks.tasksAdd.forEach((task) => {
        it(`TC 9.15 Delete Task  of description ${task.task}`, () => {
          cy.visit(`/netcourier-data/system/user/${taskSectionUser}`);
          cy.handleEscalateRole(Cypress.env("passWord"));

          cy.get("#updatebutton").should("be.visible");
          cy.get("#updatebutton").click();

          cy.on("window:confirm", (msg) => {
            expect(msg).to.contain(
              "Are you sure you want to delete this item?"
            );
            return true; // click "OK"
          });

          cy.get(
            `#task_${taskIds[iterator]} > [data-headerdetails=""] > .confirm-delete`
          )
            .should("be.visible")
            .click();

          cy.get("#headerconfirmbutton").should("be.visible");
          cy.get("#headerconfirmbutton").click();

          cy.get(
            `#task_${taskIds[iterator]}> [data-headerdetails=""] > .confirm-delete`
          ).should("not.exist");
          cy.get(
            `#task_${taskIds[iterator]}> [data-headerdetails=""] > #tasksmodaleditbutton`
          ).should("not.exist");
          iterator++;
        });
      });
    });
  });

  describe("TC 10 - Appearence of schedule deduction section", () => {
    it(`TC 10.1 Check for schedule deduction section for user ${scheduleDeductionSectionAppearance.driver.fullname} `, () => {
      cy.visit("/netcourier-data/system/user");
      cy.handleEscalateRole(Cypress.env("passWord"));
      cy.intercept("GET", /\/netcourier-data\/search\/advanced\/us\/.*/).as(
        "searchUser"
      );

      cy.get(".navbar-search > .typeahead").type(
        scheduleDeductionSectionAppearance.driver.username
      );
      cy.wait("@searchUser").then((interception) => {
        expect(interception.response, "response should exist").to.not.be
          .undefined;
        if (interception.response) {
          const userId = interception.response.body[0]?.key;
          Cypress.env("userId", userId);
          expect(interception.response.statusCode).to.eq(200);
          cy.log("Found User id: ", userId);
          cy.log("Search response: ", interception.response.body);
        }
      });

      cy.then(() => {
        const userId = Cypress.env("userId");
        expect(userId, "userId should exist").to.not.be.undefined;
        cy.visit(`/netcourier-data/system/user/${userId}`);
        cy.get("#userCode").should(
          "have.value",
          scheduleDeductionSectionAppearance.driver.username
        );
      });
      cy.get("#scheduledDeductionSection").should("be.visible");
    });

    it("TC 10.2 - Check for the columns of schedule deduction section table columns", () => {
      cy.get("#listsofscheduledids thead tr th").then(($headers) => {
        const headerTexts = $headers
          .map((index, th) => Cypress.$(th).text().trim())
          .get();
        const expectedHeaders = [
          "Driver",
          "Deduction",
          "Created by",
          "Updated by",
          "Value paid / total",
          "Payment left",
          "",
        ];
        expect(headerTexts).to.deep.eq(expectedHeaders);
      });
    });

    it("TC 10.3 - Check for add deduction button on the user screen", () => {
      cy.get("#addnewdeduction").should("exist").and("be.visible");
    });
  });
  describe("TC 11 - Functionality of schedule deduction section", () => {
    let scheduleDeductionUser: string | null = null;
    const scheduleDeduction =
      scheduleDeductionSectionFunctionality.scheduleDeductionDetails;
    context("Appearance of schedule deduction modal", () => {
      it("11.1 , 11.2, 11.3 Try to open an user", () => {
        cy.visit("/netcourier-data/system/user");
        cy.handleEscalateRole(Cypress.env("passWord"));
        cy.intercept("GET", /\/netcourier-data\/search\/advanced\/us\/.*/).as(
          "searchUser"
        );
        cy.get(".navbar-search > .typeahead").type(
          scheduleDeductionSectionFunctionality.driver.username
        );
        cy.wait("@searchUser").then((interception) => {
          expect(interception.response, "response should exist").to.not.be
            .undefined;
          if (interception.response) {
            scheduleDeductionUser = interception.response.body[0]?.key;
            Cypress.env("userId", scheduleDeductionUser);
            expect(interception.response.statusCode).to.eq(200);
            cy.log("Found User id: ", scheduleDeductionUser);
            cy.log("Search response: ", interception.response.body);
            cy.visit(`/netcourier-data/system/user/${scheduleDeductionUser}`);
          }
        });
      });

      it("TC 11.4 Click on the add button under the schedule deduction section", () => {
        cy.get("#updatebutton").should("be.visible");
        cy.get("#updatebutton").click();
        cy.get("#addnewdeduction").click();
      });

      it("TC 11.5 Chechkfor schedule deduction section items", () => {
        cy.get("#scheduleductionForm").should("be.visible");
        cy.contains("label", "Driver:").should("be.visible");
        cy.contains(
          "span",
          scheduleDeductionSectionFunctionality.driver.fullname
        ).should("be.visible");

        cy.contains("label", "Extra name:").should("be.visible");
        cy.contains("label", "Total value:").should("be.visible");
        cy.contains("span", "split over").should("be.visible");
        cy.contains("label", "Payment value of:").should("be.visible");
        cy.contains("label", "Price line analysis:").should("be.visible");
        cy.contains("label", "Description:").should("be.visible");
        cy.contains("button", "Cancel").should("be.visible");
        cy.contains("button", "Create extra").should("be.visible");
      });

      it("TC 11.6 Click on create extra button ", () => {
        cy.get(".btn-primary").click();
        cy.get(".controls > .help-block > .error").should("be.visible");
        cy.get(
          ":nth-child(3) > .controls > .input-append > :nth-child(4)"
        ).should("be.visible");
        cy.get(
          ":nth-child(3) > .controls > .input-append > :nth-child(5)"
        ).should("be.visible");
      });

      it("TC 11.7 Click on the cancel button", () => {
        cy.get(".xmodalclose").click();
        cy.get("#scheduleductionForm").should("not.be.visible");
      });
      it("TC 11.8 Click on the add button under the schedule deduction section", () => {
        cy.get("#addnewdeduction").click();
        cy.get("#scheduleductionForm").should("be.visible");
        cy.get(".xmodalclose").click();

        cy.get("#headerconfirmbutton").should("be.visible");
        cy.get("#headerconfirmbutton").click();
      });
    });

    scheduleDeduction.forEach((scheduleDeduction) => {
      context(
        `Add, edit, filter functionality test for deduction${scheduleDeduction.extraName}`,
        () => {
          it("TC 11.9 Add a schedule deduction ", () => {
            cy.get("#updatebutton").click();
            cy.get("#addnewdeduction").click();
            cy.get("#scheduleductionForm").should("be.visible");
            cy.get(":nth-child(2) > .controls > #name").type(
              scheduleDeduction.extraName
            );
            cy.get("#startValue").type(scheduleDeduction.totalValue);
            cy.get("#numbersOfPayment").type(scheduleDeduction.splitOver);
            cy.get("#description").type(scheduleDeduction.description);
            cy.get(".btn-primary").click();
            cy.get("#headerconfirmbutton").click();
          });

          it("TC 11.10 Check that schedule deduction has been added to the task section", () => {
            cy.get("#listsofscheduledids tbody tr").last().as("lastRow");
            cy.get("@lastRow")
              .find('td[data-headerdetails="Driver"] a')
              .invoke("text")
              .should(
                "eq",
                scheduleDeductionSectionFunctionality.driver.fullname
              );

            cy.get("@lastRow")
              .find('td[data-headerdetails="Deduction"] span')
              .invoke("text")
              .then((deductionName) => {
                cy.log("Last row deduction:", deductionName.trim());
              });
          });

          it("TC 11.11 Check for a edit and delete button beside each schedule deduction", () => {
            cy.get("#listsofscheduledids tbody tr").each(($row) => {
              cy.wrap($row)
                .find('a#editdeduction[title="Update scheduled deduction"]')
                .should("exist");
              cy.wrap($row).find("button.confirm-delete").should("exist");
            });
          });

          it("TC 11.12 Click on the edit button and check data ", () => {
            cy.get("#updatebutton").click();
            cy.get("#listsofscheduledids tbody tr")
              .last() // get the last row
              .find("a#editdeduction") // find the edit button inside it
              .click();

            cy.get("#scheduleductionForm").should("be.visible");
            cy.get(":nth-child(2) > .controls > #name").should("be.visible");
            cy.get("#remainingValue").should("be.visible");
            cy.get("#remainingNumberOfPayment").should("be.visible");

            //  cy.get(":nth-child(2) > .controls > #name").should(
            //  "contain",
            //    scheduleDeduction.extraName
            //  );
            //  cy.get("#remainingValue").should(
            //    "contain",
            //    scheduleDeduction.totalValue
            //  );
            //  cy.get("#remainingNumberOfPayment").should(
            //    "contain",
            //    scheduleDeduction.splitOver
            //  );
            cy.get("#description").should(
              "contain",
              scheduleDeduction.description
            );
          });

          it("TC 11.13, 11.14 Add price line analysis and check ", () => {
            cy.get("#priceLineAnalysisCode").select(
              scheduleDeduction.priceLineAnalysis
            );
            cy.get(".btn-primary").click();

            cy.get("#listsofscheduledids tbody tr")
              .last()
              .find("a#editdeduction")
              .click();
            cy.get("#priceLineAnalysisCode").should(
              "contain",
              scheduleDeduction.priceLineAnalysis
            );
            cy.get(".xmodalclose").click();
            cy.get("#headerconfirmbutton").should("be.visible");
            cy.get("#headerconfirmbutton").click();
          });

          it("TC 11.15 Filter based on deduction field", () => {
            cy.visit(`/netcourier-data/system/user/${scheduleDeductionUser}`);
            cy.handleEscalateRole(Cypress.env("passWord"));
            cy.get("#listsofscheduledids_filter > label > input").type(
              scheduleDeduction.extraName
            );

            cy.get("#listsofscheduledids tbody tr")
              .first()
              .find('td[data-headerdetails="Deduction"] span')
              .should("have.text", scheduleDeduction.extraName);
          });
        }
      );
    });
    context("Check sort functionality and delete ", () => {
      it("TC 11.16 Sort by 'Created by' and verify the table is sorted", () => {
        cy.visit(`/netcourier-data/system/user/${scheduleDeductionUser}`);
        cy.handleEscalateRole(Cypress.env("passWord"));
        // Click the 'Created by' column header to sort ascending
        cy.get(
          '[aria-label="Created by: activate to sort column ascending"]'
        ).click();

        // Grab the first span in each 'Created by' cell
        cy.get(
          '#listsofscheduledids tbody tr td[data-headerdetails="Created by"] span:first-child'
        ).then(($cells) => {
          const createdByValues = [...$cells].map((cell) =>
            cell.innerText.trim()
          );
          cy.log(
            "Captured Created by values (ascending): " +
              createdByValues.join(", ")
          );

          const sortedValues = [...createdByValues].sort((a, b) =>
            a.localeCompare(b)
          );
          cy.log(
            "Expected sorted values (ascending): " + sortedValues.join(", ")
          );

          expect(createdByValues).to.deep.equal(sortedValues);
        });
      });
    });

    context("Delete operation of scheduled deductions", () => {
      scheduleDeduction.forEach((scheduleDeduction) => {
        it(`TC Delete scheduled deduction ${scheduleDeduction.extraName}`, () => {
          cy.visit(`/netcourier-data/system/user/${scheduleDeductionUser}`);
          cy.handleEscalateRole(Cypress.env("passWord"));
          cy.get("#updatebutton").click();
          // Automatically handle browser confirm dialog
          cy.on("window:confirm", () => true);

          // Locate row containing the deduction name
          cy.contains(
            "#listsofscheduledids tbody tr",
            scheduleDeduction.extraName
          ).as("targetRow");

          // Click its delete button
          cy.get("@targetRow").find(".confirm-delete").click();

          // Confirm deletion action
          cy.get("#headerconfirmbutton").should("be.visible").click();

          // Assert that this row no longer exists in the table
          cy.contains(
            "#listsofscheduledids tbody tr",
            scheduleDeduction.extraName
          ).should("not.exist");
        });
      });
    });
  });
  describe("TC 12 - API access key functionality", () => {
    context("Check the functionality of API access key field", () => {
      it(`TC 12.1 - Open the user ${userTocheckAPIKeyField.username}`, () => {
        cy.visit("/netcourier-data/system/user");
        cy.handleEscalateRole(Cypress.env("passWord"));
        cy.intercept("GET", /\/netcourier-data\/search\/advanced\/us\/.*/).as(
          "searchUser"
        );
        cy.get(".navbar-search > .typeahead").type(
          userTocheckAPIKeyField.username
        );
        cy.wait("@searchUser").then((interception) => {
          expect(interception.response).to.not.be.undefined;
          if (interception.response) {
            const userId = interception.response.body[0]?.key;
            Cypress.env("userId", userId);
            cy.visit(`/netcourier-data/system/user/${userId}`);
          }
        });
      });

      it("TC 12.2 - Check API Access Key field is blank and has Generate & Clear buttons", () => {
        cy.get("#user_apiKeyView").should("have.value", "");
        cy.get("#user_btnGenApiKey > i").should("be.visible");
        cy.get("#user_btnClearApiKey > i").should("be.visible");
      });
      it("TC 12.3 - Click Update button then verify Generate and Clear buttons are clickable", () => {
        cy.get("#updatebutton").should("be.visible");
        cy.get("#updatebutton").click();

        cy.get("#user_btnGenApiKey > i")
          .should("be.visible")
          .and("not.be.disabled");

        cy.get("#user_btnClearApiKey > i")
          .should("be.visible")
          .and("not.be.disabled");
      });

      it("TC 12.4 - Click Generate button, API key will be created and Eye button will appear", () => {
        cy.get("#user_btnGenApiKey > i").should("be.visible").click();

        cy.get("#user_apiKeyView").should("not.have.value", "");

        cy.get("#user_btnHideApiKey > i")
          .should("be.visible")
          .and("not.be.disabled");
      });

      it("TC 12.5 - User should be able to copy the API key from the field", () => {
        cy.get("#user_apiKeyView")
          .should("not.have.value", "")
          .invoke("val")
          .then((apiKey) => {
            //verify
            expect(apiKey).to.not.be.empty;
          });
      });
      it("TC 12.6 - Click Confirm button, key will be saved and field will be starred", () => {
        cy.get("#headerconfirmbutton").should("be.visible");
        cy.get("#headerconfirmbutton").click();
        cy.get("#updatebutton").should("be.visible");

        //verify
        cy.get("#user_apiKeyView")
          .should("exist")
          .invoke("val") // for input fields
          .then((value) => {
            // Check if the displayed value is masked
            expect(value).to.match(/^\*+$/); // matches one or more asterisks
          });
      });

      it("TC 12.7 - Click on the update button again, API access key field buttons should be clickable", () => {
        cy.get("#updatebutton").should("be.visible");
        cy.get("#updatebutton").click();

        cy.get("#user_btnGenApiKey > i")
          .should("be.visible")
          .and("not.be.disabled");

        cy.get("#user_btnClearApiKey > i")
          .should("be.visible")
          .and("not.be.disabled");
      });

      it("TC 12.8 - Click on the eye button then API key visible", () => {
        cy.get("#user_btnShowApiKey > i").click();

        // Verify
        cy.get("#user_apiKeyView")
          .invoke("val") // for input/textarea
          .then((value) => {
            expect(value).to.not.match(/^\*+$/); // ensures it's not all stars
            cy.log("Value is visible:", value);
          });
      });

      it("TC 12.9 - Click on the crossed-eye button then API key starred out", () => {
        cy.get("#user_btnHideApiKey > i").click();

        cy.get("#user_apiKeyView")
          .should("exist")
          .invoke("val")
          .then((maskedValue) => {
            // Cast to string so TypeScript knows it's a string
            const valueStr = String(maskedValue ?? "");

            // Remove any leading/trailing quotes
            const cleanedValue = valueStr.replace(/^'+|'+$/g, "");
            cy.log("Masked API key value:", cleanedValue);

            // Assert it is all stars
            expect(cleanedValue).to.match(/^\*+$/);
          });
      });
      it("TC 12.10 - Click on the generate button again then A new API key is generated", () => {
        cy.get("#user_btnShowApiKey > i").should("be.visible").click();
        cy.get("#user_apiKeyView")
          .invoke("val")
          .then((oldKey) => {
            cy.get("#user_btnGenApiKey > i").should("be.visible").click();

            // Verify
            cy.get("#user_apiKeyView")
              .invoke("val")
              .should((newKey) => {
                expect(newKey).to.not.eq(oldKey);
                expect(newKey).to.not.be.empty;
              });
          });
      });
    });
  });

  describe("TU 13 - Delete users  Test", () => {
    const existingvehicle = vehicleSectionFunctionality.currentVehicle;
    const updatevehicle = vehicleSectionFunctionality.updatedVehicle;

    const handheldUsers = addUser?.handheldUser ?? [];
    const updatedUsers = updateUser?.updatedUser ?? [];
    const copiedUsers = copyUser?.copiedUser ?? [];

    const allUsers = [...handheldUsers, ...updatedUsers, ...copiedUsers];

    allUsers.forEach((user) => {
      const username = user?.username; // nullable safe

      it(`TC 13.1 Check & Archive User ${username ?? "UNKNOWN"}`, () => {
        if (!username) {
          cy.log("Skipping test because username is null/undefined");
          return;
        }

        cy.visit("/netcourier-data/system/user");
        cy.handleEscalateRole(Cypress.env("passWord"));
        cy.intercept("GET", /\/netcourier-data\/search\/advanced\/us\/.*/).as(
          "searchUser"
        );

        cy.get(".navbar-search > .typeahead").type(username);
        cy.wait("@searchUser").then((interception) => {
          const response = interception?.response;
          if (
            !response ||
            !Array.isArray(response.body) ||
            response.body.length === 0
          ) {
            cy.log(`User ${username} not found in search`);
            return;
          }

          const userId = response.body[0]?.key ?? null;
          if (!userId) {
            cy.log(`User ID not found for ${username}`);
            return;
          }

          Cypress.env("userId", userId);
          expect(response.statusCode).to.eq(200);
          cy.log("Found User id: ", userId);

          cy.visit(`/netcourier-data/system/user/${userId}`);

          cy.get("#userCode").then(($input) => {
            const actualValue = $input?.val() as string | undefined;

            if (actualValue && actualValue === username) {
              cy.get("#archivebutton").should("be.visible").click();
              cy.log(`Archived user ${username}`);
            } else {
              cy.log(
                `Skipping archive for ${username}, userCode mismatch or empty`
              );
            }
          });
        });
      });
    });

    it(`TC 13.2 - Restore vehicle details of ${updatevehicle.numberplate}`, () => {
      cy.visit("/netcourier-data/system/user");
      cy.handleEscalateRole(Cypress.env("passWord"));
      cy.intercept("GET", /\/netcourier-data\/search\/advanced\/us\/.*/).as(
        "searchVehicle"
      );

      cy.get(".navbar-search > .typeahead").type(updatevehicle.numberplate);

      cy.wait("@searchVehicle").then((interception) => {
        expect(interception.response, "response should exist").to.not.be
          .undefined;
        if (interception.response) {
          const vehicleId = interception.response.body[0]?.key;
          Cypress.env("vehicleId", vehicleId);
          expect(interception.response.statusCode).to.eq(200);
          expect(interception.response.body[0]?.type).to.eq("vh");
          cy.log("Found Vehilce id: ", vehicleId);
          cy.log("Search response: ", interception.response.body);
        }
      });

      cy.then(() => {
        const vehicleId = Cypress.env("vehicleId");
        expect(vehicleId, "Vehicle Id should exist").to.not.be.undefined;
        cy.visit(`/netcourier-data/vehicle/${vehicleId}`);
        cy.get("#numberPlate").should("have.value", updatevehicle.numberplate);
      });

      cy.get("#updatebutton").click();

      const dateMotExprStr = existingvehicle.motexpirydate;
      const dateTaxExprStr = existingvehicle.taxexpirydate;

      const motExprTemp = new Date(dateMotExprStr);
      const taxExprTemp = new Date(dateTaxExprStr);

      const formattedMot = format(motExprTemp, "dd-MM-yyyy");
      const formattedTax = format(taxExprTemp, "dd-MM-yyyy");

      cy.get("#numberPlate").type(existingvehicle.numberplate);
      cy.get("#MotExpir").type(formattedMot);
      cy.get("#TaxExpir").type(formattedTax);

      cy.get("#assignedToSearch").clear();
      cy.get("#headerconfirmbutton").click();
    });
  });

  after("Logging out", () => {
    cy.visit("/app");
    cy.get(".account-user-name").click();
    cy.get('a[href="/app/account/logout"]').click();
  });
});

