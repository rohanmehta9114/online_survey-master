/* Survey model */
var mongoose = require('mongoose');
var survey_schema = mongoose.Schema({
    survey_name: String,
    survey_id: String,
    user_id: String,
    created_on: String
});

var question_schema = mongoose.Schema({
    ques_number: String,
    ques_text: String,
    survey_id: String,
    match_id: String,
    no_of_textboxes: Number,
    no_of_radio_buttons: Number
});

var ques_options_schema = mongoose.Schema({
    ques_id: String,
    match_id: String,
    option_text: String
});

var ans_ques_schema = mongoose.Schema({
    user_id: String,
    survey_name: String,
    ques_id: String,
    match_id: String,
    ans_text: String
});

var survey = mongoose.model('survey', survey_schema);
var questions = mongoose.model('questions', question_schema);
var ques_options = mongoose.model('ques_options', ques_options_schema);
var ans_ques = mongoose.model('ans_ques', ans_ques_schema);

module.exports = {
    survey: survey,
    questions: questions,
    ques_options: ques_options,
    ans_ques: ans_ques
};