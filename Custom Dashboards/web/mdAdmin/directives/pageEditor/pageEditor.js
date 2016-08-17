/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

var pageEditor = function(Page, jsonStoreEventManager, CUSTOM_USER_PAGES_XID, User, MenuEditor, $stateParams, $state, $mdDialog, Translate, $rootScope) {
    var SUBSCRIPTION_TYPES = ['add', 'update'];

    return {
        scope: {},
        templateUrl: require.toUrl('./pageEditor.html'),
        link: function($scope, $element) {
            
            $scope.user = $rootScope.user;
            
            var pageSummaryStore;

            $scope.createNewPage = function createNewPage(markup) {
                this.selectedPage = Page.newPageContent();
                this.selectedPage.jsonData.markup = markup || '';
                var pageSummary = this.selectedPageSummary = pageToSummary(this.selectedPage);
                setPageXidStateParam(null);
                return pageSummary;
            }
            
            function setPages(store) {
                pageSummaryStore = store;
                $scope.pageSummaries = store.jsonData.pages;
            }
            
            Page.getPages().then(setPages);
            
            $scope.loadPage = function loadPage(xid) {
                return Page.loadPage(xid || $scope.selectedPageSummary.xid).then(function(store) {
                    setPageXidStateParam(store.xid);
                    $scope.selectedPage = store;
                    return store;
                }, function(error) {
                    return $scope.createNewPage();
                });
            };
            
            if ($stateParams.pageXid) {
                $scope.loadPage($stateParams.pageXid).then(function(selectedPage) {
                    $scope.selectedPageSummary = pageToSummary(selectedPage);
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
                return $scope.selectedPage.$delete().then(null, function(error) {
                    // consume error, typically when a pre-defined default page is deleted
                }).then(function() {
                    for (var i = 0; i < $scope.pageSummaries.length; i++) {
                        if ($scope.pageSummaries[i].xid === $scope.selectedPage.xid) {
                            $scope.pageSummaries.splice(i, 1);
                            break;
                        }
                    }
                    $scope.createNewPage();
                    
                    return pageSummaryStore.$save().then(setPages);
                });
            }
            
            $scope.savePage = function savePage() {
                if ($scope.pageEditForm.$valid) {
                    var newPage = $scope.selectedPage.isNew;
                    
                    return $scope.selectedPage.$save().then(function() {
                        var summary = pageToSummary($scope.selectedPage);
                        var pageSummaries = pageSummaryStore.jsonData.pages;
                        
                        if (newPage) {
                            pageSummaries.push(summary);
                            setPageXidStateParam($scope.selectedPage.xid);
                        } else {
                            for (var i = 0; i < pageSummaries.length; i++) {
                                if (pageSummaries[i].xid === summary.xid) {
                                    angular.copy(summary, pageSummaries[i]);
                                    break;
                                }
                            }
                        }
                        
                        return pageSummaryStore.$save().then(setPages);
                    });
                }
            };
            
            $scope.editMenuItem = MenuEditor.editMenuItem;

            jsonStoreEventManager.smartSubscribe($scope, CUSTOM_USER_PAGES_XID, SUBSCRIPTION_TYPES, function updateHandler(event, payload) {
                pageSummaryStore.jsonData = payload.object.jsonData;
                $scope.pageSummaries = payload.object.jsonData.pages;
            });
            
            function setPageXidStateParam(xid) {
                $state.go('.', {pageXid: xid}, {location: 'replace', notify: false});
            }
            
            function pageToSummary(input) {
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

pageEditor.$inject = ['Page', 'jsonStoreEventManager', 'CUSTOM_USER_PAGES_XID', 'User', 'MenuEditor', '$stateParams', '$state', '$mdDialog', 'Translate', '$rootScope'];

return pageEditor;

}); // define
