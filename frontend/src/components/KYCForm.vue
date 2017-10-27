<template>
<transition name="modal">
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <slot name="header">
            <span class="tab-title">Welcome to the CommerceBlock Whitelist Service</span>
          </slot>
        </div>
        <div v-if="status==='unknown'">
          <div class="modal-body">
            <slot name="body">
              <div class="row text-center">
                <h4> This address has not been recorded, please make sure to submit the address <router-link to="/">here</router-link></h4>
              </div>
            </slot>
          </div>
        </div>
        <div v-if="status==='pending'">
          <div class="modal-body">
            <slot name="body">
              <div class="row text-center">
                <h4>Thank you for providing the information, will be processing your request and contact you as soon as possible.</h4>
              </div>
            </slot>
          </div>
        </div>
        <div v-if="status==='rejected' || status==='close'">
          <div class="modal-body">
            <slot name="body">
              <div class="row text-center">
                <h4>We can't accept an application for this address.</h4>
              </div>
            </slot>
          </div>
        </div>
        <div v-if="status==='open'">
          <div class="modal-body">
            <div v-if=errorResponse class="alert alert-danger custom-alert" role="alert">
              <p>{{errorResponse}}</p>
            </div>
            <slot name="body">
              <div class="row">
                <h4>Please fill up the form below.</h4>
              </div>
              <div class="form-horizontal" role="form">
                <div class="form-group">
                  <label for="firstName" class="col-sm-3 control-label no-padding">First Name</label>
                  <div class="col-sm-9" v-bind:class="{ 'input-field-red': beforeSubmit && isFirstNameNotValid }">
                    <input type="text" id="firstName" placeholder="First Name" class="form-control" v-model="firstName" autofocus>
                  </div>
                </div>
                <div class="form-group">
                  <label for="lastName" class="col-sm-3 control-label no-padding">Last Name</label>
                  <div class="col-sm-9" v-bind:class="{ 'input-field-red': beforeSubmit && isLastNameNotValid }">
                    <input type="text" id="lastName" placeholder="Last Name" class="form-control" v-model="lastName" autofocus>
                  </div>
                </div>
                <div class="form-group">
                  <label for="title" class="col-sm-3 control-label no-padding">Title</label>
                  <div class="col-sm-9 custom-radio-group" v-bind:class="{ 'input-field-red': beforeSubmit && isTitleNotValid }">
                    <input type="radio" class="custom-radio" id="title-mr" value="Mr" v-model="title"><label class="custom-label" for="Mr">Mr</label>
                    <input type="radio" class="custom-radio" id="title-mrs" value="Mrs" v-model="title"><label class="custom-label" for="Mrs">Mrs</label>
                    <input type="radio" class="custom-radio" id="title-miss" value="Miss" v-model="title"><label class="custom-label" for="Miss">Miss</label>
                    <input type="radio" class="custom-radio" id="title-ms" value="Ms" v-model="title"><label class="custom-label" for="Ms">Ms</label>
                  </div>
                </div>
                <div class="form-group">
                  <label for="lastName" class="col-sm-3 control-label no-padding">Email</label>
                  <div class="col-sm-9" v-bind:class="{ 'input-field-red': beforeSubmit && isEmailNotValid }">
                    <input type="text" id="email" placeholder="Email" class="form-control" v-model="email" autofocus>
                  </div>
                </div>
                <div class="form-group">
                  <label for="gender" class="col-sm-3 control-label no-padding">Gender</label>
                  <div class="col-sm-9 custom-radio-group" v-bind:class="{ 'input-field-red': beforeSubmit && isGenderNotValid }">
                    <input type="radio" class="custom-radio" id="gender-male" value="male" v-model="gender"><label class="custom-label" for="male">Male</label>
                    <input type="radio" class="custom-radio" id="gender-female" value="female" v-model="gender"><label class="custom-label" for="female">Female</label>
                  </div>
                </div>
                <div class="form-group">
                  <label for="buildingNumber" class="col-sm-3 control-label no-padding">Building Number</label>
                  <div class="col-sm-9" v-bind:class="{ 'input-field-red': beforeSubmit && isBuildingNumberNotValid }">
                    <input type="text" id="buildingNumber" placeholder="Enter building number" class="form-control" v-model="buildingNumber" autofocus>
                  </div>
                </div>
                <div class="form-group">
                  <label for="streetName" class="col-sm-3 control-label no-padding">Street Name</label>
                  <div class="col-sm-9" v-bind:class="{ 'input-field-red': beforeSubmit && isStreetNameNotValid }">
                    <input type="text" id="streetName" placeholder="Enter street name" class="form-control" v-model="streetName" autofocus>
                  </div>
                </div>
                <div class="form-group">
                  <label for="postalCode" class="col-sm-3 control-label no-padding">Postal Code</label>
                  <div class="col-sm-9" v-bind:class="{ 'input-field-red': beforeSubmit && isPostalCodeNotValid }">
                    <input type="text" id="postalCode" placeholder="Enter postal code" class="form-control" v-model="postalCode" autofocus>
                  </div>
                </div>
                <div class="form-group">
                  <label for="city" class="col-sm-3 control-label no-padding">City</label>
                  <div class="col-sm-9" v-bind:class="{ 'input-field-red': beforeSubmit && isCityNotValid }">
                    <input type="text" id="city" placeholder="Enter city name" class="form-control" v-model="city" autofocus>
                  </div>
                </div>
                <div class="form-group">
                  <label for="country" class="col-sm-3 control-label no-padding">Country</label>
                  <div class="col-sm-9" v-bind:class="{ 'input-field-red': beforeSubmit && isCountryNotValid }">
                    <select id="country" class="form-control" v-model="country" autofocus>
                        <option disabled value="">Please select one</option>
                        <option v-for="country in countries" :value="country">{{ country }}</option>
                      </select>
                  </div>
                </div>
                <div class="form-group">
                  <label for="passport" class="col-sm-3 control-label no-padding">Passport number</label>
                  <div class="col-sm-9" v-bind:class="{ 'input-field-red': beforeSubmit && isPassportNumberNotValid }">
                    <input type="text" id="passport" placeholder="Enter passport number" class="form-control" v-model="passportNumber" autofocus>
                  </div>
                </div>
                <div class="form-group">
                  <label for="passportImage" class="col-sm-3 control-label no-padding">Passport Image</label>
                  <div class="col-sm-9">
                    <label for="passportImage" class="custom-file-upload">
                      <i class="fa fa-cloud-upload"></i> Upload file
                    </label>
                    <input type="file" id="passportImage" class="form-control" ref="passportImage" autofocus>
                  </div>
                </div>
              </div>
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button style="height: 40px; display: flex; justify-content: center; align-content: center" class="btn btn-success btn-lg btn-block" @click="submit">
                <div v-if="idle">Submit</div>
                <div v-if="!idle">
                  <div class="spinner">
                      <div class="bounce1"></div>
                      <div class="bounce2"></div>
                      <div class="bounce3"></div>
                    </div>
                  </div>
                </button>
            </slot>
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
import 'whatwg-fetch';
import gql from 'graphql-tag';
import {
  isEmpty,
  map,
  find,
  values,
  first
} from 'lodash';
import list from '../lib/country-list.json';


