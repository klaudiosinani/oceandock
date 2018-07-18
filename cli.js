#!/usr/bin/env node
'use strict';
const meow = require('meow');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const {oceandock, helpMessage} = require('.');

const cli = meow(helpMessage, {
  flags: {
    install: {
      type: 'boolean',
      alias: 'i'
    },
    uninstall: {
      type: 'boolean',
      alias: 'u'
    },
    reinstall: {
      type: 'boolean',
      alias: 'r'
    },
    help: {
      type: 'boolean',
      alias: 'h'
    },
    version: {
      type: 'boolean',
      alias: 'v'
    }
  }
});

updateNotifier({pkg}).notify();

oceandock(cli.flags);
