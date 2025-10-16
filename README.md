# Installing System Dependencies

## For Ubuntu < 24.04

```bash
apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libnss3 libxss1 libasound2 libxtst6 xauth xvfb
```

## For Ubuntu 24.04 and above

```bash
apt-get install libgtk2.0-0t64 libgtk-3-0t64 libgbm-dev libnotify-dev libnss3 libxss1 libasound2t64 libxtst6 xauth xvfb
```

## Install NVM

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

## Install latest node version 24

```bash
nvm install node
```

## Use latest node version 24

```bash
nvm use 24
```

# Insalling Project Dependencies

## clone project

```bash
git clone https://github.com/akib-hasan-m4/netcourier-ui-tests.git
```

## Install Node dependencies in project directory

```bash
npm install
```

# Running Cypress Test Cases

## Create the .env file

Create the .env file in the project folder with the following data (only keys for the data are given here). You can also copy and rename the .sampleEnv file in the repo.

```bash
BASE_URL=
ACCESS_CODE=
USER_NAME=
PASSWORD=
SLOWDOWNMS=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET=
```

## Launch cypress test runner (GUI)

```bash
npx cypress open
```

## Run all tests

```bash
npx cypress run
```

## Run specific test file

```bash
npx cypress run --spec "cypress/tests/back-office/user-screen/user-screen.spec.ts"
```