export default {
  name: 'Home',
  props: ['address'],
  data: function() {
    return {
      firstName: null,
      lastName: null,
      title: null,
      gender: null,
      country: null,
      passportNumber: null,
      buildingNumber: null,
      postalCode: null,
      city: null,
      streetName: null,
      email: null,
      idle: true,
      errorResponse: null,
      beforeSubmit: false,
      countries: values(list),
    }
  },
  methods: {
    submit() {
      this.beforeSubmit = false;
      this.idle = false;
      // TODO:: toggle progress bar
      if (this.isFormNotValid) {
        this.beforeSubmit = true;
        this.errorResponse = "Please check the red fields";
        this.idle = true;
      } else if(this.isFileNotValid) {
        this.beforeSubmit = true;
        if (this.$refs.passportImage && !isEmpty(this.$refs.passportImage.files)) {
          const fileElem = first(this.$refs.passportImage.files)
          if (fileElem.size && fileElem.size >= 100000) {
            this.errorResponse = "Image maximum file size exceeded, please upload an image less than 5MB"
          } else {
            this.errorResponse = "Please select an image"
          }
        } else {
          this.errorResponse = "Please select an image"
        }
        this.idle = true;
      } else {
        // clear validations
        const that = this;
        that.uploadFile()
          .then(that.doCreate)
          .then(that.handleCreateResult)
          .catch(that.handleGenericError)
      }
    },
    uploadFile() {
      const apolloClient = this.apolloClient;
      const fileContainer = this.createFileContainer(this.$refs.passportImage, 'passport');
      return apolloClient
          .mutate({
            mutation: gql `mutation {
                  saveFile(input: {
                    fileName: "${fileContainer.fileName}",
                    fileType: "${fileContainer.fileType}",
                    imageType: "${fileContainer.imageType}"
                  }) {
                    fileKey
                    imageType
                    fileS3Url
                  }
                }`
          })
          .then(result => {
            return $.ajax({
                type: 'PUT',
                url: result.data.saveFile.fileS3Url,
                contentType: fileContainer.fileType,
                processData: false,
                data: fileContainer.file
              })
              // pass mutation response
              .then(() => result.data.saveFile);
          });
    },
    handleCreateResult(response) {
      this.$apollo.queries.listApplication.refetch();
    },
    handleGenericError(error) {
      console.log(error);
      if (error && error.graphQLErrors && !isEmpty(error.graphQLErrors)) {
        this.errorResponse = error.graphQLErrors[0].message;
      } else {
        this.errorResponse = "Unexpected error occured, please try again.";
      }
    },
    doCreate(passportFile) {
      return this.apolloClient
        .mutate({
          mutation: gql `mutation {
                  createApplication(input: {
                    address: "${this.address}"
                    firstName: "${this.firstName}"
                    lastName: "${this.lastName}"
                    title: "${this.title}"
                    email: "${this.email}"
                    gender: "${this.gender}"
                    buildingNumber: "${this.buildingNumber}"
                    streetName: "${this.streetName}"
                    postalCode: "${this.postalCode}"
                    city: "${this.city}"
                    country: "${this.country}"
                    passportNumber: "${this.passportNumber}"
                    passportFileKey: "${passportFile.fileKey}"
                  }) {
                    status
                  }
                }`
        })
        .then(result => result.data.createApplication)
        .catch(err => {
          // TODO: show error
          console.log(err)
          return Promise.reject(err);
        });
    },
    createFileContainer(elem, imageType) {
      const file = elem.files[0];
      return {
        file,
        imageType,
        fileName: file.name,
        fileType: file.type,
      }
    },
  },
  computed: {
    isFormNotValid() {
      return this.isFirstNameNotValid
        || this.isLastNameNotValid
        || this.isTitleNotValid
        || this.isEmailNotValid
        || this.isGenderNotValid
        || this.isBuildingNumberNotValid
        || this.isStreetNameNotValid
        || this.isPostalCodeNotValid
        || this.isCityNotValid
        || this.isCountryNotValid
        || this.isPassportNumberNotValid;
    },
    apolloClient() {
      return this.$apollo.provider.defaultClient;
    },
    status () {
      return this.listApplication && this.listApplication.status;
    },
    isFirstNameNotValid () {
      return isEmpty(this.firstName);
    },
    isLastNameNotValid () {
      return isEmpty(this.lastName);
    },
    isTitleNotValid () {
      return isEmpty(this.title);
    },
    isEmailNotValid() {
      return isEmpty(this.email);
    },
    isGenderNotValid() {
      return isEmpty(this.gender);
    },
    isBuildingNumberNotValid() {
      return isEmpty(this.buildingNumber);
    },
    isStreetNameNotValid() {
      return isEmpty(this.streetName);
    },
    isPostalCodeNotValid() {
      return isEmpty(this.postalCode);
    },
    isCityNotValid() {
      return isEmpty(this.city);
    },
    isCountryNotValid() {
      return isEmpty(this.country);
    },
    isPassportNumberNotValid() {
      return isEmpty(this.passportNumber);
    },
    isFileNotValid () {
      if (this.$refs.passportImage) {
        const imageFile = this.$refs.passportImage;
        if (!isEmpty(imageFile.files)) {
          const fileElement = first(imageFile.files)
          return fileElement.size && fileElement.size >= 100000;
        }
      }
      return false;
    }
  },
  apollo: {
    listApplication: {
      query: function () {
        return gql`query listApplication($address: String!) {
          listApplication(address: $address) {
              address
              status
          }}`;
      },
      variables() {
        return {
          address: this.address,
        };
      }
    }
  }
}
</script>

