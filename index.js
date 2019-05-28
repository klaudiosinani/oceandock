#!/usr/bin/env node
'use strict';
const os = require('os');
const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const {Signale} = require('signale');
const pkg = require('./package.json');

const {join, resolve} = path;
const {version} = pkg;
const types = {info: {label: 'version'}};

const signale = new Signale({types});

const themeFile = 'dock.theme';
const plankBin = '/usr/bin/plank';
const themeFilePath = resolve(__dirname, themeFile);
const localThemeDir = join(os.homedir(), '.local/share/plank/themes/Oceandock');
const localThemeFilePath = join(localThemeDir, themeFile);

const helpMessage = `
  Usage
    $ oceandock [option]

    Options
      --help, -h        Display help message
      --install, -i     Install theme
      --uninstall, -u   Uninstall theme
      --reinstall, -r   Reinstall theme
      --version, -v     Display installed version

    Examples
      $ oceandock
      $ oceandock --install
      $ oceandock --uninstall
      $ oceandock --version
      $ oceandock --help
`;

function installTheme() {
  if (fs.existsSync(localThemeFilePath)) {
    signale.warn('Oceandock already installed');
  } else {
    fs.mkdirSync(localThemeDir);
    fs.copyFileSync(themeFilePath, localThemeFilePath);
    signale.success('Installed Oceandock');
  }
}

function uninstallTheme() {
  if (fs.existsSync(localThemeDir)) {
    fs.unlinkSync(localThemeFilePath);
    fs.rmdirSync(localThemeDir);
    signale.success('Uninstalled Oceandock');
  } else {
    signale.warn('Oceandock already uninstalled');
  }
}

function reinstallTheme() {
  if (fs.existsSync(localThemeDir)) {
    fs.unlinkSync(localThemeFilePath);
    fs.rmdirSync(localThemeDir);
  }

  fs.mkdirSync(localThemeDir);
  fs.copyFileSync(themeFilePath, localThemeFilePath);
  signale.success('Reinstalled Oceandock');
}

function displayVersion() {
  signale.info(version);
}

function displayHelp() {
  signale.unscope();
  signale.log(helpMessage);
}

function exitMenu() {
  process.exit(0);
}

const options = [{
  type: 'list',
  name: 'installation',
  message: 'Oceandock Theme - Choose an action:',
  choices: ['Install', 'Uninstall', 'Reinstall', 'Version', 'Help', 'Exit']
}];

function setAction(action) {
  switch (action) {
    case ('Install'):
      installTheme();
      break;

    case ('Uninstall'):
      uninstallTheme();
      break;

    case ('Reinstall'):
      reinstallTheme();
      break;

    case ('Version'):
      displayVersion();
      break;

    case ('Help'):
      displayHelp();
      break;

    case ('Exit'):
      exitMenu();
      break;

    default:
      break;
  }
}

function askForAction() {
  inquirer.prompt(options).then(answers => {
    const action = answers;
    setAction(action.installation);
  });
}

const oceandock = flags => {
  if (fs.existsSync(plankBin)) {
    if (flags.install) {
      return installTheme();
    }

    if (flags.uninstall) {
      return uninstallTheme();
    }

    if (flags.reinstall) {
      return reinstallTheme();
    }

    return askForAction();
  }

  signale.error('Plank dock was not found on your system.');
  process.exit(0);
};

module.exports = {oceandock, helpMessage};
