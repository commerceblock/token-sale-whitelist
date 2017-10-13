// dependencies to check addresses ******** TO EXPORT IN OTHER FILE TOGETHER WITH ADDRESS CHECKING LOGIC
const WAValidator = require('wallet-address-validator');
const SHA3 = require('crypto-js/sha3');


// I left this code inside this file, but it would be nice to export all the checking logic and import it in a single function checkEthBtcAddress().
// **********************TO EXPORT*****************************************************
// this is a dependency to check eth address
let sha3 = (value) => {
  return SHA3(value, {
    outputLength: 256
  }).toString();
}

// this is the ethereum address checker. it also checks for checksums addresses
let isEtherAddress = (address) => {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    // Check if it has the basic requirements of an address
    return false;
  }
  else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
    // If it's all small caps or all all caps, return true
    return true;
  }
  else {
    // Otherwise check each case
    return isChecksumAddress(address);
  }
};

// this function completes the isEtherAddress() function.
let isChecksumAddress = function (address) {
  // Check each case
  address = address.replace('0x','');
  let addressHash = sha3(address.toLowerCase());

  for (let i = 0; i < 40; i++ ) {
    // The nth letter should be uppercase if the nth digit of casemap is 1
    if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) ||
      (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
      return false;
    }
  }
  return true;
};

// this function combines the btc check with the ethereum check
export function checkEthBtcAddress (address) {
  if (address[0] !== '0' && address[1] !== 'x') {
    if (!WAValidator.validate(address, 'BTC', 'both')) {
      throw 'Bitcoin Address not valid.';
    }
  } else if (!isEtherAddress(address)){
    throw 'Ethereum Address not valid.';
  }
}
// ***************************************************************************
