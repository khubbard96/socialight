import './css/bootstrap.min.css';
import Backbone from 'backbone';
import _ from 'underscore';
import $, { data } from 'jquery';
import PhoneNumber from 'awesome-phonenumber';
import email from 'email-addresses';
import 'bootstrap';
const countryCodes = require("./js/country-data.json");

class NewUserView extends Backbone.View {
    constructor() {
        super({
            tagName: "div",
            className: "credentials-enter d-flex flex-column mb-auto",
            events: {
                "input input.form-control":"detectFormUpdate",
                "change input[name='phoneNumber']":"parsePhone",
                "submit form#login-information": "submitLoginInfo",
                "click .pick-country-code":"pickCountryCode",
                "input #search-country-code":"searchCountryCode",
            }
        });
        this.template = _.template($("#create-user-view-template").html());
        this.countryCode = _.findWhere(countryCodes, {FIPS: "US"});
    }

    render() {
        this.$el.html(this.template());
        let countryCodesDropdown = this.$el.find(".dropdown-menu.country-phone-code-menu");

        _.each(countryCodes, function(e) {
            let html;
            if(e.FIPS && e.Official_Name_English) {
                html = $(`<a class="dropdown-item pick-country-code" href="#" data-countrycode="${e.FIPS}" data-countrydial="${e.Dial}" data-countryname="${e.Official_Name_English}"><img
                alt="${e.FIPS}"
                src="http://catamphetamine.gitlab.io/country-flag-icons/3x2/${e.FIPS}.svg" style="width:20px;"/>     ${e.Official_Name_English}</a>`);
                countryCodesDropdown.append(html);
            }
        });
        return this;
    }

    parsePhone(e) {
        let raw = $(e.target).val();
        let pn = new PhoneNumber(raw, this.countryCode.FIPS);
        $(e.target).val(pn.getNumber('national'));
        this.detectFormUpdate();
    }
    detectFormUpdate() {
        if(this._formIsComplete()) {
            this.$el.find("#submit-login-btn").removeAttr("disabled")
        } else {
            this.$el.find("#submit-login-btn").attr("disabled","disabled");
        }
    }
    submitLoginInfo(e) {
        e.preventDefault();
        let _this = this;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            // return if not ready state 4
            if (this.readyState !== 4) {
              return;
            }
            
            //window.location.href = this.responseURL;

      
        };
        xmlhttp.open("POST", "/login/new", true);
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        console.log(this._getFormDataRequestString());
        xmlhttp.send(JSON.stringify(this._getFormData()));
    }
    pickCountryCode(e) {
        e.preventDefault();
        let code = $(e.currentTarget).data("countrycode");
        if(code) {
            let data = _.findWhere(countryCodes, {FIPS: code});
            $(".selected-code").text(`+ ${data.Dial}`);
            this.countryCode = data;
            $("input[name='phoneNumber']").val("");
            this.detectFormUpdate();
        }
    }
    searchCountryCode(e) {
        let searchParam = $(e.currentTarget).val();
        let _this = this;
        $(".pick-country-code").each(function() {
            if(_this._matchesSearch($(this), searchParam)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        })
    }
    _matchesSearch(elem, search) {
        try {
            if(elem.data("countrycode").toLowerCase().includes(search) || elem.data("countrydial").toString().includes(search) || elem.data("countryname").toLowerCase().includes(search)) {
                return true;
            }
            return false;
        } catch(err) {
            return false;
        }

    }

    _formIsComplete() {
        let dataMissing = false;
        let formData = this._getFormData();
        let _this = this;
        _.mapObject(formData, function(v,k){
            if(k === "email" && !email(v)) {
                dataMissing = true;
            } else if (k === "phoneNumber" && !(new PhoneNumber(v, _this.countryCode.FIPS)).isValid()) {
                dataMissing = true;
            } else if (k === "password" && k.length < 8)  {
                dataMissing = true;
            } else if (k === "passwordConfirm" && formData["password"] !== v)  {
                dataMissing = true;
            } else if(!v || v === "") {
                dataMissing = true;
            }

        });
        return !dataMissing;
    }

    _getFormData(){
        let $form = this.$el.find("form#login-information");
        let formData = _.object($form.serializeArray().map(function(v) {return [v.name, v.value];} )); 
        return formData;
    }

    _getFormDataRequestString() {
        let data = this._getFormData();
        let items =[];
        _.mapObject(data, function(v,k) {
            items.push(k + "=" + v);
        });
        return items.join("&");
    }
}
$("#login").append(new NewUserView().render().$el);