<style scoped>

html {
  height: 100%;
}

body {
  background-image: url('/static/assets/commcerblock-big-gray.png');
  background-position: bottom right;
  background-attachment: fixed;
}

.modal-mask {
  /*z-index: 9998;
  top: 0;
  left: 0;*/
  width: 100%;
  /*height: 100%;
  background-color: #f9f9f9;
  display: table;
  transition: opacity .3s ease;*/
}

.modal-wrapper {
  margin: 10px 0;
}

.modal-container {
  width: 650px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
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










/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.loginForm .input-group {
  padding-bottom: 1em;
  height: 4em;
  display: block !important;
}

.input-group input {
  height: 4em;
}

.tab-title {
  color: #141414;
  font-family: "Open Sans";
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
  text-align: center;
}

.modal-body.small {
  margin: 10px 0;
}

.bottom-logo {
  position: fixed;
  z-index: -1;
  bottom: 0;
  right: 0;
}

.spinner {
  margin: 0 auto 0;
  width: 70px;
  text-align: center;
  display: flex;
}

.spinner>div {
  width: 18px;
  height: 18px;
  background-color: #ffffff;

  border-radius: 100%;
  display: inline-block;
  -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.spinner .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

input[type="file"] {
  display: none;
}

.custom-file-upload {
  border: 1px solid #ccc;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 5px;
  margin: 0;
}

.custom-radio {
  margin-right: 5px;
  margin-top: 0;
}

.custom-label {
  margin: 0 20px 0 0;
}

.custom-radio-group {
  display: flex;
  align-items: center;
}

.form-group {
  margin-bottom: 15px;
  height: 35px;
  display: flex;
  align-items: center;
}

.bottom-logo {
  position: absolute;
  z-index: -1;
  bottom: 0;
  right: 0;
}


.no-padding {
  padding: 0;
}

.custom-alert {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: -30px;
  height: 30px;
  padding: 0;
  line-height: 23px;
  text-align: center;
}

.input-field-red input[type="text"] {
  border-color: red;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(126, 239, 104, 0.6);
  outline: 0 none;
}

.input-field-red select {
  border-color: red;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(126, 239, 104, 0.6);
  outline: 0 none;
}

.input-field-red input[type="radio"] {
  background-color: #F0FFFF;
  border: 1px solid red;
}

@-webkit-keyframes sk-bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0)
  }
  40% {
    -webkit-transform: scale(1.0)
  }
}

@keyframes sk-bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1.0);
    transform: scale(1.0);
  }
}
</style>
