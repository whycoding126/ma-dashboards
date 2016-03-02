/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['angular', 'jquery', 'globalize', 'globalize/message', 'cldr/unresolved'], function(angular, $, Globalize) {
'use strict';

function translateFactory(mangoBaseUrl, $http) {
	var Translate = function() {};
	
	var likelySubtagsUrl = mangoBaseUrl + '/resources/cldr-data/supplemental/likelySubtags.json';
	Translate.likelySubtags = $http.get(likelySubtagsUrl).then(function(likelySubtags) {
		Globalize.load(likelySubtags.data);
	});
	
	Translate.tr = function(key, args) {
		if (!angular.isArray(args)) {
            args = Array.prototype.slice.call(arguments, 1);
        }
        
        var namespace = key.split('.')[0];
        return Translate.loadNamespaces(namespace).then(function() {
        	try {
        		return Translate.trSync(key, args);
        	} catch (e) {
        		return $.Deferred().reject(e);
        	}
        });
	};
	
	Translate.trSync = function(key, args) {
		if (!angular.isArray(args)) {
            args = Array.prototype.slice.call(arguments, 1);
        }
		return Globalize.messageFormatter(key).apply(Globalize, args);
	};

	Translate.loadedNamespaces = {};
	
	// TODO allow setting language, for now we just use whatever the server returns
	Translate.loadNamespaces = function(namespaces) {
		if (!angular.isArray(namespaces)) {
			namespaces = Array.prototype.slice.call(arguments);
        }
		
		return Translate.likelySubtags.then(function() {
			var namespaceRequests = [];
			for (var i = 0; i < namespaces.length; i++) {
				var namespace = namespaces[i];
				var request = Translate.loadedNamespaces[namespace];
				if (!request) {
					request = $http.get(mangoBaseUrl + '/rest/v1/translations/' + encodeURIComponent(namespace), {
						params: {
							//language: 'XXX'
						}
					});
					request.then(null, removeFromLoaded.bind(null, namespace));
					Translate.loadedNamespaces[namespace] = request;
				}
				namespaceRequests.push(request);
			}
			return $.when.apply($, namespaceRequests);
		}).then(function() {
			for (var i = 0; i < arguments.length; i++) {
				var data = arguments[i].data;
				if (!data.loaded) {
					Globalize.loadMessages(data.translations);
					data.loaded = true;
				}
				// use server returned language
				if (!Globalize.locale()) {
					Globalize.locale(data.locale);
				}
			}
		});
	};
	
	function removeFromLoaded(namespace) {
		delete Translate.loadedNamespaces[namespace];
	}
	
	return Translate;
}

translateFactory.$inject = ['mangoBaseUrl', '$http'];

return translateFactory;

}); // define
