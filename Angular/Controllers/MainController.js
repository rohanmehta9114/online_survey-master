//main controller
main.controller("MainController", function ($scope, $location, $http, $rootScope, $window) {
    var survey_name = '';
    var survey_ques = [];
    var ques_options = [];
    var ques_id = 0;

    $("#surveyName").css("display", "");
    $("#surveyQuestions").css("display", "none");
    $("#surveyOptions").css("display", "none");


    if (!$scope.authenticated) return;

    $scope.redirect = function () {
        console.log('hi');
        $location.path('/');

    }
    $scope.redirecttotake = function () {
        console.log('hi');
        $location.path('/TakeSurvey');

    }
    $scope.createSurveyName = function () {
        survey_name = $scope.txtSurveyName;
        $scope.displayOutput = true;

        $("#surveyName").css("display", "none");
        $("#surveyQuestions").css("display", "");
        $("#surveyOptions").css("display", "none");
    };

    $scope.addQues = function () {
        ques_id++;

        survey_ques.push({
            ques_text: $scope.txtQuesText,
            ques_id: ques_id
        });

        $("#surveyName").css("display", "none");
        $("#surveyQuestions").css("display", "none");
        $("#surveyOptions").css("display", "");


        var html = '';
        html += '<div class="row">';
        html += '<label>' + ques_id + ". " + $scope.txtQuesText + '</label>';
        html += '<br />';
        html += '<div id="optionsDiv' + ques_id + '">';
        //html += '<input type="radio" value="' + $scope.txtOptionText + '" name="' + ques_id + '" />' + $scope.txtOptionText;
        html += '</div>';
        html += '</div>';

        $("#displayOutput").append(html);
        $scope.txtQuesText = '';
    };

    $scope.backBtn = function () {

        $("#surveyName").css("display", "none");
        $("#surveyQuestions").css("display", "");
        $("#surveyOptions").css("display", "none");
    };

    $scope.cancelSurvey = function () {
        $scope.displayOutput = false;

        survey_name = '';
        survey_ques = [];
        ques_options = [];
        ques_id = 0;
        $("#displayOutput").find('div').remove('div');

        $("#surveyName").css("display", "");
        $("#surveyQuestions").css("display", "none");
        $("#surveyOptions").css("display", "none");
    };

    $scope.addOptions = function () {
        $("#surveyName").css("display", "none");
        $("#surveyQuestions").css("display", "none");
        $("#surveyOptions").css("display", "");

        // preview options
        var html = '';
        html += '<br/><input type="radio" value="' + $scope.txtOptionText + '" name="' + ques_id + '" />' + $scope.txtOptionText;
        $("#optionsDiv" + ques_id).append(html);
        ques_options.push({
            option_text: $scope.txtOptionText,
            ques_id: ques_id
        });
        $scope.txtOptionText = '';

        $scope.isFinalSave = true;
    };

    $scope.finalSave = function () {
        var param = JSON.stringify({
            survey_name: survey_name,
            survey_ques: survey_ques,
            options: ques_options,
            userid: sessionStorage.getItem('userid')
        });

        var dd = $http.post("/CreateSurvey", param);

        dd.then(function (data) {
            alert('Records saved in db.');
        }, function (err) {
            //$scope.pages = page.data.data[0].page_data;
            alert('Error while saving records in database');
        });

        survey_name = '';
        survey_ques = [];
        ques_options = [];
        ques_id = 0;
    };


    var survey = $http.get("/AllSurvey/" + sessionStorage.getItem('userid'));

    survey.then(function (data) {
        //alert(data);
        $scope.survey = data.data;
    }, function (err) {

        alert('Error while saving records in database');
    });


    $scope.viewSurvey = function (survey_id) {
        var survey = $http.get("/ViewSurvey/" + survey_id);

        survey.then(function (data) {
            $rootScope.viewsurvey = data.data;
            $location.path('/ViewSurvey');
        }, function (err) {
            //$scope.pages = page.data.data[0].page_data;
            alert('Error while saving records in database');
        });
    };

    $scope.editSurvey = function (survey_id) {
        var survey = $http.get("/ViewSurvey/" + survey_id);

        survey.then(function (data) {
            $rootScope.viewsurvey = data.data;
            $location.path('/EditSurvey');
        }, function (err) {
            //$scope.pages = page.data.data[0].page_data;
            alert('Error while saving records in database');
        });
    };

    $scope.deleteSurvey = function (survey_id) {
        var param = JSON.stringify({
            survey_id: survey_id
        });

        var deleteSurvey = $window.confirm('Are you absolutely sure you want to delete?');

        if (deleteSurvey) {
            var dd = $http.post("/DeleteSurvey", param);

            dd.then(function (data) {
                $window.location.reload();
                alert('Survey deleted from db.');
            }, function (err) {
                //$scope.pages = page.data.data[0].page_data;
                alert('Error while saving records in database');
            });
        }
    };

    $scope.generateSurveyUrl = function (survey_id) {
        $scope.surveyUrl = true;

        var protocol = $location.protocol();
        var host = $location.host();

        if ($location.port())
            var combined = protocol + '://' + host + ":" + $location.port() + "/#/TakeSurvey?id=" + survey_id;
        else
            var combined = protocol + '://' + host + "/#/TakeSurvey?id=" + survey_id;

        $("#surveyUrl").attr("href", combined);
        $("#surveyUrl").text(combined);
    };

    $scope.location = $location;
    $scope.$watch('location.search()', function () {
        var survey_id = ($location.search()).id;

        if (survey_id != undefined) {
            var survey = $http.get("/ViewSurvey/" + survey_id);

            survey.then(function (data) {
                $rootScope.viewsurvey = data.data;
                // $location.path('/TakeSurvey');
            }, function (err) {
                $rootScope.viewsurvey = null;
                //$scope.pages = page.data.data[0].page_data;
                alert('Error while saving records in database');
            });
        }
    }, true);

    $scope.surveySubmit = function () {
        var ans_data = [];
        var survey_name = $scope.survey_name;

        $("input[type='radio']").each(function (i, obj) {
            if (obj.checked) {
                console.log('dd');

                ans_data.push({
                    ques_id: $(obj).attr('value'),
                    ques_text: $(obj).attr('data-val')
                });
            }
        });

        var param = JSON.stringify({
            data: ans_data,
            user_id: sessionStorage.getItem('userid')
        });

        var dd = $http.post("/save-answers", param);

        dd.then(function (data) {
            alert('Records saved in db.');
        }, function (err) {
            //$scope.pages = page.data.data[0].page_data;
            alert('Error while saving records in database');
        });
    };

    $scope.backEditedSurvey = function () {
        $location.path('/AllSurvey');
    };

    $scope.saveEditedSurvey = function () {
        console.log('dd');
        $("[data-ques-id]").each(function (i, obj) {
            var ques_id = $(obj).attr('data-ques-id');
            var ques_text = $(obj).val();

            var param = JSON.stringify({
                ques_id: ques_id,
                ques_text: ques_text
            });

            var dd = $http.post("/EditQuestion", param);

            dd.then(function (data) {
                //alert('Records saved in db.');
            }, function (err) {
                //$scope.pages = page.data.data[0].page_data;
                alert('Error while saving records in database');
            });
        });

        $("[data-option-id]").each(function (i, obj) {
            var id = $(obj).attr('data-option-id');
            var text = $(obj).val();

            var param = JSON.stringify({
                id: id,
                text: text
            });

            var dd = $http.post("/EditOption", param);

            dd.then(function (data) {

            }, function (err) {

                alert('Error while saving records in database');
            });
        });

        alert('Records updated');
    };
});
