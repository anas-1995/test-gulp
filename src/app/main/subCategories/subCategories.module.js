(function()
{
    'use strict';

    angular
            .module('app.subCategories',[])
            .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        $stateProvider
                .state('app.subCategories', {
                    url: '/Subcategories',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/subCategories/subCategories.html',
                            controller: 'SubCategoriesController as vm'
                        }
                    }
                    ,
                    resolve: {
                        authenticate: function (permissions) {
                            permissions.getPermissions("CATEGORIES");
                        }
                    }

                })
                .state('app.subCategories.subCategories-view', {
                    url: '/Subcategory/:id',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/subCategories/item/item.html',
                            controller: 'SubCategoryController as vm'
                        }
                    },
                    resolve: {
                        SubCategory: function(msApi, $stateParams)
                        {
                           // console.log("$stateParams ", $stateParams);
                          //  msApiProvider.register('users.view', ['users/' + $stateParams.id, {}, 'get']);
                           // return msApiProvider.resolve('users.view@get', {'id': $stateParams});
                            
                            msApiProvider.register('sub_categories.view', ['sub_categories/' + $stateParams.id, {}, 'get']);                            
                            return msApi.resolve('sub_categories.view@get', {'id': $stateParams});                   
                        }
                    }                   
                })
                .state('app.subCategories.add-subCategory', {
                    url: '/AddSubCategory',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/subCategories/addItem/addItem.html',
                            controller: 'AddSubCategoryController as vm'
                        }
                    },
                    resolve: {
                        Categories: function (msApi)
                        {
                            return msApi.resolve('categories.categories@get');
                        }   
                    }

                })
                .state('app.subCategories.edit-subcategory', {
                    url: '/EditSubCategory/:id',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/subCategories/editItem/editItem.html',
                            controller: 'EditSubCategoryController as vm'
                        }
                    },
                    resolve: {
                        SubCategory: function(msApi, $stateParams)
                        {
                            //console.log("$stateParams ", $stateParams);
                             msApiProvider.register('sub_categories.view', ['sub_categories/' + $stateParams.id, {}, 'get']);                            
                            return msApi.resolve('sub_categories.view@get', {'id': $stateParams});                                                  
                        },
                        Categories: function (msApi)
                        {
                            return msApi.resolve('categories.categories@get');
                        }   
                    }                        
                });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/subCategories');

        // Api
        msApiProvider.register('sub_categories.sub_categories', ['sub_categories', {}, 'get']);
       // msApiProvider.register('categories.category', ['categories', {}, 'get']);     

        // Navigation
        msNavigationServiceProvider.saveItem('subCategories', {
            title: 'SUBCATEGORIES',
           //group: true,
            icon  : 'icon-menu',
            state : 'app.subCategories',
            weight: 10,
            order:9
        });
    }

})();