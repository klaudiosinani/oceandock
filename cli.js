#!/usr/bin/env node
'use strict';
const meow = require('meow');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const {hyperocean, helpMessage} = require('.');

const cli = meow(helpMessage, {
  alias: {
    i: 'install',
    u: 'uninstall',
    r: 'reinstall',
    h: 'help'
  }
});

updateNotifier({pkg}).notify();

hyperocean(cli.flags);
