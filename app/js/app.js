var POS = angular.module("POS", ['ngRoute']);

POS.config(function($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/login', {
            templateUrl : 'login.html',
            controller  : 'loginController'
        })

        // route for the about page
        .when('/search', {
            templateUrl : 'search.html',
            controller  : 'searchController'
        })
        .when('/print', {
            templateUrl : 'print.html',
            controller  : 'printController'
        })
        .otherwise({redirectTo: "login.html"});

});

POS.factory('Auth', function(){
    var user;

    return{
        setUser : function(aUser){
            user = aUser;
        },
        isLoggedIn : function(){
            return(user)? user : false;
        }
    }
});


POS.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function (event) {

        if (!Auth.isLoggedIn()) {
            console.log('DENY');
            $location.path('/login');
        }
        else {
            console.log('ALLOW');
            $location.path('/search');
        }
    });
}]);
