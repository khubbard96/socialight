import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import { MessageCollection, MessageView } from './message';

class AppView extends Backbone.View {
    constructor() {
        super({
            el: $("#app"),
            events: {
                "submit .create-msg-form":"createMessage",
            }
        });
        this.messages = new MessageCollection(null, {url: "/groups/0/messages/"});
        this.listenTo(this.messages, 'add', this.addMessage);
        
        this.messageListName = '#messages-list';
        let _this = this;
        this.messages.fetch();
    }
    render() {
        //this.$el.find(this.messageListName).empty().append(this.messagesList.render().$el);
    }
    addMessage(msg) {
        let newMsgView = new MessageView(msg);
        this.$el.find("#messages-list").append(newMsgView.render().$el)
    }
    createMessage(e) {
        e.preventDefault();
        let _this = this;
        let formData = _.object(this.$el.find(".create-msg-form").serializeArray().map(function(v) {return [v.name, v.value];} )); 
        this.$el.find(".create-msg-form")[0].reset();
        let newMsg = this.messages.create({
            text: formData.text.trim(),
            time: new Date().getTime()
        }, 
        {
            wait: true,
            success: function(response){
                newMsg.set(response.get("_id"));
                $("#messages-list").animate({ scrollTop: $('#messages-list').prop("scrollHeight")}, 1000);
            },
            error: function(response, options) {
                console.log(response);
            }
        });
    }
    hideMeta() {
        this.$el.find(".message-meta").slideUp();
    }
}


export default AppView;

