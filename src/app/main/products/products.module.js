(function () {
    'use strict';

    angular
        .module('app.products', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {

        $stateProvider
            .state('app.products', {
                url: '/Products',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/products/products.html',
                        controller: 'productsController as vm'
                    }
                }
                ,
                resolve: {
                    authenticate: function (permissions) {
                        permissions.getPermissions("PRODUCTS");
                    }
                }

            })
            .state('app.products.add-product', {
                url: '/AddProduct',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/products/addItem/addItem.html',
                        controller: 'AddProductController as vm'
                    }
                },
                resolve: {
                    Categories: function (msApi) {
                        return msApi.resolve('categories.categories@get');
                    },
                    Brands: function (msApi) {
                        msApiProvider.register('brands.brands', ['brands', {}, 'get']);
                        return msApi.resolve('brands.brands@get');
                    },
                    Currency: function (msApi) {
                        msApiProvider.register('currencies.currencies', ['currencies', {}, 'get']);
                        return msApi.resolve('currencies.currencies@get');
                    },
                    Country: function (msApi) {
                        msApiProvider.register('countries.countries', ['countries', {}, 'get']);
                        return msApi.resolve('countries.countries@get');
                    },                    
                    Options: function (msApi) {
                        msApiProvider.register('options.options', ['options', {}, 'get']);
                        return msApi.resolve('options.options@get');
                    },
                    
                }
            })
            // .state('app.products.edit-product', {
            //     url: '/EditProduct/:id',
            //     views: {
            //         'content@app': {
            //             templateUrl: 'app/main/products/editItem/editItem.html',
            //             controller: 'EditProductController as vm'
            //         }
            //     },
            //     resolve: {
            //         Product: function (msApi, $stateParams) {
            //             //console.log("$stateParams ", $stateParams);
            //             msApiProvider.register('products.view', ['products/' + $stateParams.id, {}, 'get']);
            //             return msApi.resolve('products.view@get', { 'id': $stateParams });
            //         },
            //         Categories: function (msApi) {
            //             return msApi.resolve('categories.categories@get');
            //         },
            //         Brands: function (msApi) {
            //             msApiProvider.register('brands.brands', ['brands', {}, 'get']);
            //             return msApi.resolve('brands.brands@get');
            //         },
            //         Currency: function (msApi) {
            //             msApiProvider.register('currencies.currencies', ['currencies', {}, 'get']);
            //             return msApi.resolve('currencies.currencies@get');
            //         },
            //         Country: function (msApi) {
            //             msApiProvider.register('countries.countries', ['countries', {}, 'get']);
            //             return msApi.resolve('countries.countries@get');
            //         }

            //     }
            // })

        $translatePartialLoaderProvider.addPart('app/main/products');

        // // Api
        msApiProvider.register('products.products', ['products', {}, 'get']);

        // Navigation
        msNavigationServiceProvider.saveItem('products', {
            title: 'PRODUCTS',
            //group: true,
            icon: 'icon-menu',
            state: 'app.products',
            weight: 10,
            order: 9
        });

    }
})();
