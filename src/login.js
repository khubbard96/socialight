import './css/bootstrap.min.css';
import Backbone from 'backbone';
import _ from 'underscore';
import $, { data } from 'jquery';
import PhoneNumber from 'awesome-phonenumber';
import email from 'email-addresses';

class UserLoginView extends Backbone.View {
    constructor() {
        super({
            tagName: "div",
            className: "credentials-enter d-flex flex-column mb-auto",
            events: {
                "input input.form-control":"detectFormUpdate",
                "change input[name='phoneNumber']":"parsePhone",
                "submit form#login-information": "submitLoginInfo",
            }
        });
        this.template = _.template($("#login-view-template").html());
    }
    render() {
        this.$el.html(this.template());
        return this;
    }
    parsePhone(e) {
        let raw = $(e.target).val();
        let pn = new PhoneNumber(raw, 'US');
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
        $.ajax({
            url:"/login",
            type: "POST",
            data: _this._getFormData(),
            success: function(data, textStatus, jqXHR) {
                window.location.href = "app";
            },
        });
    }

    _formIsComplete() {
        let dataMissing = false;
        _.mapObject(this._getFormData(), function(v,k){
            if(k === "email" && !email(v)) {
                dataMissing = true;
            } else if (k === "password" && v.length < 8)  {
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
}
$("#login").append(new UserLoginView().render().$el);