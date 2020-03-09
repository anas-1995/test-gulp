angular
        .module('app.subCategories')
        .controller('SubCategoryController',
                function SubCategoryController(SubCategory,msApi, $state, $mdDialog, $rootScope, $scope)
                {
                    var vm = this;
                    //console.log("Category ", Category);
                    vm.item = SubCategory.data;
                    if(vm.item.color)
                     if (vm.item.color.charAt(0) !== '#') vm.item.color = '#'+vm.item.color;
                    $scope.translate = 'SUBCATEGORIES.';
                    vm.editItem = editItem;
                    function editItem(item){
                       // console.log("item ", item);
                        $state.go('app.subCategories.edit-subcategory', {id: item.id});
                    };                   

                    /**
                     * Delete Contact
                     */


                });



