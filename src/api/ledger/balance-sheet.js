'use strict';

const _ = require('lodash');
const utils = require('./utils');
const validate = utils.common.validate;
const composeAsync = utils.common.composeAsync;
const convertErrors = utils.common.convertErrors;

function formatBalanceSheet(balanceSheet) {
  const result = {};

  if (!_.isUndefined(balanceSheet.balances)) {
    result.balances = _.map(balanceSheet.balances, (balances, counterparty) =>
                            ({counterparty, balances}));
  }
  if (!_.isUndefined(balanceSheet.assets)) {
    result.assets = _.map(balanceSheet.assets, (assets, counterparty) =>
                          ({counterparty, assets}));
  }
  if (!_.isUndefined(balanceSheet.obligations)) {
    result.obligations = _.map(balanceSheet.obligations, (value, currency) =>
                               ({currency, value}));
  }

  return result;
}

function getBalanceSheetAsync(address, options, callback) {
  validate.address(address);
  validate.getBalanceSheetOptions(options);

  const requestOptions = Object.assign({}, {
    account: address,
    strict: true,
    hotwallet: options.excludeAddresses,
    ledger: options.ledgerVersion
  });

  const requestCallback = composeAsync(
    formatBalanceSheet, convertErrors(callback));

  this.remote.getLedgerSequence((err, ledgerVersion) => {
    if (err) {
      callback(err);
      return;
    }

    if (_.isUndefined(requestOptions.ledger)) {
      requestOptions.ledger = ledgerVersion;
    }

    this.remote.requestGatewayBalances(requestOptions, requestCallback);
  });
}

function getBalanceSheet(address: string, options = {}) {
  return utils.promisify(getBalanceSheetAsync).call(this, address, options);
}

module.exports = getBalanceSheet;
