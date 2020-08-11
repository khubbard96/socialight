import email from 'email-addresses';

class Email {
    constructor(rawEmailString) {
        if(typeof rawEmailString !== typeof "") {
            throw "not a string.";
        } else if (!rawEmailString) {
            throw "email string empty.";
        }

        let parsedEmail = email(rawEmailString);

        if(!parsedEmail) {
            throw "email is not valid";
        }
        this.email = parsedEmail;
    }
    getEmail() {
        return this.email;
    }
    getRawEmail() {
        return this.email.parts.address.semantic;
    }
}

export default Email;