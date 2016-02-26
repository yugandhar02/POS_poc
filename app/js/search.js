POS.controller("searchController", function($scope){

        var ipcRenderer = require('ipc-renderer');
        $scope.search = function(){
            var searchQuery = $scope.searchMobileNumber;

            POS.customerDb.find({userNumber : searchQuery}, function(err, docs){
                $scope.addressList = docs[0].address;
                $scope.$apply();
            })
        };

        $scope.print = function(){
            ipcRenderer.send('activate-print-window');
        }


    });