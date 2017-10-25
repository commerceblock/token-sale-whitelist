
const WAValidator = require('wallet-address-validator');
const Web3Utils = require('web3-utils');


// this function combines the btc check with the ethereum check
export function checkEthOrBtcAddress(address) {
  if (address[0] !== '0' && address[1] !== 'x') {
    if (!WAValidator.validate(address, 'BTC', 'both')) {
      throw new Error('Bitcoin Address is not valid, please enter a valid BTC or ETH address');
    }
  } else if (!Web3Utils.isAddress(address)) {
    throw new Error('Ethereum Address is not valid, please enter a valid BTC or ETH address');
  }
}
