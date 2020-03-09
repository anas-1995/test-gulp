
angular
    .module('app.products')
    .controller('AddProductController', function AddProductController($scope, $rootScope, $state, msApi, Upload, $http, Country, Categories, Brands, Currency, Options, $q, AuthenticationService) {
        var vm = this;
        $scope.role = AuthenticationService.getUserRole()
        $scope.user_id = AuthenticationService.getUserId()
        $scope.translate = 'PRODUCTS.';
        vm.categories = Categories.data
        vm.brands = Brands.data
        vm.countries = Country.data
        vm.submit = submit;
        vm.subCategories = []
        vm.options = Options.data
        vm.variants = [{ "option": vm.options[0], "tags": [] }]
        vm.allVariants = []
        vm.currencies = Currency.data
        $scope.searchBusiness = null;
        vm.item = {
            weight: 0,
            business_id: null,
            currency_id: 4,
            name: null,
            price: 0,
            status: null,
            category_id: null,
            subCategory_id: null,
            original_price: 0,
            discounted_price: 0,
            brand_id: null,
            sku: null,
            barcode: null,
            description: null,
            product_type: null,
            origin_country: 2,
            total_quantity: null,
            over_sell_enabled: null,
            meta_title: null,
            meta_tags: null,
            meta_description: null,
            h1: null,
            hs_code: null,
            url: null
        };

        $scope.clickInPicker = function () {
            var myElement = angular.element(document.querySelector('.md-color-picker-preview'));
            console.log(myElement[0]);
            myElement[0].click()
        }
        $scope.deleteVariants = function (index) {
            vm.allVariants.splice(index, 1)
        }
        function cartesian(arguments) {
            var r = [], arg = arguments, max = arg.length - 1;
            function helper(arr, i) {
                console.log(arr)
                for (var j = 0, l = arg[i].tags.length; j < l; j++) {
                    var a = arr.slice(0); // clone arr
                    a.push(arg[i].tags[j]);
                    // a[arg[i].type] = arg[i].tags[j]
                    if (i == max) {
                        var x = { "tags": [], "price": 0, "quantity": 0, "barcode": null, "sku": null }
                        for (let index = 0; index < a.length; index++) {
                            const element = a[index];
                            x["tags"].push(element)
                        }
                        r.push(x);
                    }
                    else
                        helper(a, i + 1);
                }
            }
            helper([], 0);
            return r;
        }
        $scope.addTag = function (keyEvent, item) {

            if (keyEvent.which === 13) {
                $http.post($rootScope.twigBigRoot + "option_values", { "option_id": item.option.id, "value": keyEvent.currentTarget.value })
                    .success(function (response) {
                        item.tags.push(response.data)
                        keyEvent.currentTarget.value = null

                    })
                    .error(function (response) {
                        console.error(response);
                        $scope.errorMessageToast(response.error);
                    });

            }
        }
        $scope.valueObj = null
        $scope.tagName = null


        $scope.onChangeFilter = function (item, color) {
            // alert(test)
            $http.post($rootScope.twigBigRoot + "option_values", { "option_id": item.option.id, "value": color })
                .success(function (response) {
                    item.tags.push(response.data);
                })
                .error(function (response) {
                    console.error(response);
                    $scope.errorMessageToast(response.error);
                });

        }
        $scope.removeChip = function (item, index) {
            item.tags.splice(index, 1)
        }
        function clean(obj) {
            for (var propName in obj) {
                if (obj[propName] === null || obj[propName] === undefined || (Array.isArray(obj[propName]) && obj[propName][0] == null)) {
                    delete obj[propName];
                }
            }
            return obj
        }

        function submit() {
            if (vm.item.over_sell_enabled)
                vm.item.over_sell_enabled = 1;
            else
                vm.item.over_sell_enabled = 0;
            var obj = {
                "categories_ids[0]": vm.item.category_id,
                "subCategories_ids[0]": vm.item.subCategory_id,
                currency_id: vm.item.currency_id,
                price: vm.item.price,
                description: vm.item.description,
                weight: vm.item.weight,
                business_id: vm.item.business_id,
                name: vm.item.name,
                price: vm.item.price,
                status: vm.item.status,
                original_price: vm.item.original_price,
                discounted_price: vm.item.discounted_price,
                brand_id: vm.item.brand_id,
                sku: vm.item.sku,
                barcode: vm.item.barcode,
                description: vm.item.description,
                product_type: vm.item.product_type,
                origin_country: vm.item.origin_country,
                total_quantity: vm.item.total_quantity,
                over_sell_enabled: vm.item.over_sell_enabled,
                meta_title: vm.item.meta_title,
                meta_tags: vm.item.meta_tags,
                meta_description: vm.item.meta_description,
                h1: vm.item.h1,
                media: $scope.file1,
                hs_code: vm.item.hs_code,
                url: vm.item.url
            };
            obj = clean(obj)
            for (let index = 0; index < vm.allVariants.length; index++) {
                const element = vm.allVariants[index];
                let newVariants = { "barcode": element.barcode, "quantity": element.quantity, "price": element.price, "sku": element.sku, "option_values_ids": [] }
                // element.tags.forEach(element => {
                //     newVariants['option_values_ids'].push(element.id)
                // });

                for (let indexTag = 0; indexTag < element.tags.length; indexTag++) {
                    const element = element.tags[indexTag];
                    newVariants['option_values_ids'].push(element.id)
                }
                obj['variants[' + index + ']'] = JSON.stringify(newVariants)

            }
            console.log(obj)
            Upload.upload({
                url: $rootScope.twigBigRoot + "products",
                method: 'POST',
                data: obj
            }).then(function (resp) {
                console.log(resp);
                $scope.errorMessageToast(resp.data.message);
                $state.go('app.products');
                //console.log('Success ' + resp.config.data.media.name + 'uploaded. Response: ' + resp.data);
            }, function (resp) {
                console.log(resp);
                console.log(Object.keys(resp.data.error.details)[0]);

                $scope.errorMessageToast(resp.data.error.details[Object.keys(resp.data.error.details)[0]][0]);
                // console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.media.name);
            });




            //                        msApi.request('twigs.addtwig@save', {
            //                            category_id: vm.item.category_id,
            //                            location_id: vm.item.location_id,
            //                            currency_id: vm.item.currency_id,
            //                            price: vm.item.price,
            //                            reasonable_price: vm.item.reasonable_price,
            //                            is_exceptional: vm.item.is_exceptional,
            //                            products: products,
            //                            tags: tags,
            //                            quality: vm.item.quality,
            //                            service: vm.item.service,
            //                            ambiance: vm.item.ambiance,
            //                            media: vm.item.media
            //                        },
            //                        // SUCCESS
            //                        function(response)
            //                        {
            //                            console.log(response.data);
            //                            var msg = "Twig has been added successfully";
            //                            $scope.errorMessageToast(msg);
            //                            $state.go("app.twigs");
            //                        },
            //                                // ERROR
            //                                        function(response)
            //                                        {
            //                                            console.error(response.data);
            //                                            var msg = "";
            //                                            if (response.data.error.details.media)
            //                                                msg += response.data.error.details.media[0] + " ";
            //                                            $scope.errorMessageToast(msg);
            //
            //
            //                                        }
            //                                );
        }

        $scope.addOption = function () {
            vm.variants.push({ "option": vm.options[0], "tags": [] })
        }

        $scope.createVariants = function () {
            vm.allVariants = cartesian(vm.variants)
            console.log(vm.allVariants)
        }
        $scope.selectedBusinessChange = function (item) {
            if (item)
                vm.item.business_id = item.id;
        };

        $scope.onChangeBusiness = function (keyword) {
            if (keyword && keyword !== null && keyword !== '') {
                var deferred = $q.defer();
                var params = { keyword: keyword }
                if ($scope.role != 'ADMIN') {
                    params['user_id'] = $scope.user_id
                }

                msApi.request('businesses.businesses@get', params,
                    function (response) {
                        console.log("response businesses", response);
                        deferred.resolve(response.data);
                    }, function (response) {
                        deferred.reject();
                        return [];
                    });
                return deferred.promise;
            }
        };

        $scope.categoryChange = function (category_id) {
            var deferred = $q.defer();
            vm.subCategories = []
            vm.item.subCategory_id = null
            msApi.request('sub_categories.sub_categories@get', {
                category_id: category_id
            },
                function (response) {
                    console.log("response", response);
                    vm.subCategories = response.data
                    deferred.resolve(response.data);
                }, function (response) {
                    deferred.reject();
                    return [];
                });
            return deferred.promise;
        }

        $scope.changePhoto = function (ev) {
            vm.mediacopy = ev.currentTarget.files[0];
            vm.item.media = ev.currentTarget.files[0];
            // console.log("ev.currentTarget.files[0]; ", ev.currentTarget.files[0]);
            var reader = new FileReader();
            // console.log("vm.reader ", reader);
            reader.onload = function (e) {

                $scope.$apply(function ($scope) {
                    $scope.myImage = e.target.result;
                    // vm.mediacopy = angular.copy( $scope.myImage);
                    // console.log("vm.mediacopy ", vm.mediacopy);
                    vm.mediacopy = $scope.myImage;
                });
                // if ($scope.addItem.photo.$valid) {
                //$scope.imgCropDialog(ev);
                // }
            };
            reader.readAsDataURL(vm.mediacopy);
        };


    })