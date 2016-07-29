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
            
            function setPages(store) {
                pagesStore = store;
                $scope.pages = store.jsonData.pages;
            }
            
            Page.getPages().then(setPages);
            
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
                    
                    return pagesStore.$save().$promise.then(setPages);
                });
            };
            
            $scope.savePage = function savePage() {
                if ($scope.pageEditForm.$valid) {
                    return $scope.editPageContent.$save().then(function() {
                        var summary = contentToPageSummary($scope.editPageContent);
                        var pages = pagesStore.jsonData.pages;
                        for (var i = 0; i < pages.length; i++) {
                            var found = false;
                            if (pages[i].xid === $scope.editPageContent.xid) {
                                pages.splice(i, 1, summary);
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            pages.push(summary)
                        }
                        
                        return pagesStore.$save().$promise.then(setPages);
                    });
                }
            };
            
            $scope.editMenuItem = MenuEditor.editMenuItem;

            jsonStoreEventManager.smartSubscribe($scope, CUSTOM_USER_PAGES_XID, SUBSCRIPTION_TYPES, function updateHandler(event, payload) {
                pagesStore.jsonData = payload.object.jsonData;
                $scope.pages = payload.object.jsonData.pages;
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
