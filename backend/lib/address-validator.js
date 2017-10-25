
const WAValidator = require('wallet-address-validator');
const SHA3 = require('crypto-js/sha3');


export function sha3(value) {
  return SHA3(value, { outputLength: 256 }).toString();
}

// this function completes the isEtherAddress() function.
export function isChecksumAddress(address) {
  // Check each case
  const trimmedAddress = address.replace('0x','');
  const addressHash = sha3(trimmedAddress.toLowerCase());

  for (let i = 0; i < 40; i++) {
    // The nth letter should be uppercase if the nth digit of casemap is 1
    if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) ||
      (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
      return false;
    }
  }
  return true;
}

// this is the ethereum address checker. it also checks for checksums addresses
export function isEtherAddress(address) {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    // Check if it has the basic requirements of an address
    return false;
  } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
    // If it's all small caps or all all caps, return true
    return true;
  }
  return isChecksumAddress(address);
}

// this function combines the btc check with the ethereum check
export function checkEthOrBtcAddress(address) {
  if (address[0] !== '0' && address[1] !== 'x') {
    if (!WAValidator.validate(address, 'BTC', 'both')) {
      throw new Error('Bitcoin Address is not valid, please enter a valid BTC or ETH address');
    }
  } else if (!isEtherAddress(address)) {
    throw new Error('Ethereum Address is not valid, please enter a valid BTC or ETH address');
  }
}
