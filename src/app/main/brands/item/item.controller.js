angular
        .module('app.brands')
        .controller('BrandController',
                function BrandController(Brand,msApi, $state, $mdDialog, $rootScope, $scope)
                {
                    var vm = this;
                    //console.log("Category ", Category);
                    vm.item = Brand.data;
                    $scope.translate = 'CATEGORIES.';
                    vm.editItem = editItem;
                    vm.deleteItemConfirm = deleteItemConfirm;                  
                    function editItem(item){
                       // console.log("item ", item);
                        $state.go('app.brands.edit-brand', {id: item.id});
                    };                   

                    function deleteItemConfirm(item, ev)
                    {
                        var confirm = $mdDialog.confirm()
                                .title('Are you sure want to delete the brand?')
                                .htmlContent('<b>' + item.name + '</b>' + ' will be deleted.')
                                .ariaLabel('delete brand')
                                .targetEvent(ev)
                                .ok('OK')
                                .cancel('CANCEL');

                        $mdDialog.show(confirm).then(function()
                        {
                            deleteItem(item);
                            //vm.selectedContacts = [];

                        }, function()
                        {

                        });
                    }

                    /**
                     * Delete Contact
                     */
                    function deleteItem(item)
                    {
                        msApi.register('brands.deletebrand', ['brands/' + item.id]);
                        msApi.request('brands.deletebrand@delete',
                                // SUCCESS
                                        function(response)
                                        {
                                            //console.log("$scope.items.indexOf(item) ", $scope.items.indexOf(item));
                                            //$scope.items.splice($scope.items.indexOf(item), 1);
                                      
                                            // console.log("$scope.items ", $scope.items);
                                            console.log(response);
                                            $state.go('app.brands');
                                            $scope.errorMessageToast(response.message);

                                        },
                                        function(response)
                                        {
                                            console.error(response.data);
                                            $scope.errorMessageToast(response.data.error.code + " " + response.data.error.message);
                                        }
                                );
                            }


                });



