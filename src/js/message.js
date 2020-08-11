import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import dateFormat from 'dateformat';

export class MessageModel extends Backbone.View {
    constructor() {
        super({
            idAttribute: "_id",
        });
    }
    defaults() {
        return {
            text:"",
            time: -1
        }
    }

}

export class MessageCollection extends Backbone.Collection {
    constructor(models, options) {
        super({
            model: MessageModel,
        });
        this.url = options.url;
    }
    parse(data) {
        return data.messages.sort(function(a,b) {
            let time1 = a.time, time2 = b.time;
            if(time1 < time2) {return -1}
            else if (time1 > time2) { return 1}
            else return 0;
        })
    }
}

export class MessageView extends Backbone.View {
    constructor(args) {
        super({
            tagName: 'div',
            className: 'chat-message',
            events: {
            }
        });

        this.template = _.template($("#message-view-template").html());
        this.model = args;
    }
    render() {
        let modelJSON = this.model.toJSON()
        this.$el.html(this.template({
            messageOwnerText: "Kevin",
            messageText: modelJSON.text,
            messageTimestampText: this._getTimestampString(this.model.get("time")),
        }));
        return this;
    }
    showMessageMeta() {
        this.$el.find(".message-meta").show();
    }
    hideMessageMeta() {
        this.$el.find(".message-meta").hide();    
    }
    _getTimestampString(timeInMillis) {
        return dateFormat(new Date(timeInMillis), 'mmm d, yyyy "at" h:MM tt');
    }

}