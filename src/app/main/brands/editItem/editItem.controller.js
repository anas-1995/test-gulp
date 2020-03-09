
angular
    .module('app.brands')
    .controller('EditBrandController', function EditBrandController($scope, $rootScope, $state, msApi, Upload, $http, Brand) {
        var vm = this;
        $scope.translate = 'BRANDS.';

        // console.log("Category ", Category);
        vm.item = Brand.data;
        $scope.file = vm.item.logo;
        vm.submit = submit;
        //$scope.file1 = $rootScope.defaultBackground;
        function submit() {
            var obj = {
                name: vm.item.name,
                logo: $scope.file,
                _method: 'PUT'
            };
            // vm.item.photo = $scope.file1;
            // vm.item.cover = $scope.file2;
            //console.log("$scope.file", $scope.file1, $scope.file2)
            if ($scope.file === vm.item.logo || $scope.file === null)
                delete obj.photo;
            $scope.upload(obj);
        }
        $scope.upload = function (obj) {
            Upload.upload({
                url: $rootScope.twigBigRoot + "brands/" + vm.item.id,
                method: 'POST',
                data: obj
            }).then(function (resp) {
                console.log(resp);
                $scope.errorMessageToast(resp.data.message);
                $state.go('app.brands');
            }, function (response) {
                console.log(response);
                $scope.errorMessageToast(response.data.error.message);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.photo.name);
            });
        };
    });
