<template>
<transition name="modal">
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="top-logo">
        <img src="/static/assets/cb-logo-green.png" />
      </div>
      <div class="tab-title">
        Welcome to the CommerceBlock Whitelist Service
      </div>
      <div class="modal-container">
        <!-- <div class="modal-header">

          </div> -->
        <div class="modal-body">
          <slot name="body">
            <div v-if=errorResponse class="alert alert-danger error-message" role="alert">
              <p>{{errorResponse}}</p>
            </div>
            <div class="row">
              <div class="text-center">
                <h4>Please fill in your contribution information</h4>
              </div>
            </div>
            <div class="row">
              <!-- <div class="text-center text-muted"> -->
                <h5>Please enter in your Bitcoin or Ethereum Address where the funds will be sent from</h5>
              <!-- </div> -->
            </div>
            <div class="row">
              <div v-bind:class="{ 'details-input-red': !isAddressValid, 'details-input-green': isAddressValid }">
                <input class="form-control span6" placeholder="Enter your BTC or ETH address" v-model="address" />
              </div>
            </div>
            <div class="row">
              <!-- <div class="text-center text-muted"> -->
                <h5>Please enter your expected contribution amount in USD (min 300)</h5>
              <!-- </div> -->
            </div>
            <div class="row">
              <div class="form-group">
                <div v-bind:class="{ 'details-input-red': !isAmountValid, 'details-input-green': isAmountValid }">
                  <input class="form-control span6" placeholder="Enter your contribution amount in USD" v-model="amount" />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="checkbox">
                <label><input type="checkbox"  v-model="checked">I certify that I am not a citizen or resident of the United States of America, The Republic of Singapore or The People's Republic of China</label>
              </div>
            </div>
            <div class="row">
              <div class="checkbox" v-bind:class="{ 'kyc-input-hidden': !isKYCRequired }">
                <label><input type="checkbox" v-model="kycChecked">I confirm that KYC documentation must be submitted for contributions of more than 11.5k USD and failure to submit may result in a refund</label>
              </div>
            </div>
          </slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <button class="btn btn-success btn-lg btn-block" @click="submit" :disabled="isFormNotValid">
                <div v-if="idle">Submit Address</div>
                <div v-if="!idle">
                  <div class="spinner">
                      <div class="bounce1"></div>
                      <div class="bounce2"></div>
                      <div class="bounce3"></div>
                    </div>
                  </div>
              </button>
          </slot>

          <div class="text-center text-muted" id="modal-footer-note">
            This is a check for AML compliance. If your sending address is rejected please contact us via our Telegram channel. For contributions of more than 11,500 USD please register for KYC once your address has been confirmed as verified
          </div>

        </div>
      </div>
    </div>
    <div class="bottom-logo">
      <img src="/static/assets/commcerblock-big-gray.png" />
    </div>
  </div>
</transition>
</template>

<script>
import gql from 'graphql-tag';
import httpStatus from 'http-status-codes';
import {
  isEmpty
} from 'lodash';
import endpoints from '../lib/endpoints'

// consts
const amountPattern = /^[0-9]+(\.[0-9][0-9])?$/;
const minAmount = 300;
const maxAmount = 11500;

