(function()
{
    'use strict';

    angular
            .module('app.brands',[])
            .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        $stateProvider
                .state('app.brands', {
                    url: '/Brands',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/brands/brands.html',
                            controller: 'brandsController as vm'
                        }
                    }
                    ,
                    resolve: {
                        authenticate: function (permissions) {
                            permissions.getPermissions("BRANDS");
                        }
                    }

                })
                .state('app.brands.brands-view', {
                    url: '/Brand/:id',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/brands/item/item.html',
                            controller: 'BrandController as vm'
                        }
                    },
                    resolve: {
                        Brand: function(msApi, $stateParams)
                        {
                           // console.log("$stateParams ", $stateParams);
                          //  msApiProvider.register('users.view', ['users/' + $stateParams.id, {}, 'get']);
                           // return msApiProvider.resolve('users.view@get', {'id': $stateParams});
                            
                            msApiProvider.register('brands.view', ['brands/' + $stateParams.id, {}, 'get']);                            
                            return msApi.resolve('brands.view@get', {'id': $stateParams});                   
                        }
                    }                   
                })
                .state('app.brands.add-brand', {
                    url: '/AddBrand',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/brands/addItem/addItem.html',
                            controller: 'AddBrandController as vm'
                        }
                    }                    
                })
                .state('app.brands.edit-brand', {
                    url: '/EditBrand/:id',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/brands/editItem/editItem.html',
                            controller: 'EditBrandController as vm'
                        }
                    },
                    resolve: {
                        Brand: function(msApi, $stateParams)
                        {
                            //console.log("$stateParams ", $stateParams);
                             msApiProvider.register('brands.view', ['brands/' + $stateParams.id, {}, 'get']);                            
                            return msApi.resolve('brands.view@get', {'id': $stateParams});                                                  
                        }
                    }                        
                });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/brands');

        // Api
        msApiProvider.register('brands.brands', ['brands', {}, 'get']);

        // Navigation
        msNavigationServiceProvider.saveItem('brands', {
            title: 'BRANDS',
           //group: true,
            icon  : 'icon-menu',
            state : 'app.brands',
            weight: 10,
            order:6
        });
    }

})();