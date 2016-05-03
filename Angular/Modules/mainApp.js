
var main = angular.module("main", ['ui.router','ngRoute','ngResource'])
.run(function($http,$rootScope)
{

    $rootScope.roles = [{
		  name: "Administrator",
          code: 0
	   }, {
		  name: "Staff",
          code: 1
	   }, {
		  name: "General",
          code: 2
	}];
    if(sessionStorage.length > 0){
        $rootScope.current_user = sessionStorage.current_user;
        $rootScope.authenticated = true;
    }else{
        $rootScope.authenticated = false;
        $rootScope.current_user = 'Guest';
    }

    $rootScope.signout = function(){
        $http.get('auth/signout');
        $rootScope.authenticated = false;
        $rootScope.current_user = 'Guest';
        sessionStorage.clear();
    };
});
main.config([
    '$stateProvider', '$urlRouterProvider', '$httpProvider',
    function ($stateProvider, $urlRouterProvider,$rootScope) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'Index.html',
                caseInsensitiveMatch: true,
                controller: 'MainController'
            })
             .state('HomePage', {
                url: '/HomePage',
                templateUrl: 'HomePage.html',
                caseInsensitiveMatch: true,
                controller: 'MainController'
            })
             .state('SurveyForm', {
                url: '/SurveyForm',
                templateUrl: 'SurveyForm.html',
                caseInsensitiveMatch: true,
                controller: 'MainController'
            })
			.state('CreateSurvey', {
                url: '/CreateSurvey',
                templateUrl: 'CreateSurvey.html',
                caseInsensitiveMatch: true,
                controller: 'MainController'
            })
			.state('AllSurvey', {
                url: '/AllSurvey',
                templateUrl: 'AllSurvey.html',
                caseInsensitiveMatch: true,
                controller: 'MainController'
			})
            .state('ViewSurvey', {
                url: '/ViewSurvey',
                templateUrl: 'ViewSurvey.html',
                caseInsensitiveMatch: true,
                controller: 'MainController'
            })
            .state('TakeSurvey', {
                url: '/TakeSurvey',
                templateUrl: 'TakeSurvey.html',
                caseInsensitiveMatch: true,
                controller: 'MainController'
            })
            .state('EditSurvey', {
                url: '/EditSurvey',
                templateUrl: 'EditSurvey.html',
                caseInsensitiveMatch: true,
                controller: 'MainController'
            })

            .state('login',{
                url: '/login',
                templateUrl: 'login.html',
                caseInsensitiveMatch: true,
                controller: 'AuthController'
            })
            .state('register',{
                url: '/register',
                templateUrl: 'register.html',
                caseInsensitiveMatch: true,
                controller: 'AuthController'
            })
            .state('unauth',{
                url: '/unauth',
                templateUrl: 'unauth.html',
                caseInsensitiveMatch: true
            });
    }
]);
