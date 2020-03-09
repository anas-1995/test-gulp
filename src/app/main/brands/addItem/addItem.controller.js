
angular
    .module('app.categories')
    .controller('AddBrandController', function AddBrandController($scope, $rootScope, $state, msApi, Upload, $http) {
        var vm = this;
        vm.item = {};
        $scope.translate = 'BRANDS.';
        $scope.status = true;
        vm.submit = submit;
        //$scope.file1 = $rootScope.defaultBackground;
        function submit() {
            $scope.upload($scope.file);
        }
        $scope.upload = function (file) {
            Upload.upload({
                url: $rootScope.twigBigRoot + "brands",
                method: 'POST',
                data: {
                    name: vm.item.name,
                    logo: file
                }
            }).then(function (resp) {
                console.log(resp);
                $scope.errorMessageToast(resp.data.message);
                $state.go('app.brands');
            }, function (response) {
                console.log(response);
                $scope.errorMessageToast(response.data.error.message);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.photo.name);
            });
        };
    });