export default {
  name: 'Home',
  props: ['refId'],
  data() {
    return {
      address: null,
      checked: null,
      amount: null,
      errorResponse: null,
      kycChecked: null,
      idle: true,
    }
  },
  methods: {
    submit() {
      // TODO:: toggle progress bar
      if (!this.isAddressValid) {
        // empty phrase
        this.errorResponse = 'Address is not valid, please enter a valid BTC or ETH address';
      } else if (!this.isAmountValid) {
        // check phrase
        this.errorResponse = `Amount is not valid, please enter an amount greater than $${minAmount.toFixed(2)}`;
      } else if(!this.checked) {
        this.errorResponse = `You must accept terms in order to proceed`;
      } else {
        this.errorResponse = null;
        const that = this;
        // spinner
        that.idle = false;
        this.doCheck()
          .then(this.handleCheckResult)
          .catch(this.handleGenericError)
      }
    },
    handleCheckResult(address) {
      // disable spinner
      this.idle = true;
      this.$router.push(`/addresses/${address}`);
    },
    handleGenericError(error) {
      // disable spinner
      this.idle = true;
      console.log(error);
      if (error && error.graphQLErrors && !isEmpty(error.graphQLErrors)) {
        // this.errorResponse = error.graphQLErrors[0].message;
        this.errorResponse = 'Address is not valid, please enter a valid BTC or ETH address'
      } else {
        this.errorResponse = 'Unexpected error occured, please try again.';
      }
    },
    doCheck() {
      const amountInt = Number(this.amount)
      return this.apolloClient
        .mutate({
          mutation: gql`mutation {
                  createAddress(addressInput: {
                    address: "${this.address}"
                    refId: "${this.sanitizedRefId}"
                    amount: ${amountInt}
                  })
                }`
        })
        .then(result => result.data.createAddress)
        .catch(err => {
          // TODO: show error
          console.log(err)
          return Promise.reject(err);
        });
    },
  },
  computed: {
    amountInt() {
      try {
        const allowedAmount = amountPattern.test(this.amount);
        if (allowedAmount) {
          return Number(this.amount);
        }
      } catch (err) {
      }
      return null;
    },
    isAddressValid() {
      return !isEmpty(this.address) && this.address.length >= 34 && this.address.length <= 50;
    },
    isAmountValid() {
      try {
        const amountInt = this.amountInt
        return amountInt && amountInt >= minAmount;
      } catch (err) {
        console.log(err)
      }
    },
    isFormNotValid() {
      return !this.isAddressValid || !this.isAmountValid || !this.checked || (this.isKYCRequired && !this.kycChecked);
    },
    apolloClient () {
      return this.$apollo.provider.defaultClient;
    },
    sanitizedRefId () {
      return (!isEmpty(this.refId) && this.refId.substring(0, 50)) || null;
    },
    isKYCRequired() {
      return this.isAmountValid && this.amountInt && this.amountInt >= maxAmount;
    }
  },
}
</script>

<style scoped>
.error-message {
  position: absolute;
  width: 100%;
  top: -35px;
  left: 0px;
}

.modal-mask {
  /* position: fixed; */
  /*z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f9f9f9;
  display: table;
  transition: opacity .3s ease;*/
  display: flex;
  justify-content: center;
}

.modal-wrapper {
  /* display: table-cell; */
  vertical-align: middle;
}

.modal-container {
  max-width: 650px;
  /*height: 500px;*/
  margin: 0px auto;
  padding: 40px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
  margin-top: 30px;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-header {
  text-align: center;
}

.modal-footer {
  padding: 0 !important;
  padding-top: 10px;
  border: none;
}

#modal-footer-note {
  /*position: relative;
  bottom: -80px;*/
  margin-top: 15px;
}


/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.loginForm .input-group {
  padding-bottom: 1em;
  height: 4em;
  display: block !important;
}

.input-group input {
  height: 4em;
}

textarea {
  resize: none;
}

.details-input-red input:focus {
  border-color: red;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(126, 239, 104, 0.6);
  outline: 0 none;
}

.details-input-green input:focus {
  border-color: #258C42;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(126, 239, 104, 0.6);
  outline: 0 none;
}

.tab-title {
  color: #141414;
  font-family: "Open Sans";
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
  text-align: center;
}

.login-description {
  color: #141414;
  font-family: "Open Sans";
  font-size: 14px;
  line-height: 19px;
  margin: 5px 0 30px 0;
}

.modal-body.small {
  margin: 10px 0;
}

.top-logo {
  text-align: center;
  margin-bottom: 10px;
  padding-top: 30px
}

.bottom-logo {
  position: absolute;
  z-index: -1;
  bottom: 0;
  right: 0;
}

.spinner {
  margin: 0 auto 0;
  width: 70px;
  text-align: center;
}

.spinner > div {
  width: 18px;
  height: 18px;
  background-color: #ffffff;

  border-radius: 100%;
  display: inline-block;
  -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.kyc-input-hidden {
  visibility: hidden;
}

.spinner .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@-webkit-keyframes sk-bouncedelay {
  0%, 80%, 100% { -webkit-transform: scale(0) }
  40% { -webkit-transform: scale(1.0) }
}

@keyframes sk-bouncedelay {
  0%, 80%, 100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  } 40% {
    -webkit-transform: scale(1.0);
    transform: scale(1.0);
  }
}

</style>
