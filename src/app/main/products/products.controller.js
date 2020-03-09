(function () {
    'use strict';

    angular
        .module('app.products')
        .controller('productsController', productsController);

    /** @ngInject */
    function productsController($state, $mdDialog, msApi, $filter, $scope, AuthenticationService) {
        var vm = this;
        $scope.itemsByPage = 10;
        $scope.displayed = [];
        $scope.role = AuthenticationService.getUserRole()
        this.callServer = function callServer(tableState) {
            vm.isLoading = true;
            //console.log("tableState ", tableState);
            var pagination = tableState.pagination;
            var start = pagination.start || 0,
                number = pagination.number || 10,
                currentPage = Math.floor(start / number) + 1;
            var params = { limit: number, page: currentPage }
            if ($scope.role != 'ADMIN') {
                params['business_id'] = AuthenticationService.getSelectedBusiness().id
                alert(params['business_id'])
            }
            msApi.request('products.products@get', params,
                function (res) {
                    console.log(res);
                    $scope.total_pages = res.paginator.total_count;
                    tableState.pagination.numberOfPages = res.paginator.total_pages;
                    $scope.displayed = res.data;
                    vm.isLoading = false;
                }, function (result) {
                    console.log(result);
                });
        };
        vm.editItem = editItem;
        function editItem(item) {
            //console.log("item ", item);
            $state.go('app.products.edit-product', { id: item.id });
        }






    }
})();