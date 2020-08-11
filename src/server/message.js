import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    text: String,
    attachments: Array,
    
})

class Message {

}