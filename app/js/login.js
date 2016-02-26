'use strict';

createDatabases();

POS.controller("loginController", function($scope, $http, $timeout, $location, Auth){


   $scope.onLogin = function($event){

       var headers = {
               'Content-Type': 'application/json;charset=UTF-8',
               'Authorization': 'Basic '+ btoa("limetray:l!metray@321")
           },
           loginReq = {
                   method: 'POST',
                   url: 'http://limetraypos.com:8080/backend_posApp/api/v1/pos/login',
                   headers: headers,
                   data: {"merch_code":$scope.username,"password":$scope.password,"device_id":"NA"}

           },
           ordersReq = {
               method: 'GET',
               url: 'http://limetraypos.com:8080/backend_posApp/api/v1/pos/{outlet_id}/orders',
               headers: headers
           },
           customersReq = {
               method: 'GET',
               url: 'http://limetraypos.com:8080/backend_posApp/api/v1/pos/cloudsite_id/{cloudside_id}/customers',
               headers: headers
           },
           clickedEl = $event.currentTarget,
           state;

       $event.preventDefault();
       state = document.querySelectorAll('button > .state')[0];
       clickedEl.className += ' loading';
       state.innerHTML = 'Authenticating';

       $http(loginReq).then(function(response){
           clickedEl.className += ' ok';
           state.innerHTML = 'Loading Data';
           Auth.setUser($scope.username);
           syncDb(POS.orderDb, ordersReq, {outlet_id : response.data.pos_outlet.pos_outlet_id}, function(response){

               var d = new Date();
               POS.orderDb.insert(response.data.orders, function(err, docs){
                var b = new Date(),
                    dif = b-d;
                   console.log("orders insertion time : " + dif);
                   $location.path("/search");
               });
               POS.orderDb.ensureIndex({fieldName : 'pos_order_id'});

           });
           syncDb(POS.customerDb, customersReq, {cloudside_id : response.data.pos_outlet.cloud_site_id}, function(response){
                var c = new Date();

               POS.customerDb.insert(response.data.success.users, function(err, docs){
                   var a = new Date(),
                       diff = a-c;

                   state.innerHTML = 'Welcome Back';
                   console.log("customers insertion time : " + diff);

               });
               POS.customerDb.ensureIndex({fieldName : 'userNumber'});

              /* POS.customerDb.update({userNumber : "9818687868"}, {$set : {address : [{"crm_address_id":12344,"city":"bramhapdc","area":"scdscsdc","address1":"S-72, dcnjdnc)","address2":"","zipcode":0,"addressType":1}]}}, {}, function(){});

               POS.customerDb.update({userNumber : "9818687868"}, {$set : {address : [{"crm_address_id":12344,"city":"chandraa","area":"scdscsdc","address1":"S-72, dcnjdnc)","address2":"","zipcode":0,"addressType":1}]}}, {}, function(){});

               POS.customerDb.persistence.compactDatafile();*/
               /*POS.customerDb.remove({ userNumber : "8586886930" }, {}, function (err, numRemoved) {

               });*/
               console.log("customers updated");
           });

       }, function(){
           state.innerHTML = 'Merchant Id or password is invalid';
           $timeout(function() {
               state.innerHTML = 'Log In';
               clickedEl.className = clickedEl.className.replace(/loading/,"");
           }, 500);
       });


   };

    function syncDb(db, apiReq, params, successCallback) {
        var key;
        for(key in params){
            if(params.hasOwnProperty(key)) {
                apiReq.url = apiReq.url.replace('{' + key + '}', params[key]);
            }
        }

        $http(apiReq).then(successCallback, function(){
            console.log("Connectivity Issue");
        });
    }


});




function createDatabases(){
    var DataStore = require('nedb'),
        os = require('os'),
        fs = require('fs'),
        homeDir = os.homedir(),
        customerDataPath = homeDir + '/Limetray_POS/customers.json',
        orderDataPath = homeDir + '/Limetray_POS/orders.json';

    try {
        fs.mkdirSync( homeDir + "/Limetray_POS");
    }
    catch(e){
        console.log(e);
    }

    [customerDataPath, orderDataPath].forEach(function(path){
        try{
            fs.unlinkSync(path);
        }
        catch(e){
            console.log(e);
        }
    });

    POS.orderDb = new DataStore({filename :  orderDataPath, autoload: true});
    POS.customerDb = new DataStore({filename :  customerDataPath, autoload: true});

}
