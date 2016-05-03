var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var survey = require('../Models/Survey');


router.get('/', function (req, res, next) {
    res.render('Starter', { title: "Super App" });
});

router.get('/test', function (req, res) {
    res.send('test data');
});

router.post('/CreateSurvey', function (req, res) {
    var survey_name = req.body.survey_name;
    var survey_ques = req.body.survey_ques;
    var options = req.body.options;
    var userid = req.body.userid;

    console.log('Survey name: ' + survey_name);
    console.log('Survey Ques:: ' + survey_ques);
    console.log('options:: ' + options);

    var collection = new survey.survey({
        survey_name: survey_name,
        survey_id: getRandomString(),
        user_id: userid,
        created_on: getDateTime()
    });

    collection.save(function (err, dd) {
        if (err) {
            console.log('Database Error: ' + err);
            res.status(500).send({ error: 'Database Error - ' + err });
        } else {
            console.log('Records saved successfully in database');
            //res.send('Records saved successfully in database');

            survey_ques.forEach(function (data) {
                console.log('Survey ques ' + data.ques_text);
                console.log('Ques id: ' + data.ques_id);

                // Saving records on local database//
                var collection = new survey.questions({
                    ques_number: data.ques_id,
                    ques_text: data.ques_text,
                    match_id: data.ques_id,
                    survey_id: dd.survey_id
                });

                collection.save(function (err, ddd) {
                    if (err) {
                        console.log('Database Error: ' + err);
                        res.status(500).send({ error: 'Database Error - ' + err });
                    } else {
                        console.log('Records saved successfully in database');
                        //res.send('Records saved successfully in database');

                        options.forEach(function (optiondata) {
                            if (optiondata.ques_id != data.ques_id) return;

                            // Saving records on local database//
                            var collection = new survey.ques_options({
                                option_text: optiondata.option_text,
                                match_id: optiondata.ques_id,
                                ques_id: ddd._id
                            });

                            collection.save(function (err) {
                                if (err) {
                                    console.log('Database Error: ' + err);
                                    res.status(500).send({ error: 'Database Error - ' + err });
                                } else {
                                    console.log('Records saved successfully in database');
                                    //res.send('Records saved successfully in database');
                                }
                            });
                        });
                    }
                });
            });

        }
    });
    res.send('Records saved successfully in database');
    //res.end();
});

router.get('/AllSurvey/:userid', function (req, res) {

    survey.survey.find({
        user_id: req.param('userid')
    }, function (err, data) {
        if (data) {
            res.send(data);
        } else if (err) {
            res.status(400).send('Error while getting records from db.');
        } else {
            res.status(500).send('Data not found');
        }
    });
});

router.get('/ViewSurvey/:survey_id', function (req, res) {
    var optionsd = [];
    var cnt = 0;

    survey.survey.findOne({
        survey_id: req.param('survey_id')
    }, function (err, data) {
        if (data) {
            //res.send(data);
            survey.questions.find({
                survey_id: data.survey_id
            }, function (err, quesdata) {
                if (quesdata) {

                    quesdata.forEach(function (qd) {
                        survey.ques_options.find({
                            ques_id: qd._id
                        }, function (err, optionsdata) {
                            if (optionsdata) {
                                console.log('Send all the survey data');
                                //res.send({
                                //    survey_name: data.survey_name,
                                //    questions: quesdata,
                                //    options: optionsdata
                                //});

                                //         console.log('optionsdata.option_text::' + optionsdata);

                                optionsd.push(optionsdata);

                                if (cnt == quesdata.length - 1) {
                                    console.log('Now both are same');

                                    res.send({
                                        survey_name: data.survey_name,
                                        questions: quesdata,
                                        options: optionsd
                                    });
                                }

                                cnt++;
                            } else if (err) {
                                res.status(400).send('Error while getting records from db.');
                            } else {
                                res.status(500).send('Data not found');
                            }
                        });
                    });

                } else if (err) {
                    res.status(400).send('Error while getting records from db.');
                } else {
                    res.status(500).send('Data not found');
                }
            });
        } else if (err) {
            res.status(400).send('Error while getting records from db.');
        } else {
            res.status(500).send('Data not found');
        }
    });


});

router.post('/save-answers', function (req, res) {
    var user_id = req.body.user_id;
    var data = req.body.data;
    var cnt = 0;

    data.forEach(function (dd) {
        var ques_id = dd.ques_id;
        var ques_text = dd.ques_text;


        var collection = new survey.ans_ques({
            user_id: user_id,
            ques_id: ques_id,
            ans_text: ques_text
        });

        collection.save(function (err) {
            if (err) {
                console.log('Database Error: ' + err);
                res.status(500).send({ error: 'Database Error - ' + err });
            } else {
                console.log('Records saved successfully in database');


                if (cnt == data.length - 1) {
                    res.send('Records saved successfully in database');
                }
                cnt++;
            }
        });
    });

});

router.post('/DeleteSurvey', function (req, res) {
    survey.survey.remove({
        survey_id: req.body.survey_id
    }, function (err) {
        if (err) {
            res.status(400).send('Error while getting records from db.');
        } else {
            res.send('Record deleted');
        }
    });
});

router.post('/EditQuestion', function (req, res) {
    var ques_id = req.body.ques_id;
    var ques_text = req.body.ques_text;

    survey.questions.findOne({
        _id: ques_id
    }, function (err, data) {
        if (err) {
            res.status(400).send('Error while updating records in db.');
        } else if (data) {
            data.ques_text = ques_text;
            data.save(function (err) {
                if (!err)
                    res.send('Record updated');
                else
                    res.status(500).send('Error while updating records in db.');
            });
        } else {
            res.status(500).send('Error while updating records in db.');
        }
    });
});

router.post('/EditOption', function (req, res) {
    var id = req.body.id;
    var text = req.body.text;

    survey.ques_options.findOne({
        _id: id
    }, function (err, data) {
        if (err) {
            res.status(400).send('Error while updating records in db.');
        } else if (data) {
            data.option_text = text;
            data.save(function (err) {
                if (!err)
                    res.send('Record updated');
                else
                    res.status(500).send('Error while updating records in db.');
            });
        } else {
            res.status(500).send('Error while updating records in db.');
        }
    });
});

module.exports = router;

function getRandomString() {
  
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstvwxyz";
    for (var i = 0; i < 12; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    // return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
    return day + ":" + month + ":" + year + " " + hour + ":" + min;
}
