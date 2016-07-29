/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

var pageEditor = function(Page, jsonStoreEventManager, CUSTOM_USER_PAGES_XID, User, MenuEditor) {
    var SUBSCRIPTION_TYPES = ['add', 'update'];

    return {
        scope: {},
        templateUrl: require.toUrl('./pageEditor.html'),
        link: function($scope, $element) {
            $scope.user = User.current();
            
            var pagesStore;
            
            $scope.createNewPage = function createNewPage() {
                this.editPageContent = Page.newPageContent();
                this.editPage = contentToPageSummary(this.editPageContent);
            }
            $scope.createNewPage();
            
            Page.getPages().then(function(store) {
                pagesStore = store;
                $scope.pages = store.jsonData.pages;
            });
            
            $scope.loadPage = function loadPage() {
                Page.loadPage($scope.editPage.xid).then(function(store) {
                    $scope.editPageContent = store;
                });
            };
            
            $scope.deletePage = function deletePage() {
                return $scope.editPageContent.$delete().then(function() {
                    for (var i = 0; i < $scope.pages.length; i++) {
                        if ($scope.pages[i].xid === $scope.editPageContent.xid) {
                            $scope.pages.splice(i, 1);
                            break;
                        }
                    }
                    $scope.createNewPage();
                    return pagesStore.$save().$promise;
                });
            };
            
            $scope.savePage = function savePage() {
                if ($scope.pageEditForm.$valid) {
                    return $scope.editPageContent.$save().then(function() {
                        var summary = contentToPageSummary($scope.editPageContent);
                        for (var i = 0; i < $scope.pages.length; i++) {
                            var found = false;
                            if ($scope.pages[i].xid === $scope.editPageContent.xid) {
                                $scope.pages.splice(i, 1, summary);
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            $scope.pages.push(summary)
                        }
                        return pagesStore.$save().$promise;
                    });
                }
            };
            
            $scope.editMenuItem = MenuEditor.editMenuItem;
            
            var updateHandler = function updateHandler(event, payload) {
                $scope.$apply(function() {
                    pagesStore.jsonData = payload.object.jsonData;
                    $scope.pages = payload.object.jsonData.pages;
                });
            }
            
            jsonStoreEventManager.subscribe(CUSTOM_USER_PAGES_XID, SUBSCRIPTION_TYPES, updateHandler);
            $scope.$on('$destroy', function() {
                jsonStoreEventManager.unsubscribe(CUSTOM_USER_PAGES_XID, SUBSCRIPTION_TYPES, updateHandler);
            });
            
            function contentToPageSummary(input) {
                var result = {};
                result.xid = input.xid;
                result.name = input.name;
                result.editPermission = input.editPermission;
                result.readPermission = input.readPermission;
                return result;
            }

        }
    };
};

pageEditor.$inject = ['Page', 'jsonStoreEventManager', 'CUSTOM_USER_PAGES_XID', 'User', 'MenuEditor'];

return pageEditor;

}); // define
