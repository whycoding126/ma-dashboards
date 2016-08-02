/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

var pageEditor = function(Page, jsonStoreEventManager, CUSTOM_USER_PAGES_XID, User, MenuEditor, $stateParams, $state, $mdDialog, Translate) {
    var SUBSCRIPTION_TYPES = ['add', 'update'];

    return {
        scope: {},
        templateUrl: require.toUrl('./pageEditor.html'),
        link: function($scope, $element) {
            
            $scope.user = User.current();
            
            var pagesStore;

            $scope.createNewPage = function createNewPage(markup) {
                this.editPageContent = Page.newPageContent();
                this.editPageContent.jsonData.markup = markup || '';
                this.editPage = contentToPageSummary(this.editPageContent);
                $state.go('.', {pageXid: null}, {location: 'replace', notify: false});
            }
            
            function setPages(store) {
                pagesStore = store;
                $scope.pages = store.jsonData.pages;
            }
            
            Page.getPages().then(setPages);
            
            $scope.loadPage = function loadPage(xid) {
                return Page.loadPage(xid || $scope.editPage.xid).then(function(store) {
                    $state.go('.', {pageXid: store.xid}, {location: 'replace', notify: false});
                    $scope.editPageContent = store;
                    return store;
                }, function() {
                    $scope.createNewPage();
                });
            };
            
            if ($stateParams.pageXid) {
                $scope.loadPage($stateParams.pageXid).then(function(editPageContent) {
                    $scope.editPage = contentToPageSummary(editPageContent);
                });
            } else {
                $scope.createNewPage($stateParams.markup);
            }
            
            $scope.confirmDeletePage = function confirmDeletePage() {
                var confirm = $mdDialog.confirm()
                    .title(Translate.trSync('dashboards.v3.app.areYouSure'))
                    .textContent(Translate.trSync('dashboards.v3.app.confirmDeletePage'))
                    .ariaLabel(Translate.trSync('dashboards.v3.app.areYouSure'))
                    .targetEvent(event)
                    .ok(Translate.trSync('common.ok'))
                    .cancel(Translate.trSync('common.cancel'));
        
                return $mdDialog.show(confirm).then(function() {
                    return $scope.deletePage();
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
                    
                    return pagesStore.$save().then(setPages);
                });
            }
            
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
                        
                        return pagesStore.$save().then(setPages);
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

pageEditor.$inject = ['Page', 'jsonStoreEventManager', 'CUSTOM_USER_PAGES_XID', 'User', 'MenuEditor', '$stateParams', '$state', '$mdDialog', 'Translate'];

return pageEditor;

}); // define
