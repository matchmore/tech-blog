(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.matchmore = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
    (function (Buffer){
    /**
     * MATCHMORE ALPS Core REST API
     * ## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location 
     *
     * OpenAPI spec version: 0.5.0
     * Contact: support@matchmore.com
     *
     * NOTE: This class is auto generated by the swagger code generator program.
     * https://github.com/swagger-api/swagger-codegen.git
     *
     * Swagger Codegen version: 2.3.1
     *
     * Do not edit the class manually.
     *
     */
    
    (function(root, factory) {
      if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['superagent', 'querystring'], factory);
      } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        module.exports = factory(require('superagent'), require('querystring'));
      } else {
        // Browser globals (root is window)
        if (!root.MatchmoreAlpsCoreRestApi) {
          root.MatchmoreAlpsCoreRestApi = {};
        }
        root.MatchmoreAlpsCoreRestApi.ApiClient = factory(root.superagent, root.querystring);
      }
    }(this, function(superagent, querystring) {
      'use strict';
    
      /**
       * @module ApiClient
       * @version 0.5.0
       */
    
      /**
       * Manages low level client-server communications, parameter marshalling, etc. There should not be any need for an
       * application to use this class directly - the *Api and model classes provide the public API for the service. The
       * contents of this file should be regarded as internal but are documented for completeness.
       * @alias module:ApiClient
       * @class
       */
      var exports = function() {
        /**
         * The base URL against which to resolve every API call's (relative) path.
         * @type {String}
         * @default https://api.matchmore.io/v5
         */
        this.basePath = 'https://api.matchmore.io/v5'.replace(/\/+$/, '');
    
        /**
         * The authentication methods to be included for all API calls.
         * @type {Array.<String>}
         */
        this.authentications = {
          'api-key': {type: 'apiKey', 'in': 'header', name: 'api-key'}
        };
        /**
         * The default HTTP headers to be included for all API calls.
         * @type {Array.<String>}
         * @default {}
         */
        this.defaultHeaders = {};
    
        /**
         * The default HTTP timeout for all API calls.
         * @type {Number}
         * @default 60000
         */
        this.timeout = 60000;
    
        /**
         * If set to false an additional timestamp parameter is added to all API GET calls to
         * prevent browser caching
         * @type {Boolean}
         * @default true
         */
        this.cache = true;
    
        /**
         * If set to true, the client will save the cookies from each server
         * response, and return them in the next request.
         * @default false
         */
        this.enableCookies = false;
    
        /*
         * Used to save and return cookies in a node.js (non-browser) setting,
         * if this.enableCookies is set to true.
         */
        if (typeof window === 'undefined') {
          this.agent = new superagent.agent();
        }
    
        /*
         * Allow user to override superagent agent
         */
        this.requestAgent = null;
      };
    
      /**
       * Returns a string representation for an actual parameter.
       * @param param The actual parameter.
       * @returns {String} The string representation of <code>param</code>.
       */
      exports.prototype.paramToString = function(param) {
        if (param == undefined || param == null) {
          return '';
        }
        if (param instanceof Date) {
          return param.toJSON();
        }
        return param.toString();
      };
    
      /**
       * Builds full URL by appending the given path to the base URL and replacing path parameter place-holders with parameter values.
       * NOTE: query parameters are not handled here.
       * @param {String} path The path to append to the base URL.
       * @param {Object} pathParams The parameter values to append.
       * @returns {String} The encoded path with parameter values substituted.
       */
      exports.prototype.buildUrl = function(path, pathParams) {
        if (!path.match(/^\//)) {
          path = '/' + path;
        }
        var url = this.basePath + path;
        var _this = this;
        url = url.replace(/\{([\w-]+)\}/g, function(fullMatch, key) {
          var value;
          if (pathParams.hasOwnProperty(key)) {
            value = _this.paramToString(pathParams[key]);
          } else {
            value = fullMatch;
          }
          return encodeURIComponent(value);
        });
        return url;
      };
    
      /**
       * Checks whether the given content type represents JSON.<br>
       * JSON content type examples:<br>
       * <ul>
       * <li>application/json</li>
       * <li>application/json; charset=UTF8</li>
       * <li>APPLICATION/JSON</li>
       * </ul>
       * @param {String} contentType The MIME content type to check.
       * @returns {Boolean} <code>true</code> if <code>contentType</code> represents JSON, otherwise <code>false</code>.
       */
      exports.prototype.isJsonMime = function(contentType) {
        return Boolean(contentType != null && contentType.match(/^application\/json(;.*)?$/i));
      };
    
      /**
       * Chooses a content type from the given array, with JSON preferred; i.e. return JSON if included, otherwise return the first.
       * @param {Array.<String>} contentTypes
       * @returns {String} The chosen content type, preferring JSON.
       */
      exports.prototype.jsonPreferredMime = function(contentTypes) {
        for (var i = 0; i < contentTypes.length; i++) {
          if (this.isJsonMime(contentTypes[i])) {
            return contentTypes[i];
          }
        }
        return contentTypes[0];
      };
    
      /**
       * Checks whether the given parameter value represents file-like content.
       * @param param The parameter to check.
       * @returns {Boolean} <code>true</code> if <code>param</code> represents a file.
       */
      exports.prototype.isFileParam = function(param) {
        // fs.ReadStream in Node.js and Electron (but not in runtime like browserify)
        if (typeof require === 'function') {
          return true;
        }
        // Buffer in Node.js
        if (typeof Buffer === 'function' && param instanceof Buffer) {
          return true;
        }
        // Blob in browser
        if (typeof Blob === 'function' && param instanceof Blob) {
          return true;
        }
        // File in browser (it seems File object is also instance of Blob, but keep this for safe)
        if (typeof File === 'function' && param instanceof File) {
          return true;
        }
        return false;
      };
    
      /**
       * Normalizes parameter values:
       * <ul>
       * <li>remove nils</li>
       * <li>keep files and arrays</li>
       * <li>format to string with `paramToString` for other cases</li>
       * </ul>
       * @param {Object.<String, Object>} params The parameters as object properties.
       * @returns {Object.<String, Object>} normalized parameters.
       */
      exports.prototype.normalizeParams = function(params) {
        var newParams = {};
        for (var key in params) {
          if (params.hasOwnProperty(key) && params[key] != undefined && params[key] != null) {
            var value = params[key];
            if (this.isFileParam(value) || Array.isArray(value)) {
              newParams[key] = value;
            } else {
              newParams[key] = this.paramToString(value);
            }
          }
        }
        return newParams;
      };
    
      /**
       * Enumeration of collection format separator strategies.
       * @enum {String}
       * @readonly
       */
      exports.CollectionFormatEnum = {
        /**
         * Comma-separated values. Value: <code>csv</code>
         * @const
         */
        CSV: ',',
        /**
         * Space-separated values. Value: <code>ssv</code>
         * @const
         */
        SSV: ' ',
        /**
         * Tab-separated values. Value: <code>tsv</code>
         * @const
         */
        TSV: '\t',
        /**
         * Pipe(|)-separated values. Value: <code>pipes</code>
         * @const
         */
        PIPES: '|',
        /**
         * Native array. Value: <code>multi</code>
         * @const
         */
        MULTI: 'multi'
      };
    
      /**
       * Builds a string representation of an array-type actual parameter, according to the given collection format.
       * @param {Array} param An array parameter.
       * @param {module:ApiClient.CollectionFormatEnum} collectionFormat The array element separator strategy.
       * @returns {String|Array} A string representation of the supplied collection, using the specified delimiter. Returns
       * <code>param</code> as is if <code>collectionFormat</code> is <code>multi</code>.
       */
      exports.prototype.buildCollectionParam = function buildCollectionParam(param, collectionFormat) {
        if (param == null) {
          return null;
        }
        switch (collectionFormat) {
          case 'csv':
            return param.map(this.paramToString).join(',');
          case 'ssv':
            return param.map(this.paramToString).join(' ');
          case 'tsv':
            return param.map(this.paramToString).join('\t');
          case 'pipes':
            return param.map(this.paramToString).join('|');
          case 'multi':
            // return the array directly as SuperAgent will handle it as expected
            return param.map(this.paramToString);
          default:
            throw new Error('Unknown collection format: ' + collectionFormat);
        }
      };
    
      /**
       * Applies authentication headers to the request.
       * @param {Object} request The request object created by a <code>superagent()</code> call.
       * @param {Array.<String>} authNames An array of authentication method names.
       */
      exports.prototype.applyAuthToRequest = function(request, authNames) {
        var _this = this;
        authNames.forEach(function(authName) {
          var auth = _this.authentications[authName];
          switch (auth.type) {
            case 'basic':
              if (auth.username || auth.password) {
                request.auth(auth.username || '', auth.password || '');
              }
              break;
            case 'apiKey':
              if (auth.apiKey) {
                var data = {};
                if (auth.apiKeyPrefix) {
                  data[auth.name] = auth.apiKeyPrefix + ' ' + auth.apiKey;
                } else {
                  data[auth.name] = auth.apiKey;
                }
                if (auth['in'] === 'header') {
                  request.set(data);
                } else {
                  request.query(data);
                }
              }
              break;
            case 'oauth2':
              if (auth.accessToken) {
                request.set({'Authorization': 'Bearer ' + auth.accessToken});
              }
              break;
            default:
              throw new Error('Unknown authentication type: ' + auth.type);
          }
        });
      };
    
      /**
       * Deserializes an HTTP response body into a value of the specified type.
       * @param {Object} response A SuperAgent response object.
       * @param {(String|Array.<String>|Object.<String, Object>|Function)} returnType The type to return. Pass a string for simple types
       * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
       * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
       * all properties on <code>data<code> will be converted to this type.
       * @returns A value of the specified type.
       */
      exports.prototype.deserialize = function deserialize(response, returnType) {
        if (response == null || returnType == null || response.status == 204) {
          return null;
        }
        // Rely on SuperAgent for parsing response body.
        // See http://visionmedia.github.io/superagent/#parsing-response-bodies
        var data = response.body;
        if (data == null || (typeof data === 'object' && typeof data.length === 'undefined' && !Object.keys(data).length)) {
          // SuperAgent does not always produce a body; use the unparsed response as a fallback
          data = response.text;
        }
        return exports.convertToType(data, returnType);
      };
    
      /**
       * Callback function to receive the result of the operation.
       * @callback module:ApiClient~callApiCallback
       * @param {String} error Error message, if any.
       * @param data The data returned by the service call.
       * @param {String} response The complete HTTP response.
       */
    
      /**
       * Invokes the REST service using the supplied settings and parameters.
       * @param {String} path The base URL to invoke.
       * @param {String} httpMethod The HTTP method to use.
       * @param {Object.<String, String>} pathParams A map of path parameters and their values.
       * @param {Object.<String, Object>} queryParams A map of query parameters and their values.
       * @param {Object.<String, Object>} collectionQueryParams A map of collection query parameters and their values.
       * @param {Object.<String, Object>} headerParams A map of header parameters and their values.
       * @param {Object.<String, Object>} formParams A map of form parameters and their values.
       * @param {Object} bodyParam The value to pass as the request body.
       * @param {Array.<String>} authNames An array of authentication type names.
       * @param {Array.<String>} contentTypes An array of request MIME types.
       * @param {Array.<String>} accepts An array of acceptable response MIME types.
       * @param {(String|Array|ObjectFunction)} returnType The required type to return; can be a string for simple types or the
       * constructor for a complex type.
       * @param {module:ApiClient~callApiCallback} callback The callback function.
       * @returns {Object} The SuperAgent request object.
       */
      exports.prototype.callApi = function callApi(path, httpMethod, pathParams,
          queryParams, collectionQueryParams, headerParams, formParams, bodyParam, authNames, contentTypes, accepts,
          returnType, callback) {
    
        var _this = this;
        var url = this.buildUrl(path, pathParams);
        var request = superagent(httpMethod, url);
    
        // apply authentications
        this.applyAuthToRequest(request, authNames);
    
        // set collection query parameters
        for (var key in collectionQueryParams) {
          if (collectionQueryParams.hasOwnProperty(key)) {
            var param = collectionQueryParams[key];
            if (param.collectionFormat === 'csv') {
              // SuperAgent normally percent-encodes all reserved characters in a query parameter. However,
              // commas are used as delimiters for the 'csv' collectionFormat so they must not be encoded. We
              // must therefore construct and encode 'csv' collection query parameters manually.
              if (param.value != null) {
                var value = param.value.map(this.paramToString).map(encodeURIComponent).join(',');
                request.query(encodeURIComponent(key) + "=" + value);
              }
            } else {
              // All other collection query parameters should be treated as ordinary query parameters.
              queryParams[key] = this.buildCollectionParam(param.value, param.collectionFormat);
            }
          }
        }
    
        // set query parameters
        if (httpMethod.toUpperCase() === 'GET' && this.cache === false) {
            queryParams['_'] = new Date().getTime();
        }
        request.query(this.normalizeParams(queryParams));
    
        // set header parameters
        request.set(this.defaultHeaders).set(this.normalizeParams(headerParams));
    
    
        // set requestAgent if it is set by user
        if (this.requestAgent) {
          request.agent(this.requestAgent);
        }
    
        // set request timeout
        request.timeout(this.timeout);
    
        var contentType = this.jsonPreferredMime(contentTypes);
        if (contentType) {
          // Issue with superagent and multipart/form-data (https://github.com/visionmedia/superagent/issues/746)
          if(contentType != 'multipart/form-data') {
            request.type(contentType);
          }
        } else if (!request.header['Content-Type']) {
          request.type('application/json');
        }
    
        if (contentType === 'application/x-www-form-urlencoded') {
          request.send(querystring.stringify(this.normalizeParams(formParams)));
        } else if (contentType == 'multipart/form-data') {
          var _formParams = this.normalizeParams(formParams);
          for (var key in _formParams) {
            if (_formParams.hasOwnProperty(key)) {
              if (this.isFileParam(_formParams[key])) {
                // file field
                request.attach(key, _formParams[key]);
              } else {
                request.field(key, _formParams[key]);
              }
            }
          }
        } else if (bodyParam) {
          request.send(bodyParam);
        }
    
        var accept = this.jsonPreferredMime(accepts);
        if (accept) {
          request.accept(accept);
        }
    
        if (returnType === 'Blob') {
          request.responseType('blob');
        } else if (returnType === 'String') {
          request.responseType('string');
        }
    
        // Attach previously saved cookies, if enabled
        if (this.enableCookies){
          if (typeof window === 'undefined') {
            this.agent.attachCookies(request);
          }
          else {
            request.withCredentials();
          }
        }
    
    
        request.end(function(error, response) {
          if (callback) {
            var data = null;
            if (!error) {
              try {
                data = _this.deserialize(response, returnType);
                if (_this.enableCookies && typeof window === 'undefined'){
                  _this.agent.saveCookies(response);
                }
              } catch (err) {
                error = err;
              }
            }
            callback(error, data, response);
          }
        });
    
        return request;
      };
    
      /**
       * Parses an ISO-8601 string representation of a date value.
       * @param {String} str The date value as a string.
       * @returns {Date} The parsed date object.
       */
      exports.parseDate = function(str) {
        return new Date(str.replace(/T/i, ' '));
      };
    
      /**
       * Converts a value to the specified type.
       * @param {(String|Object)} data The data to convert, as a string or object.
       * @param {(String|Array.<String>|Object.<String, Object>|Function)} type The type to return. Pass a string for simple types
       * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
       * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
       * all properties on <code>data<code> will be converted to this type.
       * @returns An instance of the specified type or null or undefined if data is null or undefined.
       */
      exports.convertToType = function(data, type) {
        if (data === null || data === undefined)
          return data
    
        switch (type) {
          case 'Boolean':
            return Boolean(data);
          case 'Integer':
            return parseInt(data, 10);
          case 'Number':
            return parseFloat(data);
          case 'String':
            return String(data);
          case 'Date':
            return this.parseDate(String(data));
          case 'Blob':
              return data;
          default:
            return data;
        }
      };
    
      /**
       * Constructs a new map or array model from REST data.
       * @param data {Object|Array} The REST data.
       * @param obj {Object|Array} The target object or array.
       */
      exports.constructFromObject = function(data, obj, itemType) {
        if (Array.isArray(data)) {
          for (var i = 0; i < data.length; i++) {
            if (data.hasOwnProperty(i))
              obj[i] = exports.convertToType(data[i], itemType);
          }
        } else {
          for (var k in data) {
            if (data.hasOwnProperty(k))
              obj[k] = exports.convertToType(data[k], itemType);
          }
        }
      };
    
      /**
       * The default API client implementation.
       * @type {module:ApiClient}
       */
      exports.instance = new exports();
    
      return exports;
    }));
    
    }).call(this,require("buffer").Buffer)
    },{"buffer":38,"querystring":43,"superagent":45}],2:[function(require,module,exports){
    /**
     * MATCHMORE ALPS Core REST API
     * ## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location 
     *
     * OpenAPI spec version: 0.5.0
     * Contact: support@matchmore.com
     *
     * NOTE: This class is auto generated by the swagger code generator program.
     * https://github.com/swagger-api/swagger-codegen.git
     *
     * Swagger Codegen version: 2.3.1
     *
     * Do not edit the class manually.
     *
     */
    
    (function(root, factory) {
      if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ApiClient', 'model/APIError', 'model/Device', 'model/DeviceUpdate', 'model/IBeaconTriples', 'model/Location', 'model/Match', 'model/Matches', 'model/ProximityEvent', 'model/Publication', 'model/Publications', 'model/Subscription', 'model/Subscriptions'], factory);
      } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        module.exports = factory(require('../ApiClient'), require('../model/APIError'), require('../model/Device'), require('../model/DeviceUpdate'), require('../model/IBeaconTriples'), require('../model/Location'), require('../model/Match'), require('../model/Matches'), require('../model/ProximityEvent'), require('../model/Publication'), require('../model/Publications'), require('../model/Subscription'), require('../model/Subscriptions'));
      } else {
        // Browser globals (root is window)
        if (!root.MatchmoreAlpsCoreRestApi) {
          root.MatchmoreAlpsCoreRestApi = {};
        }
        root.MatchmoreAlpsCoreRestApi.DeviceApi = factory(root.MatchmoreAlpsCoreRestApi.ApiClient, root.MatchmoreAlpsCoreRestApi.APIError, root.MatchmoreAlpsCoreRestApi.Device, root.MatchmoreAlpsCoreRestApi.DeviceUpdate, root.MatchmoreAlpsCoreRestApi.IBeaconTriples, root.MatchmoreAlpsCoreRestApi.Location, root.MatchmoreAlpsCoreRestApi.Match, root.MatchmoreAlpsCoreRestApi.Matches, root.MatchmoreAlpsCoreRestApi.ProximityEvent, root.MatchmoreAlpsCoreRestApi.Publication, root.MatchmoreAlpsCoreRestApi.Publications, root.MatchmoreAlpsCoreRestApi.Subscription, root.MatchmoreAlpsCoreRestApi.Subscriptions);
      }
    }(this, function(ApiClient, APIError, Device, DeviceUpdate, IBeaconTriples, Location, Match, Matches, ProximityEvent, Publication, Publications, Subscription, Subscriptions) {
      'use strict';
    
      /**
       * Device service.
       * @module api/DeviceApi
       * @version 0.5.0
       */
    
      /**
       * Constructs a new DeviceApi. 
       * @alias module:api/DeviceApi
       * @class
       * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
       * default to {@link module:ApiClient#instance} if unspecified.
       */
      var exports = function(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    
    
        /**
         * Callback function to receive the result of the createDevice operation.
         * @callback module:api/DeviceApi~createDeviceCallback
         * @param {String} error Error message, if any.
         * @param {module:model/Device} data The data returned by the service call.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Create a device
         * @param {module:model/Device} device The device to be created.
         * @param {module:api/DeviceApi~createDeviceCallback} callback The callback function, accepting three arguments: error, data, response
         * data is of type: {@link module:model/Device}
         */
        this.createDevice = function(device, callback) {
          var postBody = device;
    
          // verify the required parameter 'device' is set
          if (device === undefined || device === null) {
            throw new Error("Missing the required parameter 'device' when calling createDevice");
          }
    
    
          var pathParams = {
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = Device;
    
          return this.apiClient.callApi(
            '/devices', 'POST',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
    
        /**
         * Callback function to receive the result of the createLocation operation.
         * @callback module:api/DeviceApi~createLocationCallback
         * @param {String} error Error message, if any.
         * @param {module:model/Location} data The data returned by the service call.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Create a new location for a device
         * @param {String} deviceId The id (UUID) of the device.
         * @param {module:model/Location} location Location to create for a device. 
         * @param {module:api/DeviceApi~createLocationCallback} callback The callback function, accepting three arguments: error, data, response
         * data is of type: {@link module:model/Location}
         */
        this.createLocation = function(deviceId, location, callback) {
          var postBody = location;
    
          // verify the required parameter 'deviceId' is set
          if (deviceId === undefined || deviceId === null) {
            throw new Error("Missing the required parameter 'deviceId' when calling createLocation");
          }
    
          // verify the required parameter 'location' is set
          if (location === undefined || location === null) {
            throw new Error("Missing the required parameter 'location' when calling createLocation");
          }
    
    
          var pathParams = {
            'deviceId': deviceId
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = Location;
    
          return this.apiClient.callApi(
            '/devices/{deviceId}/locations', 'POST',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
    
        /**
         * Callback function to receive the result of the createPublication operation.
         * @callback module:api/DeviceApi~createPublicationCallback
         * @param {String} error Error message, if any.
         * @param {module:model/Publication} data The data returned by the service call.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Create a publication for a device
         * @param {String} deviceId The id (UUID) of the device.
         * @param {module:model/Publication} publication Publication to create on a device. 
         * @param {module:api/DeviceApi~createPublicationCallback} callback The callback function, accepting three arguments: error, data, response
         * data is of type: {@link module:model/Publication}
         */
        this.createPublication = function(deviceId, publication, callback) {
          var postBody = publication;
    
          // verify the required parameter 'deviceId' is set
          if (deviceId === undefined || deviceId === null) {
            throw new Error("Missing the required parameter 'deviceId' when calling createPublication");
          }
    
          // verify the required parameter 'publication' is set
          if (publication === undefined || publication === null) {
            throw new Error("Missing the required parameter 'publication' when calling createPublication");
          }
    
    
          var pathParams = {
            'deviceId': deviceId
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = Publication;
    
          return this.apiClient.callApi(
            '/devices/{deviceId}/publications', 'POST',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
    
        /**
         * Callback function to receive the result of the createSubscription operation.
         * @callback module:api/DeviceApi~createSubscriptionCallback
         * @param {String} error Error message, if any.
         * @param {module:model/Subscription} data The data returned by the service call.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Create a subscription for a device
         * @param {String} deviceId The id (UUID) of the device. 
         * @param {module:model/Subscription} subscription Subscription to create on a device. 
         * @param {module:api/DeviceApi~createSubscriptionCallback} callback The callback function, accepting three arguments: error, data, response
         * data is of type: {@link module:model/Subscription}
         */
        this.createSubscription = function(deviceId, subscription, callback) {
          var postBody = subscription;
    
          // verify the required parameter 'deviceId' is set
          if (deviceId === undefined || deviceId === null) {
            throw new Error("Missing the required parameter 'deviceId' when calling createSubscription");
          }
    
          // verify the required parameter 'subscription' is set
          if (subscription === undefined || subscription === null) {
            throw new Error("Missing the required parameter 'subscription' when calling createSubscription");
          }
    
    
          var pathParams = {
            'deviceId': deviceId
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = Subscription;
    
          return this.apiClient.callApi(
            '/devices/{deviceId}/subscriptions', 'POST',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
    
        /**
         * Callback function to receive the result of the deleteDevice operation.
         * @callback module:api/DeviceApi~deleteDeviceCallback
         * @param {String} error Error message, if any.
         * @param data This operation does not return a value.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Delete an existing device
         * @param {String} deviceId The id (UUID) of the device.
         * @param {module:api/DeviceApi~deleteDeviceCallback} callback The callback function, accepting three arguments: error, data, response
         */
        this.deleteDevice = function(deviceId, callback) {
          var postBody = null;
    
          // verify the required parameter 'deviceId' is set
          if (deviceId === undefined || deviceId === null) {
            throw new Error("Missing the required parameter 'deviceId' when calling deleteDevice");
          }
    
    
          var pathParams = {
            'deviceId': deviceId
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = null;
    
          return this.apiClient.callApi(
            '/devices/{deviceId}', 'DELETE',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
    
        /**
         * Callback function to receive the result of the deletePublication operation.
         * @callback module:api/DeviceApi~deletePublicationCallback
         * @param {String} error Error message, if any.
         * @param data This operation does not return a value.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Delete a Publication
         * 
         * @param {String} deviceId The id (UUID) of the device.
         * @param {String} publicationId The id (UUID) of the subscription.
         * @param {module:api/DeviceApi~deletePublicationCallback} callback The callback function, accepting three arguments: error, data, response
         */
        this.deletePublication = function(deviceId, publicationId, callback) {
          var postBody = null;
    
          // verify the required parameter 'deviceId' is set
          if (deviceId === undefined || deviceId === null) {
            throw new Error("Missing the required parameter 'deviceId' when calling deletePublication");
          }
    
          // verify the required parameter 'publicationId' is set
          if (publicationId === undefined || publicationId === null) {
            throw new Error("Missing the required parameter 'publicationId' when calling deletePublication");
          }
    
    
          var pathParams = {
            'deviceId': deviceId,
            'publicationId': publicationId
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = null;
    
          return this.apiClient.callApi(
            '/devices/{deviceId}/publications/{publicationId}', 'DELETE',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
    
        /**
         * Callback function to receive the result of the deleteSubscription operation.
         * @callback module:api/DeviceApi~deleteSubscriptionCallback
         * @param {String} error Error message, if any.
         * @param data This operation does not return a value.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Delete a Subscription
         * 
         * @param {String} deviceId The id (UUID) of the device.
         * @param {String} subscriptionId The id (UUID) of the subscription.
         * @param {module:api/DeviceApi~deleteSubscriptionCallback} callback The callback function, accepting three arguments: error, data, response
         */
        this.deleteSubscription = function(deviceId, subscriptionId, callback) {
          var postBody = null;
    
          // verify the required parameter 'deviceId' is set
          if (deviceId === undefined || deviceId === null) {
            throw new Error("Missing the required parameter 'deviceId' when calling deleteSubscription");
          }
    
          // verify the required parameter 'subscriptionId' is set
          if (subscriptionId === undefined || subscriptionId === null) {
            throw new Error("Missing the required parameter 'subscriptionId' when calling deleteSubscription");
          }
    
    
          var pathParams = {
            'deviceId': deviceId,
            'subscriptionId': subscriptionId
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = null;
    
          return this.apiClient.callApi(
            '/devices/{deviceId}/subscriptions/{subscriptionId}', 'DELETE',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
    
        /**
         * Callback function to receive the result of the getDevice operation.
         * @callback module:api/DeviceApi~getDeviceCallback
         * @param {String} error Error message, if any.
         * @param {module:model/Device} data The data returned by the service call.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Info about a device
         * @param {String} deviceId The id (UUID) of the device.
         * @param {module:api/DeviceApi~getDeviceCallback} callback The callback function, accepting three arguments: error, data, response
         * data is of type: {@link module:model/Device}
         */
        this.getDevice = function(deviceId, callback) {
          var postBody = null;
    
          // verify the required parameter 'deviceId' is set
          if (deviceId === undefined || deviceId === null) {
            throw new Error("Missing the required parameter 'deviceId' when calling getDevice");
          }
    
    
          var pathParams = {
            'deviceId': deviceId
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = Device;
    
          return this.apiClient.callApi(
            '/devices/{deviceId}', 'GET',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
    
        /**
         * Callback function to receive the result of the getIBeaconTriples operation.
         * @callback module:api/DeviceApi~getIBeaconTriplesCallback
         * @param {String} error Error message, if any.
         * @param {module:model/IBeaconTriples} data The data returned by the service call.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Get IBeacons triples for all registered devices
         * Keys in map are device UUIDs and values are IBeacon triples. In model you can see example values \&quot;property1\&quot; \&quot;property2\&quot; \&quot;property3\&quot; instead of random UUIDs this is generated by OpenApi document browser
         * @param {module:api/DeviceApi~getIBeaconTriplesCallback} callback The callback function, accepting three arguments: error, data, response
         * data is of type: {@link module:model/IBeaconTriples}
         */
        this.getIBeaconTriples = function(callback) {
          var postBody = null;
    
    
          var pathParams = {
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = IBeaconTriples;
    
          return this.apiClient.callApi(
            '/devices/IBeaconTriples', 'GET',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
    
        /**
         * Callback function to receive the result of the getMatch operation.
         * @callback module:api/DeviceApi~getMatchCallback
         * @param {String} error Error message, if any.
         * @param {module:model/Match} data The data returned by the service call.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Get match for the device by its id
         * @param {String} deviceId The id (UUID) of the user device.
         * @param {String} matchId The id (UUID) of the match.
         * @param {module:api/DeviceApi~getMatchCallback} callback The callback function, accepting three arguments: error, data, response
         * data is of type: {@link module:model/Match}
         */
        this.getMatch = function(deviceId, matchId, callback) {
          var postBody = null;
    
          // verify the required parameter 'deviceId' is set
          if (deviceId === undefined || deviceId === null) {
            throw new Error("Missing the required parameter 'deviceId' when calling getMatch");
          }
    
          // verify the required parameter 'matchId' is set
          if (matchId === undefined || matchId === null) {
            throw new Error("Missing the required parameter 'matchId' when calling getMatch");
          }
    
    
          var pathParams = {
            'deviceId': deviceId,
            'matchId': matchId
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = Match;
    
          return this.apiClient.callApi(
            '/devices/{deviceId}/matches/{matchId}', 'GET',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
    
        /**
         * Callback function to receive the result of the getMatches operation.
         * @callback module:api/DeviceApi~getMatchesCallback
         * @param {String} error Error message, if any.
         * @param {module:model/Matches} data The data returned by the service call.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Get matches for the device
         * @param {String} deviceId The id (UUID) of the device.
         * @param {module:api/DeviceApi~getMatchesCallback} callback The callback function, accepting three arguments: error, data, response
         * data is of type: {@link module:model/Matches}
         */
        this.getMatches = function(deviceId, callback) {
          var postBody = null;
    
          // verify the required parameter 'deviceId' is set
          if (deviceId === undefined || deviceId === null) {
            throw new Error("Missing the required parameter 'deviceId' when calling getMatches");
          }
    
    
          var pathParams = {
            'deviceId': deviceId
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = Matches;
    
          return this.apiClient.callApi(
            '/devices/{deviceId}/matches', 'GET',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
    
        /**
         * Callback function to receive the result of the getPublication operation.
         * @callback module:api/DeviceApi~getPublicationCallback
         * @param {String} error Error message, if any.
         * @param {module:model/Publication} data The data returned by the service call.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Info about a publication on a device
         * @param {String} deviceId The id (UUID) of the device.
         * @param {String} publicationId The id (UUID) of the publication.
         * @param {module:api/DeviceApi~getPublicationCallback} callback The callback function, accepting three arguments: error, data, response
         * data is of type: {@link module:model/Publication}
         */
        this.getPublication = function(deviceId, publicationId, callback) {
          var postBody = null;
    
          // verify the required parameter 'deviceId' is set
          if (deviceId === undefined || deviceId === null) {
            throw new Error("Missing the required parameter 'deviceId' when calling getPublication");
          }
    
          // verify the required parameter 'publicationId' is set
          if (publicationId === undefined || publicationId === null) {
            throw new Error("Missing the required parameter 'publicationId' when calling getPublication");
          }
    
    
          var pathParams = {
            'deviceId': deviceId,
            'publicationId': publicationId
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = Publication;
    
          return this.apiClient.callApi(
            '/devices/{deviceId}/publications/{publicationId}', 'GET',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
    
        /**
         * Callback function to receive the result of the getPublications operation.
         * @callback module:api/DeviceApi~getPublicationsCallback
         * @param {String} error Error message, if any.
         * @param {module:model/Publications} data The data returned by the service call.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Get all publications for a device
         * @param {String} deviceId The id (UUID) of the device.
         * @param {module:api/DeviceApi~getPublicationsCallback} callback The callback function, accepting three arguments: error, data, response
         * data is of type: {@link module:model/Publications}
         */
        this.getPublications = function(deviceId, callback) {
          var postBody = null;
    
          // verify the required parameter 'deviceId' is set
          if (deviceId === undefined || deviceId === null) {
            throw new Error("Missing the required parameter 'deviceId' when calling getPublications");
          }
    
    
          var pathParams = {
            'deviceId': deviceId
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = Publications;
    
          return this.apiClient.callApi(
            '/devices/{deviceId}/publications', 'GET',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
    
        /**
         * Callback function to receive the result of the getSubscription operation.
         * @callback module:api/DeviceApi~getSubscriptionCallback
         * @param {String} error Error message, if any.
         * @param {module:model/Subscription} data The data returned by the service call.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Info about a subscription on a device
         * @param {String} deviceId The id (UUID) of the device.
         * @param {String} subscriptionId The id (UUID) of the subscription.
         * @param {module:api/DeviceApi~getSubscriptionCallback} callback The callback function, accepting three arguments: error, data, response
         * data is of type: {@link module:model/Subscription}
         */
        this.getSubscription = function(deviceId, subscriptionId, callback) {
          var postBody = null;
    
          // verify the required parameter 'deviceId' is set
          if (deviceId === undefined || deviceId === null) {
            throw new Error("Missing the required parameter 'deviceId' when calling getSubscription");
          }
    
          // verify the required parameter 'subscriptionId' is set
          if (subscriptionId === undefined || subscriptionId === null) {
            throw new Error("Missing the required parameter 'subscriptionId' when calling getSubscription");
          }
    
    
          var pathParams = {
            'deviceId': deviceId,
            'subscriptionId': subscriptionId
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = Subscription;
    
          return this.apiClient.callApi(
            '/devices/{deviceId}/subscriptions/{subscriptionId}', 'GET',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
    
        /**
         * Callback function to receive the result of the getSubscriptions operation.
         * @callback module:api/DeviceApi~getSubscriptionsCallback
         * @param {String} error Error message, if any.
         * @param {module:model/Subscriptions} data The data returned by the service call.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Get all subscriptions for a device
         * @param {String} deviceId The id (UUID) of the device.
         * @param {module:api/DeviceApi~getSubscriptionsCallback} callback The callback function, accepting three arguments: error, data, response
         * data is of type: {@link module:model/Subscriptions}
         */
        this.getSubscriptions = function(deviceId, callback) {
          var postBody = null;
    
          // verify the required parameter 'deviceId' is set
          if (deviceId === undefined || deviceId === null) {
            throw new Error("Missing the required parameter 'deviceId' when calling getSubscriptions");
          }
    
    
          var pathParams = {
            'deviceId': deviceId
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = Subscriptions;
    
          return this.apiClient.callApi(
            '/devices/{deviceId}/subscriptions', 'GET',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
    
        /**
         * Callback function to receive the result of the triggerProximityEvents operation.
         * @callback module:api/DeviceApi~triggerProximityEventsCallback
         * @param {String} error Error message, if any.
         * @param {module:model/ProximityEvent} data The data returned by the service call.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Trigger the proximity event between a device and a ranged BLE iBeacon
         * @param {String} deviceId The id (UUID) of the device.
         * @param {module:model/ProximityEvent} proximityEvent The proximity event to be created for the device.
         * @param {module:api/DeviceApi~triggerProximityEventsCallback} callback The callback function, accepting three arguments: error, data, response
         * data is of type: {@link module:model/ProximityEvent}
         */
        this.triggerProximityEvents = function(deviceId, proximityEvent, callback) {
          var postBody = proximityEvent;
    
          // verify the required parameter 'deviceId' is set
          if (deviceId === undefined || deviceId === null) {
            throw new Error("Missing the required parameter 'deviceId' when calling triggerProximityEvents");
          }
    
          // verify the required parameter 'proximityEvent' is set
          if (proximityEvent === undefined || proximityEvent === null) {
            throw new Error("Missing the required parameter 'proximityEvent' when calling triggerProximityEvents");
          }
    
    
          var pathParams = {
            'deviceId': deviceId
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = ProximityEvent;
    
          return this.apiClient.callApi(
            '/devices/{deviceId}/proximityEvents', 'POST',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
    
        /**
         * Callback function to receive the result of the updateDevice operation.
         * @callback module:api/DeviceApi~updateDeviceCallback
         * @param {String} error Error message, if any.
         * @param {module:model/Device} data The data returned by the service call.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Updates name or/and device token for existing device
         * Token can be only updated for mobile devices.
         * @param {module:model/DeviceUpdate} device The device update description.
         * @param {module:api/DeviceApi~updateDeviceCallback} callback The callback function, accepting three arguments: error, data, response
         * data is of type: {@link module:model/Device}
         */
        this.updateDevice = function(device, callback) {
          var postBody = device;
    
          // verify the required parameter 'device' is set
          if (device === undefined || device === null) {
            throw new Error("Missing the required parameter 'device' when calling updateDevice");
          }
    
    
          var pathParams = {
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = Device;
    
          return this.apiClient.callApi(
            '/devices/{deviceId}', 'PATCH',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
      };
    
      return exports;
    }));
    
    },{"../ApiClient":1,"../model/APIError":8,"../model/Device":9,"../model/DeviceUpdate":11,"../model/IBeaconTriples":15,"../model/Location":16,"../model/Match":17,"../model/Matches":18,"../model/ProximityEvent":21,"../model/Publication":22,"../model/Publications":23,"../model/Subscription":24,"../model/Subscriptions":25}],3:[function(require,module,exports){
    /**
     * MATCHMORE ALPS Core REST API
     * ## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location 
     *
     * OpenAPI spec version: 0.5.0
     * Contact: support@matchmore.com
     *
     * NOTE: This class is auto generated by the swagger code generator program.
     * https://github.com/swagger-api/swagger-codegen.git
     *
     * Swagger Codegen version: 2.3.1
     *
     * Do not edit the class manually.
     *
     */
    
    (function(root, factory) {
      if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ApiClient', 'model/APIError', 'model/Location'], factory);
      } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        module.exports = factory(require('../ApiClient'), require('../model/APIError'), require('../model/Location'));
      } else {
        // Browser globals (root is window)
        if (!root.MatchmoreAlpsCoreRestApi) {
          root.MatchmoreAlpsCoreRestApi = {};
        }
        root.MatchmoreAlpsCoreRestApi.LocationApi = factory(root.MatchmoreAlpsCoreRestApi.ApiClient, root.MatchmoreAlpsCoreRestApi.APIError, root.MatchmoreAlpsCoreRestApi.Location);
      }
    }(this, function(ApiClient, APIError, Location) {
      'use strict';
    
      /**
       * Location service.
       * @module api/LocationApi
       * @version 0.5.0
       */
    
      /**
       * Constructs a new LocationApi. 
       * @alias module:api/LocationApi
       * @class
       * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
       * default to {@link module:ApiClient#instance} if unspecified.
       */
      var exports = function(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    
    
        /**
         * Callback function to receive the result of the createLocation operation.
         * @callback module:api/LocationApi~createLocationCallback
         * @param {String} error Error message, if any.
         * @param {module:model/Location} data The data returned by the service call.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Create a new location for a device
         * @param {String} deviceId The id (UUID) of the device.
         * @param {module:model/Location} location Location to create for a device. 
         * @param {module:api/LocationApi~createLocationCallback} callback The callback function, accepting three arguments: error, data, response
         * data is of type: {@link module:model/Location}
         */
        this.createLocation = function(deviceId, location, callback) {
          var postBody = location;
    
          // verify the required parameter 'deviceId' is set
          if (deviceId === undefined || deviceId === null) {
            throw new Error("Missing the required parameter 'deviceId' when calling createLocation");
          }
    
          // verify the required parameter 'location' is set
          if (location === undefined || location === null) {
            throw new Error("Missing the required parameter 'location' when calling createLocation");
          }
    
    
          var pathParams = {
            'deviceId': deviceId
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = Location;
    
          return this.apiClient.callApi(
            '/devices/{deviceId}/locations', 'POST',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
      };
    
      return exports;
    }));
    
    },{"../ApiClient":1,"../model/APIError":8,"../model/Location":16}],4:[function(require,module,exports){
    /**
     * MATCHMORE ALPS Core REST API
     * ## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location 
     *
     * OpenAPI spec version: 0.5.0
     * Contact: support@matchmore.com
     *
     * NOTE: This class is auto generated by the swagger code generator program.
     * https://github.com/swagger-api/swagger-codegen.git
     *
     * Swagger Codegen version: 2.3.1
     *
     * Do not edit the class manually.
     *
     */
    
    (function(root, factory) {
      if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ApiClient', 'model/APIError', 'model/Match', 'model/Matches'], factory);
      } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        module.exports = factory(require('../ApiClient'), require('../model/APIError'), require('../model/Match'), require('../model/Matches'));
      } else {
        // Browser globals (root is window)
        if (!root.MatchmoreAlpsCoreRestApi) {
          root.MatchmoreAlpsCoreRestApi = {};
        }
        root.MatchmoreAlpsCoreRestApi.MatchesApi = factory(root.MatchmoreAlpsCoreRestApi.ApiClient, root.MatchmoreAlpsCoreRestApi.APIError, root.MatchmoreAlpsCoreRestApi.Match, root.MatchmoreAlpsCoreRestApi.Matches);
      }
    }(this, function(ApiClient, APIError, Match, Matches) {
      'use strict';
    
      /**
       * Matches service.
       * @module api/MatchesApi
       * @version 0.5.0
       */
    
      /**
       * Constructs a new MatchesApi. 
       * @alias module:api/MatchesApi
       * @class
       * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
       * default to {@link module:ApiClient#instance} if unspecified.
       */
      var exports = function(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    
    
        /**
         * Callback function to receive the result of the getMatch operation.
         * @callback module:api/MatchesApi~getMatchCallback
         * @param {String} error Error message, if any.
         * @param {module:model/Match} data The data returned by the service call.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Get match for the device by its id
         * @param {String} deviceId The id (UUID) of the user device.
         * @param {String} matchId The id (UUID) of the match.
         * @param {module:api/MatchesApi~getMatchCallback} callback The callback function, accepting three arguments: error, data, response
         * data is of type: {@link module:model/Match}
         */
        this.getMatch = function(deviceId, matchId, callback) {
          var postBody = null;
    
          // verify the required parameter 'deviceId' is set
          if (deviceId === undefined || deviceId === null) {
            throw new Error("Missing the required parameter 'deviceId' when calling getMatch");
          }
    
          // verify the required parameter 'matchId' is set
          if (matchId === undefined || matchId === null) {
            throw new Error("Missing the required parameter 'matchId' when calling getMatch");
          }
    
    
          var pathParams = {
            'deviceId': deviceId,
            'matchId': matchId
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = Match;
    
          return this.apiClient.callApi(
            '/devices/{deviceId}/matches/{matchId}', 'GET',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
    
        /**
         * Callback function to receive the result of the getMatches operation.
         * @callback module:api/MatchesApi~getMatchesCallback
         * @param {String} error Error message, if any.
         * @param {module:model/Matches} data The data returned by the service call.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Get matches for the device
         * @param {String} deviceId The id (UUID) of the device.
         * @param {module:api/MatchesApi~getMatchesCallback} callback The callback function, accepting three arguments: error, data, response
         * data is of type: {@link module:model/Matches}
         */
        this.getMatches = function(deviceId, callback) {
          var postBody = null;
    
          // verify the required parameter 'deviceId' is set
          if (deviceId === undefined || deviceId === null) {
            throw new Error("Missing the required parameter 'deviceId' when calling getMatches");
          }
    
    
          var pathParams = {
            'deviceId': deviceId
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = Matches;
    
          return this.apiClient.callApi(
            '/devices/{deviceId}/matches', 'GET',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
      };
    
      return exports;
    }));
    
    },{"../ApiClient":1,"../model/APIError":8,"../model/Match":17,"../model/Matches":18}],5:[function(require,module,exports){
    /**
     * MATCHMORE ALPS Core REST API
     * ## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location 
     *
     * OpenAPI spec version: 0.5.0
     * Contact: support@matchmore.com
     *
     * NOTE: This class is auto generated by the swagger code generator program.
     * https://github.com/swagger-api/swagger-codegen.git
     *
     * Swagger Codegen version: 2.3.1
     *
     * Do not edit the class manually.
     *
     */
    
    (function(root, factory) {
      if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ApiClient', 'model/APIError', 'model/Publication', 'model/Publications'], factory);
      } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        module.exports = factory(require('../ApiClient'), require('../model/APIError'), require('../model/Publication'), require('../model/Publications'));
      } else {
        // Browser globals (root is window)
        if (!root.MatchmoreAlpsCoreRestApi) {
          root.MatchmoreAlpsCoreRestApi = {};
        }
        root.MatchmoreAlpsCoreRestApi.PublicationApi = factory(root.MatchmoreAlpsCoreRestApi.ApiClient, root.MatchmoreAlpsCoreRestApi.APIError, root.MatchmoreAlpsCoreRestApi.Publication, root.MatchmoreAlpsCoreRestApi.Publications);
      }
    }(this, function(ApiClient, APIError, Publication, Publications) {
      'use strict';
    
      /**
       * Publication service.
       * @module api/PublicationApi
       * @version 0.5.0
       */
    
      /**
       * Constructs a new PublicationApi. 
       * @alias module:api/PublicationApi
       * @class
       * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
       * default to {@link module:ApiClient#instance} if unspecified.
       */
      var exports = function(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    
    
        /**
         * Callback function to receive the result of the createPublication operation.
         * @callback module:api/PublicationApi~createPublicationCallback
         * @param {String} error Error message, if any.
         * @param {module:model/Publication} data The data returned by the service call.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Create a publication for a device
         * @param {String} deviceId The id (UUID) of the device.
         * @param {module:model/Publication} publication Publication to create on a device. 
         * @param {module:api/PublicationApi~createPublicationCallback} callback The callback function, accepting three arguments: error, data, response
         * data is of type: {@link module:model/Publication}
         */
        this.createPublication = function(deviceId, publication, callback) {
          var postBody = publication;
    
          // verify the required parameter 'deviceId' is set
          if (deviceId === undefined || deviceId === null) {
            throw new Error("Missing the required parameter 'deviceId' when calling createPublication");
          }
    
          // verify the required parameter 'publication' is set
          if (publication === undefined || publication === null) {
            throw new Error("Missing the required parameter 'publication' when calling createPublication");
          }
    
    
          var pathParams = {
            'deviceId': deviceId
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = Publication;
    
          return this.apiClient.callApi(
            '/devices/{deviceId}/publications', 'POST',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
    
        /**
         * Callback function to receive the result of the deletePublication operation.
         * @callback module:api/PublicationApi~deletePublicationCallback
         * @param {String} error Error message, if any.
         * @param data This operation does not return a value.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Delete a Publication
         * 
         * @param {String} deviceId The id (UUID) of the device.
         * @param {String} publicationId The id (UUID) of the subscription.
         * @param {module:api/PublicationApi~deletePublicationCallback} callback The callback function, accepting three arguments: error, data, response
         */
        this.deletePublication = function(deviceId, publicationId, callback) {
          var postBody = null;
    
          // verify the required parameter 'deviceId' is set
          if (deviceId === undefined || deviceId === null) {
            throw new Error("Missing the required parameter 'deviceId' when calling deletePublication");
          }
    
          // verify the required parameter 'publicationId' is set
          if (publicationId === undefined || publicationId === null) {
            throw new Error("Missing the required parameter 'publicationId' when calling deletePublication");
          }
    
    
          var pathParams = {
            'deviceId': deviceId,
            'publicationId': publicationId
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = null;
    
          return this.apiClient.callApi(
            '/devices/{deviceId}/publications/{publicationId}', 'DELETE',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
    
        /**
         * Callback function to receive the result of the getPublication operation.
         * @callback module:api/PublicationApi~getPublicationCallback
         * @param {String} error Error message, if any.
         * @param {module:model/Publication} data The data returned by the service call.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Info about a publication on a device
         * @param {String} deviceId The id (UUID) of the device.
         * @param {String} publicationId The id (UUID) of the publication.
         * @param {module:api/PublicationApi~getPublicationCallback} callback The callback function, accepting three arguments: error, data, response
         * data is of type: {@link module:model/Publication}
         */
        this.getPublication = function(deviceId, publicationId, callback) {
          var postBody = null;
    
          // verify the required parameter 'deviceId' is set
          if (deviceId === undefined || deviceId === null) {
            throw new Error("Missing the required parameter 'deviceId' when calling getPublication");
          }
    
          // verify the required parameter 'publicationId' is set
          if (publicationId === undefined || publicationId === null) {
            throw new Error("Missing the required parameter 'publicationId' when calling getPublication");
          }
    
    
          var pathParams = {
            'deviceId': deviceId,
            'publicationId': publicationId
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = Publication;
    
          return this.apiClient.callApi(
            '/devices/{deviceId}/publications/{publicationId}', 'GET',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
    
        /**
         * Callback function to receive the result of the getPublications operation.
         * @callback module:api/PublicationApi~getPublicationsCallback
         * @param {String} error Error message, if any.
         * @param {module:model/Publications} data The data returned by the service call.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Get all publications for a device
         * @param {String} deviceId The id (UUID) of the device.
         * @param {module:api/PublicationApi~getPublicationsCallback} callback The callback function, accepting three arguments: error, data, response
         * data is of type: {@link module:model/Publications}
         */
        this.getPublications = function(deviceId, callback) {
          var postBody = null;
    
          // verify the required parameter 'deviceId' is set
          if (deviceId === undefined || deviceId === null) {
            throw new Error("Missing the required parameter 'deviceId' when calling getPublications");
          }
    
    
          var pathParams = {
            'deviceId': deviceId
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = Publications;
    
          return this.apiClient.callApi(
            '/devices/{deviceId}/publications', 'GET',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
      };
    
      return exports;
    }));
    
    },{"../ApiClient":1,"../model/APIError":8,"../model/Publication":22,"../model/Publications":23}],6:[function(require,module,exports){
    /**
     * MATCHMORE ALPS Core REST API
     * ## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location 
     *
     * OpenAPI spec version: 0.5.0
     * Contact: support@matchmore.com
     *
     * NOTE: This class is auto generated by the swagger code generator program.
     * https://github.com/swagger-api/swagger-codegen.git
     *
     * Swagger Codegen version: 2.3.1
     *
     * Do not edit the class manually.
     *
     */
    
    (function(root, factory) {
      if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ApiClient', 'model/APIError', 'model/Subscription', 'model/Subscriptions'], factory);
      } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        module.exports = factory(require('../ApiClient'), require('../model/APIError'), require('../model/Subscription'), require('../model/Subscriptions'));
      } else {
        // Browser globals (root is window)
        if (!root.MatchmoreAlpsCoreRestApi) {
          root.MatchmoreAlpsCoreRestApi = {};
        }
        root.MatchmoreAlpsCoreRestApi.SubscriptionApi = factory(root.MatchmoreAlpsCoreRestApi.ApiClient, root.MatchmoreAlpsCoreRestApi.APIError, root.MatchmoreAlpsCoreRestApi.Subscription, root.MatchmoreAlpsCoreRestApi.Subscriptions);
      }
    }(this, function(ApiClient, APIError, Subscription, Subscriptions) {
      'use strict';
    
      /**
       * Subscription service.
       * @module api/SubscriptionApi
       * @version 0.5.0
       */
    
      /**
       * Constructs a new SubscriptionApi. 
       * @alias module:api/SubscriptionApi
       * @class
       * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
       * default to {@link module:ApiClient#instance} if unspecified.
       */
      var exports = function(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    
    
        /**
         * Callback function to receive the result of the createSubscription operation.
         * @callback module:api/SubscriptionApi~createSubscriptionCallback
         * @param {String} error Error message, if any.
         * @param {module:model/Subscription} data The data returned by the service call.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Create a subscription for a device
         * @param {String} deviceId The id (UUID) of the device. 
         * @param {module:model/Subscription} subscription Subscription to create on a device. 
         * @param {module:api/SubscriptionApi~createSubscriptionCallback} callback The callback function, accepting three arguments: error, data, response
         * data is of type: {@link module:model/Subscription}
         */
        this.createSubscription = function(deviceId, subscription, callback) {
          var postBody = subscription;
    
          // verify the required parameter 'deviceId' is set
          if (deviceId === undefined || deviceId === null) {
            throw new Error("Missing the required parameter 'deviceId' when calling createSubscription");
          }
    
          // verify the required parameter 'subscription' is set
          if (subscription === undefined || subscription === null) {
            throw new Error("Missing the required parameter 'subscription' when calling createSubscription");
          }
    
    
          var pathParams = {
            'deviceId': deviceId
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = Subscription;
    
          return this.apiClient.callApi(
            '/devices/{deviceId}/subscriptions', 'POST',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
    
        /**
         * Callback function to receive the result of the deleteSubscription operation.
         * @callback module:api/SubscriptionApi~deleteSubscriptionCallback
         * @param {String} error Error message, if any.
         * @param data This operation does not return a value.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Delete a Subscription
         * 
         * @param {String} deviceId The id (UUID) of the device.
         * @param {String} subscriptionId The id (UUID) of the subscription.
         * @param {module:api/SubscriptionApi~deleteSubscriptionCallback} callback The callback function, accepting three arguments: error, data, response
         */
        this.deleteSubscription = function(deviceId, subscriptionId, callback) {
          var postBody = null;
    
          // verify the required parameter 'deviceId' is set
          if (deviceId === undefined || deviceId === null) {
            throw new Error("Missing the required parameter 'deviceId' when calling deleteSubscription");
          }
    
          // verify the required parameter 'subscriptionId' is set
          if (subscriptionId === undefined || subscriptionId === null) {
            throw new Error("Missing the required parameter 'subscriptionId' when calling deleteSubscription");
          }
    
    
          var pathParams = {
            'deviceId': deviceId,
            'subscriptionId': subscriptionId
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = null;
    
          return this.apiClient.callApi(
            '/devices/{deviceId}/subscriptions/{subscriptionId}', 'DELETE',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
    
        /**
         * Callback function to receive the result of the getSubscription operation.
         * @callback module:api/SubscriptionApi~getSubscriptionCallback
         * @param {String} error Error message, if any.
         * @param {module:model/Subscription} data The data returned by the service call.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Info about a subscription on a device
         * @param {String} deviceId The id (UUID) of the device.
         * @param {String} subscriptionId The id (UUID) of the subscription.
         * @param {module:api/SubscriptionApi~getSubscriptionCallback} callback The callback function, accepting three arguments: error, data, response
         * data is of type: {@link module:model/Subscription}
         */
        this.getSubscription = function(deviceId, subscriptionId, callback) {
          var postBody = null;
    
          // verify the required parameter 'deviceId' is set
          if (deviceId === undefined || deviceId === null) {
            throw new Error("Missing the required parameter 'deviceId' when calling getSubscription");
          }
    
          // verify the required parameter 'subscriptionId' is set
          if (subscriptionId === undefined || subscriptionId === null) {
            throw new Error("Missing the required parameter 'subscriptionId' when calling getSubscription");
          }
    
    
          var pathParams = {
            'deviceId': deviceId,
            'subscriptionId': subscriptionId
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = Subscription;
    
          return this.apiClient.callApi(
            '/devices/{deviceId}/subscriptions/{subscriptionId}', 'GET',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
    
        /**
         * Callback function to receive the result of the getSubscriptions operation.
         * @callback module:api/SubscriptionApi~getSubscriptionsCallback
         * @param {String} error Error message, if any.
         * @param {module:model/Subscriptions} data The data returned by the service call.
         * @param {String} response The complete HTTP response.
         */
    
        /**
         * Get all subscriptions for a device
         * @param {String} deviceId The id (UUID) of the device.
         * @param {module:api/SubscriptionApi~getSubscriptionsCallback} callback The callback function, accepting three arguments: error, data, response
         * data is of type: {@link module:model/Subscriptions}
         */
        this.getSubscriptions = function(deviceId, callback) {
          var postBody = null;
    
          // verify the required parameter 'deviceId' is set
          if (deviceId === undefined || deviceId === null) {
            throw new Error("Missing the required parameter 'deviceId' when calling getSubscriptions");
          }
    
    
          var pathParams = {
            'deviceId': deviceId
          };
          var queryParams = {
          };
          var collectionQueryParams = {
          };
          var headerParams = {
          };
          var formParams = {
          };
    
          var authNames = ['api-key'];
          var contentTypes = ['application/json'];
          var accepts = ['application/json'];
          var returnType = Subscriptions;
    
          return this.apiClient.callApi(
            '/devices/{deviceId}/subscriptions', 'GET',
            pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, returnType, callback
          );
        }
      };
    
      return exports;
    }));
    
    },{"../ApiClient":1,"../model/APIError":8,"../model/Subscription":24,"../model/Subscriptions":25}],7:[function(require,module,exports){
    /**
     * MATCHMORE ALPS Core REST API
     * ## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location 
     *
     * OpenAPI spec version: 0.5.0
     * Contact: support@matchmore.com
     *
     * NOTE: This class is auto generated by the swagger code generator program.
     * https://github.com/swagger-api/swagger-codegen.git
     *
     * Swagger Codegen version: 2.3.1
     *
     * Do not edit the class manually.
     *
     */
    
    (function(factory) {
      if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ApiClient', 'model/APIError', 'model/Device', 'model/DeviceType', 'model/DeviceUpdate', 'model/Devices', 'model/IBeaconTriple', 'model/IBeaconTriples', 'model/Location', 'model/Match', 'model/Matches', 'model/ProximityEvent', 'model/Publication', 'model/Publications', 'model/Subscription', 'model/Subscriptions', 'model/IBeaconDevice', 'model/MobileDevice', 'model/PinDevice', 'api/DeviceApi', 'api/LocationApi', 'api/MatchesApi', 'api/PublicationApi', 'api/SubscriptionApi'], factory);
      } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        module.exports = factory(require('./ApiClient'), require('./model/APIError'), require('./model/Device'), require('./model/DeviceType'), require('./model/DeviceUpdate'), require('./model/Devices'), require('./model/IBeaconTriple'), require('./model/IBeaconTriples'), require('./model/Location'), require('./model/Match'), require('./model/Matches'), require('./model/ProximityEvent'), require('./model/Publication'), require('./model/Publications'), require('./model/Subscription'), require('./model/Subscriptions'), require('./model/IBeaconDevice'), require('./model/MobileDevice'), require('./model/PinDevice'), require('./api/DeviceApi'), require('./api/LocationApi'), require('./api/MatchesApi'), require('./api/PublicationApi'), require('./api/SubscriptionApi'));
      }
    }(function(ApiClient, APIError, Device, DeviceType, DeviceUpdate, Devices, IBeaconTriple, IBeaconTriples, Location, Match, Matches, ProximityEvent, Publication, Publications, Subscription, Subscriptions, IBeaconDevice, MobileDevice, PinDevice, DeviceApi, LocationApi, MatchesApi, PublicationApi, SubscriptionApi) {
      'use strict';
    
      /**
       * _ALPS_by__MATCHMORE_httpsmatchmore_ioThe_first_version_of_the_MATCHMORE_API_is_an_exciting_step_toallow_developers_use_a_context_aware_pubsub_cloud_service___A_lotof_mobile_applications_and_their_use_cases_may_be_modeled_usingthis_approach_and_can_therefore_profit_from_using_MATCHMORE_astheir_backend_service_Build_something_great_with__ALPS_by_MATCHMORE_httpsmatchmore_ioOnce_youve__registered_yourclient_httpsmatchmore_ioaccountregister_its_easystart_using_our_awesome_cloud_based_context_aware_pubsub_admitted_a_lot_of_buzzwords__RESTful_APIWe_do_our_best_to_have_all_our_URLs_be_RESTful_httpsen_wikipedia_orgwikiRepresentational_state_transfer_Every_endpoint__URL_may_support_one_of_four_different_http_verbs__GETrequests_fetch_information_about_an_object_POST_requests_create_objectsPUT_requests_update_objects_and_finally_DELETE_requests_will_deleteobjects__Domain_ModelThis_is_the_current_domain_model_extended_by_an_ontology_of_devicesand_separation_between_the_developer_portal_and_the_ALPS_Core______________________________________Developer______Application____________________________________________________________________________________Developer_Portal__________________________________________________________________________________________________________________________ALPS_Core_______________________________________________________World__________________________________________________________________________________________________________________________________________________________Publication_________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________Match_________________________Device______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________Subscription_____________________________________________________________________________________________________________________Pin_________iBeacon______Mobile_________________________________________________________________________________________________________________________________________________Location__________________________________________1___A_developer_is_a_mobile_application_developer_registered_in_the____developer_portal_and_allowed_to_use_the_ALPS_Developer_Portal___A____developer_might_register_one_or_more_applications_to_use_the____ALPS_Core_cloud_service___For_developerapplication_pair_a_new____world_is_created_in_the_ALPS_Core_and_assigned_an_API_key_to____enable_access_to_the_ALPS_Core_cloud_service_RESTful_API___During____the_registration_the_developer_needs_to_provide_additional____configuration_information_for_each_application_e_g__its_default____push_endpoint_URI_for_match_delivery_etc_2___A__device_tagdevice_might_be_either_virtual_like_a_pin_device_or____physical_like_a_mobile_device_or_iBeacon_device___A__pin____device_tagdevice_is_one_that_has_geographical__location_taglocation_associated_with_it____but_is_not_represented_by_any_object_in_the_physical_world_usually____its_location_doesnt_change_frequently_if_at_all___A__mobile____device_tagdevice_is_one_that_potentially_moves_together_with_its_user_and____therefore_has_a_geographical_location_associated_with_it___A_mobile____device_is_typically_a_location_aware_smartphone_which_knows_its____location_thanks_to_GPS_or_to_some_other_means_like_cell_tower____triangulation_etc___An__iBeacon_device_tagdevice_represents_an_Apple____conform__iBeacon_httpsdeveloper_apple_comibeacon_announcing_its_presence_via_Bluetooth_LE____advertising_packets_which_can_be_detected_by_a_other_mobile_device_____It_doesnt_necessary_has_any_location_associated_with_it_but_it____serves_to_detect_and_announce_its_proximity_to_other_mobile____devices_3___The_hardware_and_software_stack_running_on_a_given_device_is_known____as_its_platform___This_include_its_hardware_related_capabilities____its_operating_systems_as_well_as_the_set_of_libraries__APIs____offered_to_developers_in_order_to_program_it_4___A_devices_may_issue_publications_and_subscriptions____at_any_time_it_may_also_cancel_publications_and_subscriptions____issued_previously___Publications_and_subscriptions_do_have_a____definable_finite_duration_after_which_they_are_deleted_from_the____ALPS_Core_cloud_service_and_dont_participate_anymore_in_the____matching_process_5___A__publication_tagpublication_is_similar_to_a_Java_Messaging_Service__JMS____publication_extended_with_the_notion_of_a_geographical_zone___The____zone_is_defined_as_circle_with_a_center_at_the_given_location_and____a_range_around_that_location_6___A__subscription_tagsubscription_is_similar_to_a_JMS_subscription_extended_with_the____notion_of_geographical_zone__Again_the_zone_being_defined_as____circle_with_a_center_at_the_given_location_and_a_range_around____that_location_7___Publications_and_subscriptions_which_are_associated_with_a____mobile_device_e_g__users_mobile_phone_potentially_follow_the____movements_of_the_user_carrying_the_device_and_therefore_change____their_associated_location_8___A__match_tagmatch_between_a_publication_and_a_subscription_occurs_when_both____of_the_following_two_conditions_hold____1___There_is_a_context_match_occurs_when_for_instance_the________subscription_zone_overlaps_with_the_publication_zone_or_a________proximity_event_with_an_iBeacon_device_within_the_defined________range_occurred_____2___There_is_a_content_match_the_publication_and_the_subscription________match_with_respect_to_their_JMS_counterparts_i_e__they_were________issued_on_the_same_topic_and_have_compatible_properties_and_the________evaluation_of_the_selector_against_those_properties_returns_true________value_9___A_push_notification_is_an_asynchronous_mechanism_that_allows_an____application_to_receive_matches_for_a_subscription_on_hisher_device_____Such_a_mechanism_is_clearly_dependent_on_the_devices_platform_and____capabilities___In_order_to_use_push_notifications_an_application_must____first_register_a_device__and_possibly_an_application_on_that____device_with_the_ALPS_core_cloud_service_10__Whenever_a_match_between_a_publication_and_a_subscription____occurs_the_device_which_owns_the_subscription_receives_that_match____asynchronously_via_a_push_notification_if_there_exists_a____registered_push_endpoint___A_push_endpoint_is_an_URI_which_is____able_to_consume_the_matches_for_a_particular_device_and____subscription___The_push_endpoint_doesnt_necessary_point_to_a____mobile_device_but_is_rather_a_very_flexible_mechanism_to_define____where_the_matches_should_be_delivered_11__Matches_can_also_be_retrieved_by_issuing_a_API_call_for_a____particular_device_a_idorgae4fb18a_Device_Types______________________________________________Device________________________________________________id_________________________name_______________________group_______________________________________________________________________________________________________________________________________________________________________________Pin______iBeacon___________Mobile____________________________________________________________proximityUUID_____platform_________________major_____________token____________________minor____________________________________________________________________________________________________________________________________________________________________________________________Location________________________________________a_idorg68cc0d8a_Generic_Device____id____name____groupa_idorgc430925a_PinDevice____locationa_idorgecaed9fa_iBeaconDevice____proximityUUID____major____minora_idorg7b09b62a_MobileDevice____platform____deviceToken____location.<br>
       * The <code>index</code> module provides access to constructors for all the classes which comprise the public API.
       * <p>
       * An AMD (recommended!) or CommonJS application will generally do something equivalent to the following:
       * <pre>
       * var MatchmoreAlpsCoreRestApi = require('index'); // See note below*.
       * var xxxSvc = new MatchmoreAlpsCoreRestApi.XxxApi(); // Allocate the API class we're going to use.
       * var yyyModel = new MatchmoreAlpsCoreRestApi.Yyy(); // Construct a model instance.
       * yyyModel.someProperty = 'someValue';
       * ...
       * var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
       * ...
       * </pre>
       * <em>*NOTE: For a top-level AMD script, use require(['index'], function(){...})
       * and put the application logic within the callback function.</em>
       * </p>
       * <p>
       * A non-AMD browser application (discouraged) might do something like this:
       * <pre>
       * var xxxSvc = new MatchmoreAlpsCoreRestApi.XxxApi(); // Allocate the API class we're going to use.
       * var yyy = new MatchmoreAlpsCoreRestApi.Yyy(); // Construct a model instance.
       * yyyModel.someProperty = 'someValue';
       * ...
       * var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
       * ...
       * </pre>
       * </p>
       * @module index
       * @version 0.5.0
       */
      var exports = {
        /**
         * The ApiClient constructor.
         * @property {module:ApiClient}
         */
        ApiClient: ApiClient,
        /**
         * The APIError model constructor.
         * @property {module:model/APIError}
         */
        APIError: APIError,
        /**
         * The Device model constructor.
         * @property {module:model/Device}
         */
        Device: Device,
        /**
         * The DeviceType model constructor.
         * @property {module:model/DeviceType}
         */
        DeviceType: DeviceType,
        /**
         * The DeviceUpdate model constructor.
         * @property {module:model/DeviceUpdate}
         */
        DeviceUpdate: DeviceUpdate,
        /**
         * The Devices model constructor.
         * @property {module:model/Devices}
         */
        Devices: Devices,
        /**
         * The IBeaconTriple model constructor.
         * @property {module:model/IBeaconTriple}
         */
        IBeaconTriple: IBeaconTriple,
        /**
         * The IBeaconTriples model constructor.
         * @property {module:model/IBeaconTriples}
         */
        IBeaconTriples: IBeaconTriples,
        /**
         * The Location model constructor.
         * @property {module:model/Location}
         */
        Location: Location,
        /**
         * The Match model constructor.
         * @property {module:model/Match}
         */
        Match: Match,
        /**
         * The Matches model constructor.
         * @property {module:model/Matches}
         */
        Matches: Matches,
        /**
         * The ProximityEvent model constructor.
         * @property {module:model/ProximityEvent}
         */
        ProximityEvent: ProximityEvent,
        /**
         * The Publication model constructor.
         * @property {module:model/Publication}
         */
        Publication: Publication,
        /**
         * The Publications model constructor.
         * @property {module:model/Publications}
         */
        Publications: Publications,
        /**
         * The Subscription model constructor.
         * @property {module:model/Subscription}
         */
        Subscription: Subscription,
        /**
         * The Subscriptions model constructor.
         * @property {module:model/Subscriptions}
         */
        Subscriptions: Subscriptions,
        /**
         * The IBeaconDevice model constructor.
         * @property {module:model/IBeaconDevice}
         */
        IBeaconDevice: IBeaconDevice,
        /**
         * The MobileDevice model constructor.
         * @property {module:model/MobileDevice}
         */
        MobileDevice: MobileDevice,
        /**
         * The PinDevice model constructor.
         * @property {module:model/PinDevice}
         */
        PinDevice: PinDevice,
        /**
         * The DeviceApi service constructor.
         * @property {module:api/DeviceApi}
         */
        DeviceApi: DeviceApi,
        /**
         * The LocationApi service constructor.
         * @property {module:api/LocationApi}
         */
        LocationApi: LocationApi,
        /**
         * The MatchesApi service constructor.
         * @property {module:api/MatchesApi}
         */
        MatchesApi: MatchesApi,
        /**
         * The PublicationApi service constructor.
         * @property {module:api/PublicationApi}
         */
        PublicationApi: PublicationApi,
        /**
         * The SubscriptionApi service constructor.
         * @property {module:api/SubscriptionApi}
         */
        SubscriptionApi: SubscriptionApi
      };
    
      return exports;
    }));
    
    },{"./ApiClient":1,"./api/DeviceApi":2,"./api/LocationApi":3,"./api/MatchesApi":4,"./api/PublicationApi":5,"./api/SubscriptionApi":6,"./model/APIError":8,"./model/Device":9,"./model/DeviceType":10,"./model/DeviceUpdate":11,"./model/Devices":12,"./model/IBeaconDevice":13,"./model/IBeaconTriple":14,"./model/IBeaconTriples":15,"./model/Location":16,"./model/Match":17,"./model/Matches":18,"./model/MobileDevice":19,"./model/PinDevice":20,"./model/ProximityEvent":21,"./model/Publication":22,"./model/Publications":23,"./model/Subscription":24,"./model/Subscriptions":25}],8:[function(require,module,exports){
    /**
     * MATCHMORE ALPS Core REST API
     * ## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location 
     *
     * OpenAPI spec version: 0.5.0
     * Contact: support@matchmore.com
     *
     * NOTE: This class is auto generated by the swagger code generator program.
     * https://github.com/swagger-api/swagger-codegen.git
     *
     * Swagger Codegen version: 2.3.1
     *
     * Do not edit the class manually.
     *
     */
    
    (function(root, factory) {
      if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ApiClient'], factory);
      } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        module.exports = factory(require('../ApiClient'));
      } else {
        // Browser globals (root is window)
        if (!root.MatchmoreAlpsCoreRestApi) {
          root.MatchmoreAlpsCoreRestApi = {};
        }
        root.MatchmoreAlpsCoreRestApi.APIError = factory(root.MatchmoreAlpsCoreRestApi.ApiClient);
      }
    }(this, function(ApiClient) {
      'use strict';
    
    
    
    
      /**
       * The APIError model module.
       * @module model/APIError
       * @version 0.5.0
       */
    
      /**
       * Constructs a new <code>APIError</code>.
       * @alias module:model/APIError
       * @class
       * @param code {Number} 
       * @param message {String} 
       */
      var exports = function(code, message) {
        var _this = this;
    
        _this['code'] = code;
        _this['message'] = message;
      };
    
      /**
       * Constructs a <code>APIError</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/APIError} obj Optional instance to populate.
       * @return {module:model/APIError} The populated <code>APIError</code> instance.
       */
      exports.constructFromObject = function(data, obj) {
        if (data) {
          obj = obj || new exports();
    
          if (data.hasOwnProperty('code')) {
            obj['code'] = ApiClient.convertToType(data['code'], 'Number');
          }
          if (data.hasOwnProperty('message')) {
            obj['message'] = ApiClient.convertToType(data['message'], 'String');
          }
        }
        return obj;
      }
    
      /**
       * @member {Number} code
       */
      exports.prototype['code'] = undefined;
      /**
       * @member {String} message
       */
      exports.prototype['message'] = undefined;
    
    
    
      return exports;
    }));
    
    
    
    },{"../ApiClient":1}],9:[function(require,module,exports){
    /**
     * MATCHMORE ALPS Core REST API
     * ## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location 
     *
     * OpenAPI spec version: 0.5.0
     * Contact: support@matchmore.com
     *
     * NOTE: This class is auto generated by the swagger code generator program.
     * https://github.com/swagger-api/swagger-codegen.git
     *
     * Swagger Codegen version: 2.3.1
     *
     * Do not edit the class manually.
     *
     */
    
    (function(root, factory) {
      if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ApiClient', 'model/DeviceType'], factory);
      } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        module.exports = factory(require('../ApiClient'), require('./DeviceType'));
      } else {
        // Browser globals (root is window)
        if (!root.MatchmoreAlpsCoreRestApi) {
          root.MatchmoreAlpsCoreRestApi = {};
        }
        root.MatchmoreAlpsCoreRestApi.Device = factory(root.MatchmoreAlpsCoreRestApi.ApiClient, root.MatchmoreAlpsCoreRestApi.DeviceType);
      }
    }(this, function(ApiClient, DeviceType) {
      'use strict';
    
    
    
    
      /**
       * The Device model module.
       * @module model/Device
       * @version 0.5.0
       */
    
      /**
       * Constructs a new <code>Device</code>.
       * A device might be either virtual like a pin device or physical like a mobile phone or iBeacon device. 
       * @alias module:model/Device
       * @class
       * @param deviceType {module:model/DeviceType} 
       */
      var exports = function(deviceType) {
        var _this = this;
    
    
    
    
    
    
        _this['deviceType'] = deviceType;
      };
    
      /**
       * Constructs a <code>Device</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/Device} obj Optional instance to populate.
       * @return {module:model/Device} The populated <code>Device</code> instance.
       */
      exports.constructFromObject = function(data, obj) {
        if (data) {
          obj = obj || new exports();
    
          if (data.hasOwnProperty('id')) {
            obj['id'] = ApiClient.convertToType(data['id'], 'String');
          }
          if (data.hasOwnProperty('createdAt')) {
            obj['createdAt'] = ApiClient.convertToType(data['createdAt'], 'Number');
          }
          if (data.hasOwnProperty('updatedAt')) {
            obj['updatedAt'] = ApiClient.convertToType(data['updatedAt'], 'Number');
          }
          if (data.hasOwnProperty('group')) {
            obj['group'] = ApiClient.convertToType(data['group'], ['String']);
          }
          if (data.hasOwnProperty('name')) {
            obj['name'] = ApiClient.convertToType(data['name'], 'String');
          }
          if (data.hasOwnProperty('deviceType')) {
            obj['deviceType'] = DeviceType.constructFromObject(data['deviceType']);
          }
        }
        return obj;
      }
    
      /**
       * The id (UUID) of the device.
       * @member {String} id
       */
      exports.prototype['id'] = undefined;
      /**
       * The timestamp of the device's creation in seconds since Jan 01 1970 (UTC). 
       * @member {Number} createdAt
       */
      exports.prototype['createdAt'] = undefined;
      /**
       * The timestamp of the device's creation in seconds since Jan 01 1970 (UTC). 
       * @member {Number} updatedAt
       */
      exports.prototype['updatedAt'] = undefined;
      /**
       * Optional device groups, one device can belong to multiple groups, grops are string that can be max 25 characters long and contains letters numbers or underscores
       * @member {Array.<String>} group
       */
      exports.prototype['group'] = undefined;
      /**
       * The name of the device.
       * @member {String} name
       * @default ''
       */
      exports.prototype['name'] = '';
      /**
       * @member {module:model/DeviceType} deviceType
       */
      exports.prototype['deviceType'] = undefined;
    
    
    
      return exports;
    }));
    
    
    
    },{"../ApiClient":1,"./DeviceType":10}],10:[function(require,module,exports){
    /**
     * MATCHMORE ALPS Core REST API
     * ## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location 
     *
     * OpenAPI spec version: 0.5.0
     * Contact: support@matchmore.com
     *
     * NOTE: This class is auto generated by the swagger code generator program.
     * https://github.com/swagger-api/swagger-codegen.git
     *
     * Swagger Codegen version: 2.3.1
     *
     * Do not edit the class manually.
     *
     */
    
    (function(root, factory) {
      if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ApiClient'], factory);
      } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        module.exports = factory(require('../ApiClient'));
      } else {
        // Browser globals (root is window)
        if (!root.MatchmoreAlpsCoreRestApi) {
          root.MatchmoreAlpsCoreRestApi = {};
        }
        root.MatchmoreAlpsCoreRestApi.DeviceType = factory(root.MatchmoreAlpsCoreRestApi.ApiClient);
      }
    }(this, function(ApiClient) {
      'use strict';
    
    
      /**
       * Enum class DeviceType.
       * @enum {}
       * @readonly
       */
      var exports = {
        /**
         * value: "MobileDevice"
         * @const
         */
        "MobileDevice": "MobileDevice",
        /**
         * value: "PinDevice"
         * @const
         */
        "PinDevice": "PinDevice",
        /**
         * value: "IBeaconDevice"
         * @const
         */
        "IBeaconDevice": "IBeaconDevice"  };
    
      /**
       * Returns a <code>DeviceType</code> enum value from a Javascript object name.
       * @param {Object} data The plain JavaScript object containing the name of the enum value.
       * @return {module:model/DeviceType} The enum <code>DeviceType</code> value.
       */
      exports.constructFromObject = function(object) {
        return object;
      }
    
      return exports;
    }));
    
    
    
    },{"../ApiClient":1}],11:[function(require,module,exports){
    /**
     * MATCHMORE ALPS Core REST API
     * ## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location 
     *
     * OpenAPI spec version: 0.5.0
     * Contact: support@matchmore.com
     *
     * NOTE: This class is auto generated by the swagger code generator program.
     * https://github.com/swagger-api/swagger-codegen.git
     *
     * Swagger Codegen version: 2.3.1
     *
     * Do not edit the class manually.
     *
     */
    
    (function(root, factory) {
      if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ApiClient'], factory);
      } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        module.exports = factory(require('../ApiClient'));
      } else {
        // Browser globals (root is window)
        if (!root.MatchmoreAlpsCoreRestApi) {
          root.MatchmoreAlpsCoreRestApi = {};
        }
        root.MatchmoreAlpsCoreRestApi.DeviceUpdate = factory(root.MatchmoreAlpsCoreRestApi.ApiClient);
      }
    }(this, function(ApiClient) {
      'use strict';
    
    
    
    
      /**
       * The DeviceUpdate model module.
       * @module model/DeviceUpdate
       * @version 0.5.0
       */
    
      /**
       * Constructs a new <code>DeviceUpdate</code>.
       * Describes update of device, it allows to change name of device and device token (only in case of mobile devices)
       * @alias module:model/DeviceUpdate
       * @class
       */
      var exports = function() {
        var _this = this;
    
    
    
      };
    
      /**
       * Constructs a <code>DeviceUpdate</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/DeviceUpdate} obj Optional instance to populate.
       * @return {module:model/DeviceUpdate} The populated <code>DeviceUpdate</code> instance.
       */
      exports.constructFromObject = function(data, obj) {
        if (data) {
          obj = obj || new exports();
    
          if (data.hasOwnProperty('name')) {
            obj['name'] = ApiClient.convertToType(data['name'], 'String');
          }
          if (data.hasOwnProperty('deviceToken')) {
            obj['deviceToken'] = ApiClient.convertToType(data['deviceToken'], 'String');
          }
        }
        return obj;
      }
    
      /**
       * New device name (optional)
       * @member {String} name
       */
      exports.prototype['name'] = undefined;
      /**
       * Token used for pushing matches. The token needs to be prefixed with `apns://` or `fcm://` dependent on the device or channel the match should be pushed with
       * @member {String} deviceToken
       */
      exports.prototype['deviceToken'] = undefined;
    
    
    
      return exports;
    }));
    
    
    
    },{"../ApiClient":1}],12:[function(require,module,exports){
    /**
     * MATCHMORE ALPS Core REST API
     * ## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location 
     *
     * OpenAPI spec version: 0.5.0
     * Contact: support@matchmore.com
     *
     * NOTE: This class is auto generated by the swagger code generator program.
     * https://github.com/swagger-api/swagger-codegen.git
     *
     * Swagger Codegen version: 2.3.1
     *
     * Do not edit the class manually.
     *
     */
    
    (function(root, factory) {
      if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ApiClient', 'model/Device'], factory);
      } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        module.exports = factory(require('../ApiClient'), require('./Device'));
      } else {
        // Browser globals (root is window)
        if (!root.MatchmoreAlpsCoreRestApi) {
          root.MatchmoreAlpsCoreRestApi = {};
        }
        root.MatchmoreAlpsCoreRestApi.Devices = factory(root.MatchmoreAlpsCoreRestApi.ApiClient, root.MatchmoreAlpsCoreRestApi.Device);
      }
    }(this, function(ApiClient, Device) {
      'use strict';
    
    
    
    
      /**
       * The Devices model module.
       * @module model/Devices
       * @version 0.5.0
       */
    
      /**
       * Constructs a new <code>Devices</code>.
       * @alias module:model/Devices
       * @class
       * @extends Array
       */
      var exports = function() {
        var _this = this;
        _this = new Array();
        Object.setPrototypeOf(_this, exports);
    
        return _this;
      };
    
      /**
       * Constructs a <code>Devices</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/Devices} obj Optional instance to populate.
       * @return {module:model/Devices} The populated <code>Devices</code> instance.
       */
      exports.constructFromObject = function(data, obj) {
        if (data) {
          obj = obj || new exports();
          ApiClient.constructFromObject(data, obj, 'Device');
    
        }
        return obj;
      }
    
    
    
    
      return exports;
    }));
    
    
    
    },{"../ApiClient":1,"./Device":9}],13:[function(require,module,exports){
    /**
     * MATCHMORE ALPS Core REST API
     * ## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location 
     *
     * OpenAPI spec version: 0.5.0
     * Contact: support@matchmore.com
     *
     * NOTE: This class is auto generated by the swagger code generator program.
     * https://github.com/swagger-api/swagger-codegen.git
     *
     * Swagger Codegen version: 2.3.1
     *
     * Do not edit the class manually.
     *
     */
    
    (function(root, factory) {
      if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ApiClient', 'model/Device', 'model/DeviceType'], factory);
      } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        module.exports = factory(require('../ApiClient'), require('./Device'), require('./DeviceType'));
      } else {
        // Browser globals (root is window)
        if (!root.MatchmoreAlpsCoreRestApi) {
          root.MatchmoreAlpsCoreRestApi = {};
        }
        root.MatchmoreAlpsCoreRestApi.IBeaconDevice = factory(root.MatchmoreAlpsCoreRestApi.ApiClient, root.MatchmoreAlpsCoreRestApi.Device, root.MatchmoreAlpsCoreRestApi.DeviceType);
      }
    }(this, function(ApiClient, Device, DeviceType) {
      'use strict';
    
    
    
    
      /**
       * The IBeaconDevice model module.
       * @module model/IBeaconDevice
       * @version 0.5.0
       */
    
      /**
       * Constructs a new <code>IBeaconDevice</code>.
       * An iBeacon device represents an Apple conform iBeacon announcing its presence via Bluetooth advertising packets. 
       * @alias module:model/IBeaconDevice
       * @class
       * @extends module:model/Device
       * @param deviceType {module:model/DeviceType} 
       * @param proximityUUID {String} The UUID of the beacon, the purpose is to distinguish iBeacons in your network, from all other beacons in networks outside your control. 
       * @param major {Number} Major values are intended to identify and distinguish a group. 
       * @param minor {Number} Minor values are intended to identify and distinguish an individual. 
       */
      var exports = function(deviceType, proximityUUID, major, minor) {
        var _this = this;
        Device.call(_this, deviceType);
        _this['proximityUUID'] = proximityUUID;
        _this['major'] = major;
        _this['minor'] = minor;
      };
    
      /**
       * Constructs a <code>IBeaconDevice</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/IBeaconDevice} obj Optional instance to populate.
       * @return {module:model/IBeaconDevice} The populated <code>IBeaconDevice</code> instance.
       */
      exports.constructFromObject = function(data, obj) {
        if (data) {
          obj = obj || new exports();
          Device.constructFromObject(data, obj);
          if (data.hasOwnProperty('proximityUUID')) {
            obj['proximityUUID'] = ApiClient.convertToType(data['proximityUUID'], 'String');
          }
          if (data.hasOwnProperty('major')) {
            obj['major'] = ApiClient.convertToType(data['major'], 'Number');
          }
          if (data.hasOwnProperty('minor')) {
            obj['minor'] = ApiClient.convertToType(data['minor'], 'Number');
          }
        }
        return obj;
      }
    
      exports.prototype = Object.create(Device.prototype);
      exports.prototype.constructor = exports;
    
      /**
       * The UUID of the beacon, the purpose is to distinguish iBeacons in your network, from all other beacons in networks outside your control. 
       * @member {String} proximityUUID
       */
      exports.prototype['proximityUUID'] = undefined;
      /**
       * Major values are intended to identify and distinguish a group. 
       * @member {Number} major
       */
      exports.prototype['major'] = undefined;
      /**
       * Minor values are intended to identify and distinguish an individual. 
       * @member {Number} minor
       */
      exports.prototype['minor'] = undefined;
    
    
    
      return exports;
    }));
    
    
    
    },{"../ApiClient":1,"./Device":9,"./DeviceType":10}],14:[function(require,module,exports){
    /**
     * MATCHMORE ALPS Core REST API
     * ## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location 
     *
     * OpenAPI spec version: 0.5.0
     * Contact: support@matchmore.com
     *
     * NOTE: This class is auto generated by the swagger code generator program.
     * https://github.com/swagger-api/swagger-codegen.git
     *
     * Swagger Codegen version: 2.3.1
     *
     * Do not edit the class manually.
     *
     */
    
    (function(root, factory) {
      if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ApiClient'], factory);
      } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        module.exports = factory(require('../ApiClient'));
      } else {
        // Browser globals (root is window)
        if (!root.MatchmoreAlpsCoreRestApi) {
          root.MatchmoreAlpsCoreRestApi = {};
        }
        root.MatchmoreAlpsCoreRestApi.IBeaconTriple = factory(root.MatchmoreAlpsCoreRestApi.ApiClient);
      }
    }(this, function(ApiClient) {
      'use strict';
    
    
    
    
      /**
       * The IBeaconTriple model module.
       * @module model/IBeaconTriple
       * @version 0.5.0
       */
    
      /**
       * Constructs a new <code>IBeaconTriple</code>.
       * @alias module:model/IBeaconTriple
       * @class
       */
      var exports = function() {
        var _this = this;
    
    
    
    
    
      };
    
      /**
       * Constructs a <code>IBeaconTriple</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/IBeaconTriple} obj Optional instance to populate.
       * @return {module:model/IBeaconTriple} The populated <code>IBeaconTriple</code> instance.
       */
      exports.constructFromObject = function(data, obj) {
        if (data) {
          obj = obj || new exports();
    
          if (data.hasOwnProperty('deviceId')) {
            obj['deviceId'] = ApiClient.convertToType(data['deviceId'], 'String');
          }
          if (data.hasOwnProperty('proximityUUID')) {
            obj['proximityUUID'] = ApiClient.convertToType(data['proximityUUID'], 'String');
          }
          if (data.hasOwnProperty('major')) {
            obj['major'] = ApiClient.convertToType(data['major'], 'Number');
          }
          if (data.hasOwnProperty('minor')) {
            obj['minor'] = ApiClient.convertToType(data['minor'], 'Number');
          }
        }
        return obj;
      }
    
      /**
       * The deviceId of the beacon. 
       * @member {String} deviceId
       */
      exports.prototype['deviceId'] = undefined;
      /**
       * The UUID of the beacon, the purpose is to distinguish iBeacons in your network, from all other beacons in networks outside your control. 
       * @member {String} proximityUUID
       */
      exports.prototype['proximityUUID'] = undefined;
      /**
       * Major values are intended to identify and distinguish a group. 
       * @member {Number} major
       */
      exports.prototype['major'] = undefined;
      /**
       * Minor values are intended to identify and distinguish an individual. 
       * @member {Number} minor
       */
      exports.prototype['minor'] = undefined;
    
    
    
      return exports;
    }));
    
    
    
    },{"../ApiClient":1}],15:[function(require,module,exports){
    /**
     * MATCHMORE ALPS Core REST API
     * ## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location 
     *
     * OpenAPI spec version: 0.5.0
     * Contact: support@matchmore.com
     *
     * NOTE: This class is auto generated by the swagger code generator program.
     * https://github.com/swagger-api/swagger-codegen.git
     *
     * Swagger Codegen version: 2.3.1
     *
     * Do not edit the class manually.
     *
     */
    
    (function(root, factory) {
      if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ApiClient', 'model/IBeaconTriple'], factory);
      } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        module.exports = factory(require('../ApiClient'), require('./IBeaconTriple'));
      } else {
        // Browser globals (root is window)
        if (!root.MatchmoreAlpsCoreRestApi) {
          root.MatchmoreAlpsCoreRestApi = {};
        }
        root.MatchmoreAlpsCoreRestApi.IBeaconTriples = factory(root.MatchmoreAlpsCoreRestApi.ApiClient, root.MatchmoreAlpsCoreRestApi.IBeaconTriple);
      }
    }(this, function(ApiClient, IBeaconTriple) {
      'use strict';
    
    
    
    
      /**
       * The IBeaconTriples model module.
       * @module model/IBeaconTriples
       * @version 0.5.0
       */
    
      /**
       * Constructs a new <code>IBeaconTriples</code>.
       * @alias module:model/IBeaconTriples
       * @class
       * @extends Array
       */
      var exports = function() {
        var _this = this;
        _this = new Array();
        Object.setPrototypeOf(_this, exports);
    
        return _this;
      };
    
      /**
       * Constructs a <code>IBeaconTriples</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/IBeaconTriples} obj Optional instance to populate.
       * @return {module:model/IBeaconTriples} The populated <code>IBeaconTriples</code> instance.
       */
      exports.constructFromObject = function(data, obj) {
        if (data) {
          obj = obj || new exports();
          ApiClient.constructFromObject(data, obj, 'IBeaconTriple');
    
        }
        return obj;
      }
    
    
    
    
      return exports;
    }));
    
    
    
    },{"../ApiClient":1,"./IBeaconTriple":14}],16:[function(require,module,exports){
    /**
     * MATCHMORE ALPS Core REST API
     * ## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location 
     *
     * OpenAPI spec version: 0.5.0
     * Contact: support@matchmore.com
     *
     * NOTE: This class is auto generated by the swagger code generator program.
     * https://github.com/swagger-api/swagger-codegen.git
     *
     * Swagger Codegen version: 2.3.1
     *
     * Do not edit the class manually.
     *
     */
    
    (function(root, factory) {
      if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ApiClient'], factory);
      } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        module.exports = factory(require('../ApiClient'));
      } else {
        // Browser globals (root is window)
        if (!root.MatchmoreAlpsCoreRestApi) {
          root.MatchmoreAlpsCoreRestApi = {};
        }
        root.MatchmoreAlpsCoreRestApi.Location = factory(root.MatchmoreAlpsCoreRestApi.ApiClient);
      }
    }(this, function(ApiClient) {
      'use strict';
    
    
    
    
      /**
       * The Location model module.
       * @module model/Location
       * @version 0.5.0
       */
    
      /**
       * Constructs a new <code>Location</code>.
       * @alias module:model/Location
       * @class
       * @param latitude {Number} The latitude of the device in degrees, for instance '46.5333' (Lausanne, Switzerland). 
       * @param longitude {Number} The longitude of the device in degrees, for instance '6.6667' (Lausanne, Switzerland). 
       * @param altitude {Number} The altitude of the device in meters, for instance '495.0' (Lausanne, Switzerland). 
       */
      var exports = function(latitude, longitude, altitude) {
        var _this = this;
    
    
        _this['latitude'] = latitude;
        _this['longitude'] = longitude;
        _this['altitude'] = altitude;
    
    
      };
    
      /**
       * Constructs a <code>Location</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/Location} obj Optional instance to populate.
       * @return {module:model/Location} The populated <code>Location</code> instance.
       */
      exports.constructFromObject = function(data, obj) {
        if (data) {
          obj = obj || new exports();
    
          if (data.hasOwnProperty('createdAt')) {
            obj['createdAt'] = ApiClient.convertToType(data['createdAt'], 'Number');
          }
          if (data.hasOwnProperty('latitude')) {
            obj['latitude'] = ApiClient.convertToType(data['latitude'], 'Number');
          }
          if (data.hasOwnProperty('longitude')) {
            obj['longitude'] = ApiClient.convertToType(data['longitude'], 'Number');
          }
          if (data.hasOwnProperty('altitude')) {
            obj['altitude'] = ApiClient.convertToType(data['altitude'], 'Number');
          }
          if (data.hasOwnProperty('horizontalAccuracy')) {
            obj['horizontalAccuracy'] = ApiClient.convertToType(data['horizontalAccuracy'], 'Number');
          }
          if (data.hasOwnProperty('verticalAccuracy')) {
            obj['verticalAccuracy'] = ApiClient.convertToType(data['verticalAccuracy'], 'Number');
          }
        }
        return obj;
      }
    
      /**
       * The timestamp of the location creation in seconds since Jan 01 1970 (UTC). 
       * @member {Number} createdAt
       */
      exports.prototype['createdAt'] = undefined;
      /**
       * The latitude of the device in degrees, for instance '46.5333' (Lausanne, Switzerland). 
       * @member {Number} latitude
       * @default 0.0
       */
      exports.prototype['latitude'] = 0.0;
      /**
       * The longitude of the device in degrees, for instance '6.6667' (Lausanne, Switzerland). 
       * @member {Number} longitude
       * @default 0.0
       */
      exports.prototype['longitude'] = 0.0;
      /**
       * The altitude of the device in meters, for instance '495.0' (Lausanne, Switzerland). 
       * @member {Number} altitude
       * @default 0.0
       */
      exports.prototype['altitude'] = 0.0;
      /**
       * The horizontal accuracy of the location, measured on a scale from '0.0' to '1.0', '1.0' being the most accurate. If this value is not specified then the default value of '1.0' is used. 
       * @member {Number} horizontalAccuracy
       * @default 1.0
       */
      exports.prototype['horizontalAccuracy'] = 1.0;
      /**
       * The vertical accuracy of the location, measured on a scale from '0.0' to '1.0', '1.0' being the most accurate. If this value is not specified then the default value of '1.0' is used. 
       * @member {Number} verticalAccuracy
       * @default 1.0
       */
      exports.prototype['verticalAccuracy'] = 1.0;
    
    
    
      return exports;
    }));
    
    
    
    },{"../ApiClient":1}],17:[function(require,module,exports){
    /**
     * MATCHMORE ALPS Core REST API
     * ## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location 
     *
     * OpenAPI spec version: 0.5.0
     * Contact: support@matchmore.com
     *
     * NOTE: This class is auto generated by the swagger code generator program.
     * https://github.com/swagger-api/swagger-codegen.git
     *
     * Swagger Codegen version: 2.3.1
     *
     * Do not edit the class manually.
     *
     */
    
    (function(root, factory) {
      if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ApiClient', 'model/Publication', 'model/Subscription'], factory);
      } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        module.exports = factory(require('../ApiClient'), require('./Publication'), require('./Subscription'));
      } else {
        // Browser globals (root is window)
        if (!root.MatchmoreAlpsCoreRestApi) {
          root.MatchmoreAlpsCoreRestApi = {};
        }
        root.MatchmoreAlpsCoreRestApi.Match = factory(root.MatchmoreAlpsCoreRestApi.ApiClient, root.MatchmoreAlpsCoreRestApi.Publication, root.MatchmoreAlpsCoreRestApi.Subscription);
      }
    }(this, function(ApiClient, Publication, Subscription) {
      'use strict';
    
    
    
    
      /**
       * The Match model module.
       * @module model/Match
       * @version 0.5.0
       */
    
      /**
       * Constructs a new <code>Match</code>.
       * An object representing a match between a subscription and a publication.
       * @alias module:model/Match
       * @class
       * @param publication {module:model/Publication} 
       * @param subscription {module:model/Subscription} 
       */
      var exports = function(publication, subscription) {
        var _this = this;
    
    
    
        _this['publication'] = publication;
        _this['subscription'] = subscription;
      };
    
      /**
       * Constructs a <code>Match</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/Match} obj Optional instance to populate.
       * @return {module:model/Match} The populated <code>Match</code> instance.
       */
      exports.constructFromObject = function(data, obj) {
        if (data) {
          obj = obj || new exports();
    
          if (data.hasOwnProperty('id')) {
            obj['id'] = ApiClient.convertToType(data['id'], 'String');
          }
          if (data.hasOwnProperty('createdAt')) {
            obj['createdAt'] = ApiClient.convertToType(data['createdAt'], 'Number');
          }
          if (data.hasOwnProperty('publication')) {
            obj['publication'] = Publication.constructFromObject(data['publication']);
          }
          if (data.hasOwnProperty('subscription')) {
            obj['subscription'] = Subscription.constructFromObject(data['subscription']);
          }
        }
        return obj;
      }
    
      /**
       * The id (UUID) of the match.
       * @member {String} id
       */
      exports.prototype['id'] = undefined;
      /**
       * The timestamp of the match in seconds since Jan 01 1970 (UTC).
       * @member {Number} createdAt
       */
      exports.prototype['createdAt'] = undefined;
      /**
       * @member {module:model/Publication} publication
       */
      exports.prototype['publication'] = undefined;
      /**
       * @member {module:model/Subscription} subscription
       */
      exports.prototype['subscription'] = undefined;
    
    
    
      return exports;
    }));
    
    
    
    },{"../ApiClient":1,"./Publication":22,"./Subscription":24}],18:[function(require,module,exports){
    /**
     * MATCHMORE ALPS Core REST API
     * ## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location 
     *
     * OpenAPI spec version: 0.5.0
     * Contact: support@matchmore.com
     *
     * NOTE: This class is auto generated by the swagger code generator program.
     * https://github.com/swagger-api/swagger-codegen.git
     *
     * Swagger Codegen version: 2.3.1
     *
     * Do not edit the class manually.
     *
     */
    
    (function(root, factory) {
      if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ApiClient', 'model/Match'], factory);
      } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        module.exports = factory(require('../ApiClient'), require('./Match'));
      } else {
        // Browser globals (root is window)
        if (!root.MatchmoreAlpsCoreRestApi) {
          root.MatchmoreAlpsCoreRestApi = {};
        }
        root.MatchmoreAlpsCoreRestApi.Matches = factory(root.MatchmoreAlpsCoreRestApi.ApiClient, root.MatchmoreAlpsCoreRestApi.Match);
      }
    }(this, function(ApiClient, Match) {
      'use strict';
    
    
    
    
      /**
       * The Matches model module.
       * @module model/Matches
       * @version 0.5.0
       */
    
      /**
       * Constructs a new <code>Matches</code>.
       * @alias module:model/Matches
       * @class
       * @extends Array
       */
      var exports = function() {
        var _this = this;
        _this = new Array();
        Object.setPrototypeOf(_this, exports);
    
        return _this;
      };
    
      /**
       * Constructs a <code>Matches</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/Matches} obj Optional instance to populate.
       * @return {module:model/Matches} The populated <code>Matches</code> instance.
       */
      exports.constructFromObject = function(data, obj) {
        if (data) {
          obj = obj || new exports();
          ApiClient.constructFromObject(data, obj, 'Match');
    
        }
        return obj;
      }
    
    
    
    
      return exports;
    }));
    
    
    
    },{"../ApiClient":1,"./Match":17}],19:[function(require,module,exports){
    /**
     * MATCHMORE ALPS Core REST API
     * ## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location 
     *
     * OpenAPI spec version: 0.5.0
     * Contact: support@matchmore.com
     *
     * NOTE: This class is auto generated by the swagger code generator program.
     * https://github.com/swagger-api/swagger-codegen.git
     *
     * Swagger Codegen version: 2.3.1
     *
     * Do not edit the class manually.
     *
     */
    
    (function(root, factory) {
      if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ApiClient', 'model/Device', 'model/DeviceType', 'model/Location'], factory);
      } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        module.exports = factory(require('../ApiClient'), require('./Device'), require('./DeviceType'), require('./Location'));
      } else {
        // Browser globals (root is window)
        if (!root.MatchmoreAlpsCoreRestApi) {
          root.MatchmoreAlpsCoreRestApi = {};
        }
        root.MatchmoreAlpsCoreRestApi.MobileDevice = factory(root.MatchmoreAlpsCoreRestApi.ApiClient, root.MatchmoreAlpsCoreRestApi.Device, root.MatchmoreAlpsCoreRestApi.DeviceType, root.MatchmoreAlpsCoreRestApi.Location);
      }
    }(this, function(ApiClient, Device, DeviceType, Location) {
      'use strict';
    
    
    
    
      /**
       * The MobileDevice model module.
       * @module model/MobileDevice
       * @version 0.5.0
       */
    
      /**
       * Constructs a new <code>MobileDevice</code>.
       * A mobile device is one that potentially moves together with its user and therefore has a geographical location associated with it. 
       * @alias module:model/MobileDevice
       * @class
       * @extends module:model/Device
       * @param deviceType {module:model/DeviceType} 
       * @param platform {String} The platform of the device, this can be any string representing the platform type, for instance 'iOS'. 
       * @param deviceToken {String} The deviceToken is the device push notification token given to this device by the OS, either iOS or Android for identifying the device with push notification services. 
       * @param location {module:model/Location} 
       */
      var exports = function(deviceType, platform, deviceToken, location) {
        var _this = this;
        Device.call(_this, deviceType);
        _this['platform'] = platform;
        _this['deviceToken'] = deviceToken;
        _this['location'] = location;
      };
    
      /**
       * Constructs a <code>MobileDevice</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/MobileDevice} obj Optional instance to populate.
       * @return {module:model/MobileDevice} The populated <code>MobileDevice</code> instance.
       */
      exports.constructFromObject = function(data, obj) {
        if (data) {
          obj = obj || new exports();
          Device.constructFromObject(data, obj);
          if (data.hasOwnProperty('platform')) {
            obj['platform'] = ApiClient.convertToType(data['platform'], 'String');
          }
          if (data.hasOwnProperty('deviceToken')) {
            obj['deviceToken'] = ApiClient.convertToType(data['deviceToken'], 'String');
          }
          if (data.hasOwnProperty('location')) {
            obj['location'] = Location.constructFromObject(data['location']);
          }
        }
        return obj;
      }
    
      exports.prototype = Object.create(Device.prototype);
      exports.prototype.constructor = exports;
    
      /**
       * The platform of the device, this can be any string representing the platform type, for instance 'iOS'. 
       * @member {String} platform
       */
      exports.prototype['platform'] = undefined;
      /**
       * The deviceToken is the device push notification token given to this device by the OS, either iOS or Android for identifying the device with push notification services. 
       * @member {String} deviceToken
       */
      exports.prototype['deviceToken'] = undefined;
      /**
       * @member {module:model/Location} location
       */
      exports.prototype['location'] = undefined;
    
    
    
      return exports;
    }));
    
    
    
    },{"../ApiClient":1,"./Device":9,"./DeviceType":10,"./Location":16}],20:[function(require,module,exports){
    /**
     * MATCHMORE ALPS Core REST API
     * ## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location 
     *
     * OpenAPI spec version: 0.5.0
     * Contact: support@matchmore.com
     *
     * NOTE: This class is auto generated by the swagger code generator program.
     * https://github.com/swagger-api/swagger-codegen.git
     *
     * Swagger Codegen version: 2.3.1
     *
     * Do not edit the class manually.
     *
     */
    
    (function(root, factory) {
      if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ApiClient', 'model/Device', 'model/DeviceType', 'model/Location'], factory);
      } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        module.exports = factory(require('../ApiClient'), require('./Device'), require('./DeviceType'), require('./Location'));
      } else {
        // Browser globals (root is window)
        if (!root.MatchmoreAlpsCoreRestApi) {
          root.MatchmoreAlpsCoreRestApi = {};
        }
        root.MatchmoreAlpsCoreRestApi.PinDevice = factory(root.MatchmoreAlpsCoreRestApi.ApiClient, root.MatchmoreAlpsCoreRestApi.Device, root.MatchmoreAlpsCoreRestApi.DeviceType, root.MatchmoreAlpsCoreRestApi.Location);
      }
    }(this, function(ApiClient, Device, DeviceType, Location) {
      'use strict';
    
    
    
    
      /**
       * The PinDevice model module.
       * @module model/PinDevice
       * @version 0.5.0
       */
    
      /**
       * Constructs a new <code>PinDevice</code>.
       * A pin device is one that has geographical location associated with it but is not represented by any object in the physical world. 
       * @alias module:model/PinDevice
       * @class
       * @extends module:model/Device
       * @param deviceType {module:model/DeviceType} 
       * @param location {module:model/Location} 
       */
      var exports = function(deviceType, location) {
        var _this = this;
        Device.call(_this, deviceType);
        _this['location'] = location;
      };
    
      /**
       * Constructs a <code>PinDevice</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/PinDevice} obj Optional instance to populate.
       * @return {module:model/PinDevice} The populated <code>PinDevice</code> instance.
       */
      exports.constructFromObject = function(data, obj) {
        if (data) {
          obj = obj || new exports();
          Device.constructFromObject(data, obj);
          if (data.hasOwnProperty('location')) {
            obj['location'] = Location.constructFromObject(data['location']);
          }
        }
        return obj;
      }
    
      exports.prototype = Object.create(Device.prototype);
      exports.prototype.constructor = exports;
    
      /**
       * @member {module:model/Location} location
       */
      exports.prototype['location'] = undefined;
    
    
    
      return exports;
    }));
    
    
    
    },{"../ApiClient":1,"./Device":9,"./DeviceType":10,"./Location":16}],21:[function(require,module,exports){
    /**
     * MATCHMORE ALPS Core REST API
     * ## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location 
     *
     * OpenAPI spec version: 0.5.0
     * Contact: support@matchmore.com
     *
     * NOTE: This class is auto generated by the swagger code generator program.
     * https://github.com/swagger-api/swagger-codegen.git
     *
     * Swagger Codegen version: 2.3.1
     *
     * Do not edit the class manually.
     *
     */
    
    (function(root, factory) {
      if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ApiClient'], factory);
      } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        module.exports = factory(require('../ApiClient'));
      } else {
        // Browser globals (root is window)
        if (!root.MatchmoreAlpsCoreRestApi) {
          root.MatchmoreAlpsCoreRestApi = {};
        }
        root.MatchmoreAlpsCoreRestApi.ProximityEvent = factory(root.MatchmoreAlpsCoreRestApi.ApiClient);
      }
    }(this, function(ApiClient) {
      'use strict';
    
    
    
    
      /**
       * The ProximityEvent model module.
       * @module model/ProximityEvent
       * @version 0.5.0
       */
    
      /**
       * Constructs a new <code>ProximityEvent</code>.
       * A proximity event is triggered to the core when a mobile device detects an iBeacon device in his Bluetooth Low Energy(BLE) range. 
       * @alias module:model/ProximityEvent
       * @class
       * @param deviceId {String} The id (UUID) of the iBeacon to trigger a proximity event to.
       * @param distance {Number} Distance between the mobile device that trigger the proximity event and the ranged iBeacon. This distance is automatically generated by the SDK based upon the CLProximity. 
       */
      var exports = function(deviceId, distance) {
        var _this = this;
    
    
    
        _this['deviceId'] = deviceId;
        _this['distance'] = distance;
      };
    
      /**
       * Constructs a <code>ProximityEvent</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/ProximityEvent} obj Optional instance to populate.
       * @return {module:model/ProximityEvent} The populated <code>ProximityEvent</code> instance.
       */
      exports.constructFromObject = function(data, obj) {
        if (data) {
          obj = obj || new exports();
    
          if (data.hasOwnProperty('id')) {
            obj['id'] = ApiClient.convertToType(data['id'], 'String');
          }
          if (data.hasOwnProperty('createdAt')) {
            obj['createdAt'] = ApiClient.convertToType(data['createdAt'], 'Number');
          }
          if (data.hasOwnProperty('deviceId')) {
            obj['deviceId'] = ApiClient.convertToType(data['deviceId'], 'String');
          }
          if (data.hasOwnProperty('distance')) {
            obj['distance'] = ApiClient.convertToType(data['distance'], 'Number');
          }
        }
        return obj;
      }
    
      /**
       * The id (UUID) of the proximity event.
       * @member {String} id
       */
      exports.prototype['id'] = undefined;
      /**
       * The timestamp of the proximity event in seconds since Jan 01 1970 (UTC). 
       * @member {Number} createdAt
       */
      exports.prototype['createdAt'] = undefined;
      /**
       * The id (UUID) of the iBeacon to trigger a proximity event to.
       * @member {String} deviceId
       */
      exports.prototype['deviceId'] = undefined;
      /**
       * Distance between the mobile device that trigger the proximity event and the ranged iBeacon. This distance is automatically generated by the SDK based upon the CLProximity. 
       * @member {Number} distance
       */
      exports.prototype['distance'] = undefined;
    
    
    
      return exports;
    }));
    
    
    
    },{"../ApiClient":1}],22:[function(require,module,exports){
    /**
     * MATCHMORE ALPS Core REST API
     * ## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location 
     *
     * OpenAPI spec version: 0.5.0
     * Contact: support@matchmore.com
     *
     * NOTE: This class is auto generated by the swagger code generator program.
     * https://github.com/swagger-api/swagger-codegen.git
     *
     * Swagger Codegen version: 2.3.1
     *
     * Do not edit the class manually.
     *
     */
    
    (function(root, factory) {
      if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ApiClient'], factory);
      } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        module.exports = factory(require('../ApiClient'));
      } else {
        // Browser globals (root is window)
        if (!root.MatchmoreAlpsCoreRestApi) {
          root.MatchmoreAlpsCoreRestApi = {};
        }
        root.MatchmoreAlpsCoreRestApi.Publication = factory(root.MatchmoreAlpsCoreRestApi.ApiClient);
      }
    }(this, function(ApiClient) {
      'use strict';
    
    
    
    
      /**
       * The Publication model module.
       * @module model/Publication
       * @version 0.5.0
       */
    
      /**
       * Constructs a new <code>Publication</code>.
       * A publication can be seen as a JavaMessagingService (JMS) publication extended with the notion of a geographical zone. The zone is defined as circle with a center at the given location and a range around that location. 
       * @alias module:model/Publication
       * @class
       * @param worldId {String} The id (UUID) of the world that contains device to attach a publication to.
       * @param deviceId {String} The id (UUID) of the device to attach a publication to.
       * @param topic {String} The topic of the publication. This will act as a first match filter. For a subscription to be able to match a publication they must have the exact same topic. 
       * @param range {Number} The range of the publication in meters. This is the range around the device holding the publication in which matches with subscriptions can be triggered. 
       * @param duration {Number} The duration of the publication in seconds. If set to '0' it will be instant at the time of publication. Negative values are not allowed. 
       * @param properties {Object} The dictionary of key, value pairs. Allowed values are number, boolean, string and array of afformentioned types
       */
      var exports = function(worldId, deviceId, topic, range, duration, properties) {
        var _this = this;
    
    
    
        _this['worldId'] = worldId;
        _this['deviceId'] = deviceId;
        _this['topic'] = topic;
        _this['range'] = range;
        _this['duration'] = duration;
        _this['properties'] = properties;
      };
    
      /**
       * Constructs a <code>Publication</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/Publication} obj Optional instance to populate.
       * @return {module:model/Publication} The populated <code>Publication</code> instance.
       */
      exports.constructFromObject = function(data, obj) {
        if (data) {
          obj = obj || new exports();
    
          if (data.hasOwnProperty('id')) {
            obj['id'] = ApiClient.convertToType(data['id'], 'String');
          }
          if (data.hasOwnProperty('createdAt')) {
            obj['createdAt'] = ApiClient.convertToType(data['createdAt'], 'Number');
          }
          if (data.hasOwnProperty('worldId')) {
            obj['worldId'] = ApiClient.convertToType(data['worldId'], 'String');
          }
          if (data.hasOwnProperty('deviceId')) {
            obj['deviceId'] = ApiClient.convertToType(data['deviceId'], 'String');
          }
          if (data.hasOwnProperty('topic')) {
            obj['topic'] = ApiClient.convertToType(data['topic'], 'String');
          }
          if (data.hasOwnProperty('range')) {
            obj['range'] = ApiClient.convertToType(data['range'], 'Number');
          }
          if (data.hasOwnProperty('duration')) {
            obj['duration'] = ApiClient.convertToType(data['duration'], 'Number');
          }
          if (data.hasOwnProperty('properties')) {
            obj['properties'] = ApiClient.convertToType(data['properties'], Object);
          }
        }
        return obj;
      }
    
      /**
       * The id (UUID) of the publication.
       * @member {String} id
       */
      exports.prototype['id'] = undefined;
      /**
       * The timestamp of the publication creation in seconds since Jan 01 1970 (UTC). 
       * @member {Number} createdAt
       */
      exports.prototype['createdAt'] = undefined;
      /**
       * The id (UUID) of the world that contains device to attach a publication to.
       * @member {String} worldId
       */
      exports.prototype['worldId'] = undefined;
      /**
       * The id (UUID) of the device to attach a publication to.
       * @member {String} deviceId
       */
      exports.prototype['deviceId'] = undefined;
      /**
       * The topic of the publication. This will act as a first match filter. For a subscription to be able to match a publication they must have the exact same topic. 
       * @member {String} topic
       */
      exports.prototype['topic'] = undefined;
      /**
       * The range of the publication in meters. This is the range around the device holding the publication in which matches with subscriptions can be triggered. 
       * @member {Number} range
       */
      exports.prototype['range'] = undefined;
      /**
       * The duration of the publication in seconds. If set to '0' it will be instant at the time of publication. Negative values are not allowed. 
       * @member {Number} duration
       */
      exports.prototype['duration'] = undefined;
      /**
       * The dictionary of key, value pairs. Allowed values are number, boolean, string and array of afformentioned types
       * @member {Object} properties
       */
      exports.prototype['properties'] = undefined;
    
    
    
      return exports;
    }));
    
    
    
    },{"../ApiClient":1}],23:[function(require,module,exports){
    /**
     * MATCHMORE ALPS Core REST API
     * ## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location 
     *
     * OpenAPI spec version: 0.5.0
     * Contact: support@matchmore.com
     *
     * NOTE: This class is auto generated by the swagger code generator program.
     * https://github.com/swagger-api/swagger-codegen.git
     *
     * Swagger Codegen version: 2.3.1
     *
     * Do not edit the class manually.
     *
     */
    
    (function(root, factory) {
      if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ApiClient', 'model/Publication'], factory);
      } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        module.exports = factory(require('../ApiClient'), require('./Publication'));
      } else {
        // Browser globals (root is window)
        if (!root.MatchmoreAlpsCoreRestApi) {
          root.MatchmoreAlpsCoreRestApi = {};
        }
        root.MatchmoreAlpsCoreRestApi.Publications = factory(root.MatchmoreAlpsCoreRestApi.ApiClient, root.MatchmoreAlpsCoreRestApi.Publication);
      }
    }(this, function(ApiClient, Publication) {
      'use strict';
    
    
    
    
      /**
       * The Publications model module.
       * @module model/Publications
       * @version 0.5.0
       */
    
      /**
       * Constructs a new <code>Publications</code>.
       * @alias module:model/Publications
       * @class
       * @extends Array
       */
      var exports = function() {
        var _this = this;
        _this = new Array();
        Object.setPrototypeOf(_this, exports);
    
        return _this;
      };
    
      /**
       * Constructs a <code>Publications</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/Publications} obj Optional instance to populate.
       * @return {module:model/Publications} The populated <code>Publications</code> instance.
       */
      exports.constructFromObject = function(data, obj) {
        if (data) {
          obj = obj || new exports();
          ApiClient.constructFromObject(data, obj, 'Publication');
    
        }
        return obj;
      }
    
    
    
    
      return exports;
    }));
    
    
    
    },{"../ApiClient":1,"./Publication":22}],24:[function(require,module,exports){
    /**
     * MATCHMORE ALPS Core REST API
     * ## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location 
     *
     * OpenAPI spec version: 0.5.0
     * Contact: support@matchmore.com
     *
     * NOTE: This class is auto generated by the swagger code generator program.
     * https://github.com/swagger-api/swagger-codegen.git
     *
     * Swagger Codegen version: 2.3.1
     *
     * Do not edit the class manually.
     *
     */
    
    (function(root, factory) {
      if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ApiClient'], factory);
      } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        module.exports = factory(require('../ApiClient'));
      } else {
        // Browser globals (root is window)
        if (!root.MatchmoreAlpsCoreRestApi) {
          root.MatchmoreAlpsCoreRestApi = {};
        }
        root.MatchmoreAlpsCoreRestApi.Subscription = factory(root.MatchmoreAlpsCoreRestApi.ApiClient);
      }
    }(this, function(ApiClient) {
      'use strict';
    
    
    
    
      /**
       * The Subscription model module.
       * @module model/Subscription
       * @version 0.5.0
       */
    
      /**
       * Constructs a new <code>Subscription</code>.
       * A subscription can be seen as a JMS subscription extended with the notion of geographical zone. The zone again being defined as circle with a center at the given location and a range around that location. 
       * @alias module:model/Subscription
       * @class
       * @param worldId {String} The id (UUID) of the world that contains device to attach a subscription to.
       * @param deviceId {String} The id (UUID) of the device to attach a subscription to.
       * @param topic {String} The topic of the subscription. This will act as a first match filter. For a subscription to be able to match a publication they must have the exact same topic. 
       * @param selector {String} This is an expression to filter the publications. For instance 'job='developer'' will allow matching only with publications containing a 'job' key with a value of 'developer'. 
       * @param range {Number} The range of the subscription in meters. This is the range around the device holding the subscription in which matches with publications can be triggered. 
       * @param duration {Number} The duration of the subscription in seconds. If set to '0' it will be instant at the time of subscription. Negative values are not allowed. 
       */
      var exports = function(worldId, deviceId, topic, selector, range, duration) {
        var _this = this;
    
    
    
        _this['worldId'] = worldId;
        _this['deviceId'] = deviceId;
        _this['topic'] = topic;
        _this['selector'] = selector;
        _this['range'] = range;
        _this['duration'] = duration;
    
    
      };
    
      /**
       * Constructs a <code>Subscription</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/Subscription} obj Optional instance to populate.
       * @return {module:model/Subscription} The populated <code>Subscription</code> instance.
       */
      exports.constructFromObject = function(data, obj) {
        if (data) {
          obj = obj || new exports();
    
          if (data.hasOwnProperty('id')) {
            obj['id'] = ApiClient.convertToType(data['id'], 'String');
          }
          if (data.hasOwnProperty('createdAt')) {
            obj['createdAt'] = ApiClient.convertToType(data['createdAt'], 'Number');
          }
          if (data.hasOwnProperty('worldId')) {
            obj['worldId'] = ApiClient.convertToType(data['worldId'], 'String');
          }
          if (data.hasOwnProperty('deviceId')) {
            obj['deviceId'] = ApiClient.convertToType(data['deviceId'], 'String');
          }
          if (data.hasOwnProperty('topic')) {
            obj['topic'] = ApiClient.convertToType(data['topic'], 'String');
          }
          if (data.hasOwnProperty('selector')) {
            obj['selector'] = ApiClient.convertToType(data['selector'], 'String');
          }
          if (data.hasOwnProperty('range')) {
            obj['range'] = ApiClient.convertToType(data['range'], 'Number');
          }
          if (data.hasOwnProperty('duration')) {
            obj['duration'] = ApiClient.convertToType(data['duration'], 'Number');
          }
          if (data.hasOwnProperty('matchTTL')) {
            obj['matchTTL'] = ApiClient.convertToType(data['matchTTL'], 'Number');
          }
          if (data.hasOwnProperty('pushers')) {
            obj['pushers'] = ApiClient.convertToType(data['pushers'], ['String']);
          }
        }
        return obj;
      }
    
      /**
       * The id (UUID) of the subscription.
       * @member {String} id
       */
      exports.prototype['id'] = undefined;
      /**
       * The timestamp of the subscription creation in seconds since Jan 01 1970 (UTC). 
       * @member {Number} createdAt
       */
      exports.prototype['createdAt'] = undefined;
      /**
       * The id (UUID) of the world that contains device to attach a subscription to.
       * @member {String} worldId
       */
      exports.prototype['worldId'] = undefined;
      /**
       * The id (UUID) of the device to attach a subscription to.
       * @member {String} deviceId
       */
      exports.prototype['deviceId'] = undefined;
      /**
       * The topic of the subscription. This will act as a first match filter. For a subscription to be able to match a publication they must have the exact same topic. 
       * @member {String} topic
       */
      exports.prototype['topic'] = undefined;
      /**
       * This is an expression to filter the publications. For instance 'job='developer'' will allow matching only with publications containing a 'job' key with a value of 'developer'. 
       * @member {String} selector
       */
      exports.prototype['selector'] = undefined;
      /**
       * The range of the subscription in meters. This is the range around the device holding the subscription in which matches with publications can be triggered. 
       * @member {Number} range
       */
      exports.prototype['range'] = undefined;
      /**
       * The duration of the subscription in seconds. If set to '0' it will be instant at the time of subscription. Negative values are not allowed. 
       * @member {Number} duration
       */
      exports.prototype['duration'] = undefined;
      /**
       * The duration of the match in seconds, this describes how often you will get matches when publication and subscription are moving in each other range. If set to '0' you will get matches every time publication or subscription in range will move. Negative values are not allowed. 
       * @member {Number} matchTTL
       */
      exports.prototype['matchTTL'] = undefined;
      /**
       * When match will occurs, they will be notified on these provided URI(s) address(es) in the pushers array. 
       * @member {Array.<String>} pushers
       */
      exports.prototype['pushers'] = undefined;
    
    
    
      return exports;
    }));
    
    
    
    },{"../ApiClient":1}],25:[function(require,module,exports){
    /**
     * MATCHMORE ALPS Core REST API
     * ## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location 
     *
     * OpenAPI spec version: 0.5.0
     * Contact: support@matchmore.com
     *
     * NOTE: This class is auto generated by the swagger code generator program.
     * https://github.com/swagger-api/swagger-codegen.git
     *
     * Swagger Codegen version: 2.3.1
     *
     * Do not edit the class manually.
     *
     */
    
    (function(root, factory) {
      if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ApiClient', 'model/Subscription'], factory);
      } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        module.exports = factory(require('../ApiClient'), require('./Subscription'));
      } else {
        // Browser globals (root is window)
        if (!root.MatchmoreAlpsCoreRestApi) {
          root.MatchmoreAlpsCoreRestApi = {};
        }
        root.MatchmoreAlpsCoreRestApi.Subscriptions = factory(root.MatchmoreAlpsCoreRestApi.ApiClient, root.MatchmoreAlpsCoreRestApi.Subscription);
      }
    }(this, function(ApiClient, Subscription) {
      'use strict';
    
    
    
    
      /**
       * The Subscriptions model module.
       * @module model/Subscriptions
       * @version 0.5.0
       */
    
      /**
       * Constructs a new <code>Subscriptions</code>.
       * @alias module:model/Subscriptions
       * @class
       * @extends Array
       */
      var exports = function() {
        var _this = this;
        _this = new Array();
        Object.setPrototypeOf(_this, exports);
    
        return _this;
      };
    
      /**
       * Constructs a <code>Subscriptions</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/Subscriptions} obj Optional instance to populate.
       * @return {module:model/Subscriptions} The populated <code>Subscriptions</code> instance.
       */
      exports.constructFromObject = function(data, obj) {
        if (data) {
          obj = obj || new exports();
          ApiClient.constructFromObject(data, obj, 'Subscription');
    
        }
        return obj;
      }
    
    
    
    
      return exports;
    }));
    
    
    
    },{"../ApiClient":1,"./Subscription":24}],26:[function(require,module,exports){
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const manager_1 = require("./manager");
    exports.Manager = manager_1.Manager;
    const InMemoryPersistenceManager_1 = require("./persistences/InMemoryPersistenceManager");
    exports.InMemoryPersistenceManager = InMemoryPersistenceManager_1.default;
    const LocalStoragePersistenceManager_1 = require("./persistences/LocalStoragePersistenceManager");
    exports.LocalStoragePersistenceManager = LocalStoragePersistenceManager_1.default;
    const platform_1 = require("./platform");
    exports.PlatformConfig = platform_1.default;
    
    },{"./manager":28,"./persistences/InMemoryPersistenceManager":33,"./persistences/LocalStoragePersistenceManager":34,"./platform":35}],27:[function(require,module,exports){
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LocationManager {
        constructor(manager, config) {
            this.manager = manager;
            this.onLocationReceived = (loc) => {
                loc.coords.horizontalAccuracy = 1.0;
                loc.coords.verticalAccuracy = 1.0;
                if (this._onLocationUpdate) {
                    this._onLocationUpdate(loc);
                }
                const { latitude, longitude, altitude } = loc.coords;
                const coords = {
                    latitude,
                    longitude,
                    altitude: altitude || 0,
                };
                this.manager.updateLocation(coords);
            };
            this._gpsConfig = config || {
                enableHighAccuracy: false,
                timeout: 60000,
                maximumAge: 60000
            };
            this._onLocationUpdate = loc => { };
        }
        startUpdatingLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(this.onLocationReceived, this.onError, this._gpsConfig);
                this._geoId = navigator.geolocation.watchPosition(this.onLocationReceived, this.onError, this._gpsConfig);
            }
            else {
                throw new Error("Geolocation is not supported in this browser/app");
            }
        }
        stopUpdatingLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.clearWatch(this._geoId);
            }
            else {
                throw new Error("Geolocation is not supported in this browser/app");
            }
        }
        set onLocationUpdate(onLocationUpdate) {
            this._onLocationUpdate = onLocationUpdate;
        }
        onError(error) {
            throw new Error(error.message);
            // switch (error.code) {
            //   case error.PERMISSION_DENIED:
            //     throw new Error("User denied the request for Geolocation.");
            //   case error.POSITION_UNAVAILABLE:
            //     throw new Error("Location information is unavailable.");
            //   case error.TIMEOUT:
            //     throw new Error("The request to get user location timed out. " );
            //   case error.UNKNOWN_ERROR:
            //     throw new Error("An unknown error occurred.");
            // }
        }
    }
    exports.LocationManager = LocationManager;
    
    },{}],28:[function(require,module,exports){
    "use strict";
    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    const ScalpsCoreRestApi = require("./api");
    const Base64 = require("Base64");
    const matchmonitor_1 = require("./matchmonitor");
    const locationmanager_1 = require("./locationmanager");
    const models = require("./model/models");
    const index_1 = require("./index");
    class Manager {
        constructor(apiKey, apiUrlOverride, persistenceManager, gpsConfig) {
            this.apiKey = apiKey;
            this.apiUrlOverride = apiUrlOverride;
            if (!apiKey)
                throw new Error("Api key required");
            this._persistenceManager =
                persistenceManager || new index_1.InMemoryPersistenceManager();
            this.defaultClient = ScalpsCoreRestApi.ApiClient.instance;
            this.token = JSON.parse(Base64.atob(this.apiKey.split(".")[1])); // as Token;
            this.defaultClient.authentications["api-key"].apiKey = this.apiKey;
            // Hack the api location (to use an overidden value if needed)
            if (this.apiUrlOverride)
                this.defaultClient.basePath = this.apiUrlOverride;
            else
                this.apiUrlOverride = this.defaultClient.basePath;
            this._matchMonitor = new matchmonitor_1.MatchMonitor(this);
            this._locationManager = new locationmanager_1.LocationManager(this, gpsConfig);
        }
        load() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this._persistenceManager.load();
            });
        }
        get apiUrl() {
            return this.defaultClient.basePath;
        }
        get defaultDevice() {
            return this._persistenceManager.defaultDevice();
        }
        get devices() {
            return this._persistenceManager.devices();
        }
        get publications() {
            return this._persistenceManager.publications();
        }
        get subscriptions() {
            return this._persistenceManager.subscriptions();
        }
        /**
         * Creates a mobile device
         * @param name
         * @param platform
         * @param deviceToken platform token for push notifications for example apns://apns-token or fcm://fcm-token
         * @param completion optional callback
         */
        createMobileDevice(name, platform, deviceToken, completion) {
            return this.createAnyDevice({
                deviceType: models.DeviceType.MobileDevice,
                name: name,
                platform: platform,
                deviceToken: deviceToken
            }, completion);
        }
        /**
         * Create a pin device
         * @param name
         * @param location
         * @param completion optional callback
         */
        createPinDevice(name, location, completion) {
            return this.createAnyDevice({
                deviceType: models.DeviceType.PinDevice,
                name: name,
                location: location
            }, completion);
        }
        /**
         * Creates an ibeacon device
         * @param name
         * @param proximityUUID
         * @param major
         * @param minor
         * @param location
         * @param completion optional callback
         */
        createIBeaconDevice(name, proximityUUID, major, minor, location, completion) {
            return this.createAnyDevice({
                deviceType: models.DeviceType.IBeaconDevice,
                name: name,
                proximityUUID: proximityUUID,
                major: major,
                minor: minor,
                location: location
            }, completion);
        }
        /**
         * Create a device
         * @param device whole device object
         * @param completion optional callback
         */
        createAnyDevice(device, completion) {
            device = this.setDeviceType(device);
            let p = new Promise((resolve, reject) => {
                let api = new ScalpsCoreRestApi.DeviceApi();
                let callback = function (error, data, response) {
                    if (error) {
                        reject("An error has occured while creating device '" +
                            device.name +
                            "' :" +
                            error);
                    }
                    else {
                        // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                        resolve(JSON.parse(response.text));
                    }
                };
                api.createDevice(device, callback);
            });
            return p.then((device) => {
                let ddevice = this._persistenceManager.defaultDevice();
                let isDefault = !ddevice;
                this._persistenceManager.addDevice(device, isDefault);
                if (completion)
                    completion(device);
                return device;
            });
        }
        deleteDevice(deviceId, completion) {
            let p = new Promise((resolve, reject) => {
                let api = new ScalpsCoreRestApi.DeviceApi();
                let callback = function (error, data, response) {
                    if (error) {
                        reject("An error has occured while deleting device '" +
                            deviceId +
                            "' :" +
                            error);
                    }
                    else {
                        resolve();
                    }
                };
                api.deleteDevice(deviceId, callback);
            });
            return p.then(() => {
                let d = this._persistenceManager.devices().find(d => d.id == deviceId);
                if (d)
                    this._persistenceManager.remove(d);
                if (completion)
                    completion();
            });
        }
        setDeviceType(device) {
            if (this.isMobileDevice(device)) {
                device.deviceType = models.DeviceType.MobileDevice;
                return device;
            }
            if (this.isBeaconDevice(device)) {
                device.deviceType = models.DeviceType.IBeaconDevice;
                return device;
            }
            if (this.isPinDevice(device)) {
                device.deviceType = models.DeviceType.PinDevice;
                return device;
            }
            throw new Error("Cannot determine device type");
        }
        isMobileDevice(device) {
            return device.platform !== undefined;
        }
        isPinDevice(device) {
            return device.location !== undefined;
        }
        isBeaconDevice(device) {
            return device.major !== undefined;
        }
        /**
         * Create a publication for a device
         * @param topic topic of the publication
         * @param range range in meters
         * @param duration time in seconds
         * @param properties properties on which the sub selector can filter on
         * @param deviceId optional, if not provided the default device will be used
         * @param completion optional callback
         */
        createPublication(topic, range, duration, properties, deviceId, completion) {
            return this.withDevice(deviceId)(deviceId => {
                let p = new Promise((resolve, reject) => {
                    let api = new ScalpsCoreRestApi.PublicationApi();
                    let callback = function (error, data, response) {
                        if (error) {
                            reject("An error has occured while creating publication '" +
                                topic +
                                "' :" +
                                error);
                        }
                        else {
                            // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                            resolve(JSON.parse(response.text));
                        }
                    };
                    let publication = {
                        worldId: this.token.sub,
                        topic: topic,
                        deviceId: deviceId,
                        range: range,
                        duration: duration,
                        properties: properties
                    };
                    api.createPublication(deviceId, publication, callback);
                });
                return p.then((publication) => {
                    this._persistenceManager.add(publication);
                    if (completion)
                        completion(publication);
                    return publication;
                });
            });
        }
        deletePublication(deviceId, pubId, completion) {
            let p = new Promise((resolve, reject) => {
                let api = new ScalpsCoreRestApi.DeviceApi();
                let callback = function (error, data, response) {
                    if (error) {
                        reject("An error has occured while deleting publication '" +
                            pubId +
                            "' :" +
                            error);
                    }
                    else {
                        resolve();
                    }
                };
                api.deletePublication(deviceId, pubId, callback);
            });
            return p.then(() => {
                let d = this._persistenceManager.publications().find(d => d.id == pubId);
                if (d)
                    this._persistenceManager.remove(d);
                if (completion)
                    completion();
            });
        }
        /**
         * Create a subscription for a device
         * @param topic topic of the subscription
         * @param range range in meters
         * @param duration time in seconds
         * @param selector selector which is used for filtering publications
         * @param deviceId optional, if not provided the default device will be used
         * @param completion optional callback
         */
        createSubscription(topic, range, duration, selector, deviceId, completion) {
            return this.withDevice(deviceId)(deviceId => {
                let p = new Promise((resolve, reject) => {
                    let api = new ScalpsCoreRestApi.SubscriptionApi();
                    let callback = function (error, data, response) {
                        if (error) {
                            reject("An error has occured while creating subscription '" +
                                topic +
                                "' :" +
                                error);
                        }
                        else {
                            // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                            resolve(JSON.parse(response.text));
                        }
                    };
                    let subscription = {
                        worldId: this.token.sub,
                        topic: topic,
                        deviceId: deviceId,
                        range: range,
                        duration: duration,
                        selector: selector || ""
                    };
                    api.createSubscription(deviceId, subscription, callback);
                });
                return p.then((subscription) => {
                    this._persistenceManager.add(subscription);
                    if (completion)
                        completion(subscription);
                    return subscription;
                });
            });
        }
        deleteSubscription(deviceId, subId, completion) {
            let p = new Promise((resolve, reject) => {
                let api = new ScalpsCoreRestApi.DeviceApi();
                let callback = function (error, data, response) {
                    if (error) {
                        reject("An error has occured while deleting Ssbscription '" +
                            subId +
                            "' :" +
                            error);
                    }
                    else {
                        resolve();
                    }
                };
                api.deleteSubscription(deviceId, subId, callback);
            });
            return p.then(() => {
                let d = this._persistenceManager.publications().find(d => d.id == subId);
                if (d)
                    this._persistenceManager.remove(d);
                if (completion)
                    completion();
            });
        }
        /**
         * Updates the device location
         * @param location
         * @param deviceId optional, if not provided the default device will be used
         * @param completion optional callback
         */
        updateLocation(location, deviceId) {
            return this.withDevice(deviceId)(deviceId => {
                let p = new Promise((resolve, reject) => {
                    let api = new ScalpsCoreRestApi.LocationApi();
                    let callback = function (error, data, response) {
                        if (error) {
                            reject("An error has occured while creating location ['" +
                                location.latitude +
                                "','" +
                                location.longitude +
                                "']  :" +
                                error);
                        }
                        else {
                            // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                            resolve();
                        }
                    };
                    api.createLocation(deviceId, location, callback);
                });
                return p.then(_ => {
                });
            });
        }
        /**
         * Returns all current matches
         * @param deviceId optional, if not provided the default device will be used
         * @param completion optional callback
         */
        getAllMatches(deviceId, completion) {
            return this.withDevice(deviceId)(deviceId => {
                let p = new Promise((resolve, reject) => {
                    let api = new ScalpsCoreRestApi.DeviceApi();
                    let callback = function (error, data, response) {
                        if (error) {
                            reject("An error has occured while fetching matches: " + error);
                        }
                        else {
                            // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                            resolve(JSON.parse(response.text));
                        }
                    };
                    api.getMatches(deviceId, callback);
                });
                return p.then((matches) => {
                    if (completion)
                        completion(matches);
                    return matches;
                });
            });
        }
        /**
         * Returns a specific match for device
         * @param deviceId optional, if not provided the default device will be used
         * @param completion optional callback
         */
        getMatch(matchId, string, deviceId, completion) {
            return this.withDevice(deviceId)(deviceId => {
                let p = new Promise((resolve, reject) => {
                    let api = new ScalpsCoreRestApi.DeviceApi();
                    let callback = function (error, data, response) {
                        if (error) {
                            reject("An error has occured while fetching matches: " + error);
                        }
                        else {
                            // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                            resolve(JSON.parse(response.text));
                        }
                    };
                    api.getMatch(deviceId, matchId, callback);
                });
                return p.then((matches) => {
                    if (completion)
                        completion(matches);
                    return matches;
                });
            });
        }
        /**
         * Gets publications
         * @param deviceId optional, if not provided the default device will be used
         * @param completion optional callback
         */
        getAllPublications(deviceId, completion) {
            return this.withDevice(deviceId)(deviceId => {
                let p = new Promise((resolve, reject) => {
                    let api = new ScalpsCoreRestApi.DeviceApi();
                    let callback = function (error, data, response) {
                        if (error) {
                            reject("An error has occured while fetching publications: " + error);
                        }
                        else {
                            // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                            resolve(JSON.parse(response.text));
                        }
                    };
                    api.getPublications(deviceId, callback);
                });
                return p;
            });
        }
        withDevice(deviceId) {
            if (!!deviceId) {
                return (p) => p(deviceId);
            }
            ;
            if (!!this.defaultDevice && !!this.defaultDevice.id) {
                return (p) => p(this.defaultDevice.id);
            }
            ;
            throw new Error("There is no default device available and no other device id was supplied,  please call createDevice before thi call or provide a device id");
        }
        /**
         * Gets subscriptions
         * @param deviceId optional, if not provided the default device will be used
         * @param completion optional callback
         */
        getAllSubscriptions(deviceId, completion) {
            return this.withDevice(deviceId)(deviceId => {
                let p = new Promise((resolve, reject) => {
                    let api = new ScalpsCoreRestApi.DeviceApi();
                    let callback = function (error, data, response) {
                        if (error) {
                            reject("An error has occured while fetching subscriptions: " + error);
                        }
                        else {
                            // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                            resolve(JSON.parse(response.text));
                        }
                    };
                    api.getSubscriptions(deviceId, callback);
                });
                return p;
            });
        }
        /**
         * Registers a callback for matches
         * @param completion
         */
        set onMatch(completion) {
            this._matchMonitor.onMatch = completion;
        }
        /**
         * Register a callback for location updates
         * @param completion
         */
        set onLocationUpdate(completion) {
            this._locationManager.onLocationUpdate = completion;
        }
        startMonitoringMatches(mode) {
            this._matchMonitor.startMonitoringMatches(mode);
        }
        stopMonitoringMatches() {
            this._matchMonitor.stopMonitoringMatches();
        }
        startUpdatingLocation() {
            this._locationManager.startUpdatingLocation();
        }
        stopUpdatingLocation() {
            this._locationManager.stopUpdatingLocation();
        }
    }
    exports.Manager = Manager;
    
    },{"./api":7,"./index":26,"./locationmanager":27,"./matchmonitor":29,"./model/models":31,"Base64":36}],29:[function(require,module,exports){
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // import WebSocket = require("websocket");
    var MatchMonitorMode;
    (function (MatchMonitorMode) {
        MatchMonitorMode[MatchMonitorMode["polling"] = 0] = "polling";
        MatchMonitorMode[MatchMonitorMode["websocket"] = 1] = "websocket";
    })(MatchMonitorMode = exports.MatchMonitorMode || (exports.MatchMonitorMode = {}));
    class MatchMonitor {
        constructor(manager) {
            this.manager = manager;
            this._deliveredMatches = [];
            this._onMatch = (match) => { };
        }
        set onMatch(onMatch) {
            this._onMatch = onMatch;
        }
        get deliveredMatches() {
            return this._deliveredMatches;
        }
        startMonitoringMatches(mode) {
            if (!this.manager.defaultDevice)
                throw new Error("Default device not yet set!");
            if (mode === undefined || mode == +MatchMonitorMode.polling) {
                this.stopMonitoringMatches();
                let timer = setInterval(() => {
                    this.checkMatches();
                }, 1000);
                return;
            }
            if (mode == MatchMonitorMode.websocket) {
                let socketUrl = this.manager.apiUrl
                    .replace("https://", "wss://")
                    .replace("http://", "ws://")
                    .replace("v5", "") +
                    "pusher/v5/ws/" +
                    this.manager.defaultDevice.id;
                let ws = new WebSocket(socketUrl, ["api-key", this.manager.token.sub]);
                ws.onopen = msg => console.log("opened");
                ws.onerror = msg => console.log(msg);
                ws.onmessage = msg => this.checkMatch(msg.data);
            }
        }
        stopMonitoringMatches() {
            if (this._timerId) {
                clearInterval(this._timerId);
            }
        }
        checkMatch(matchId) {
            if (!this.manager.defaultDevice)
                return;
            if (this.hasNotBeenDelivered({ id: matchId })) {
                this.manager
                    .getMatch(matchId, this.manager.defaultDevice.id)
                    .then(match => {
                    this._deliveredMatches.push(match);
                    this._onMatch(match);
                });
            }
        }
        checkMatches() {
            this.manager.getAllMatches().then(matches => {
                for (let idx in matches) {
                    let match = matches[idx];
                    if (this.hasNotBeenDelivered(match)) {
                        this._deliveredMatches.push(match);
                        this._onMatch(match);
                    }
                }
            });
        }
        hasNotBeenDelivered(match) {
            for (let idx in this._deliveredMatches) {
                let deliveredMatch = this._deliveredMatches[idx];
                if (deliveredMatch.id == match.id)
                    return false;
            }
            return true;
        }
    }
    exports.MatchMonitor = MatchMonitor;
    
    },{}],30:[function(require,module,exports){
    "use strict";
    /**
     * MATCHMORE ALPS Core REST API
     * ## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location
     *
     * OpenAPI spec version: 0.5.0
     * Contact: support@matchmore.com
     *
     * NOTE: This class is auto generated by the swagger code generator program.
     * https://github.com/swagger-api/swagger-codegen.git
     * Do not edit the class manually.
     */
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A device might be either virtual like a pin device or physical like a mobile phone or iBeacon device.
     */
    /**
    * A device might be either virtual like a pin device or physical like a mobile phone or iBeacon device.
    */
    var DeviceType;
    (function (DeviceType) {
        DeviceType[DeviceType["MobileDevice"] = 'MobileDevice'] = "MobileDevice";
        DeviceType[DeviceType["PinDevice"] = 'PinDevice'] = "PinDevice";
        DeviceType[DeviceType["IBeaconDevice"] = 'IBeaconDevice'] = "IBeaconDevice";
    })(DeviceType = exports.DeviceType || (exports.DeviceType = {}));
    
    },{}],31:[function(require,module,exports){
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(require("./DeviceType"));
    
    },{"./DeviceType":30}],32:[function(require,module,exports){
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MatchmoreEntityDiscriminator {
        static isDevice(x) {
            return (x.deviceToken !== undefined ||
                x.location !== undefined ||
                x.proximityUUID !== undefined);
        }
        static isSubscription(x) {
            return x.selector !== undefined;
        }
        static isPublication(x) {
            return x.properties !== undefined;
        }
    }
    exports.MatchmoreEntityDiscriminator = MatchmoreEntityDiscriminator;
    
    },{}],33:[function(require,module,exports){
    "use strict";
    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    const persistence_1 = require("../persistence");
    class InMemoryPersistenceManager {
        constructor() {
            this._devices = [];
            this._publications = [];
            this._subscriptions = [];
        }
        devices() {
            return this._devices;
        }
        publications() {
            return this._publications;
        }
        onLoad(onLoad) {
            this._onLoad = onLoad;
        }
        subscriptions() {
            return this._subscriptions;
        }
        add(entity) {
            if (persistence_1.MatchmoreEntityDiscriminator.isDevice(entity)) {
                let device = entity;
                this._devices.push(device);
                return;
            }
            if (persistence_1.MatchmoreEntityDiscriminator.isPublication(entity)) {
                let pub = entity;
                this._publications.push(pub);
                return;
            }
            if (persistence_1.MatchmoreEntityDiscriminator.isSubscription(entity)) {
                let sub = entity;
                this._subscriptions.push(sub);
                return;
            }
        }
        remove(entity) {
            if (persistence_1.MatchmoreEntityDiscriminator.isDevice(entity)) {
                let device = entity;
                if (device.id == this._defaultDevice.id)
                    throw new Error("Cannot delete default device");
                this._devices = this._devices.filter(d => device.id != d.id);
                return;
            }
            if (persistence_1.MatchmoreEntityDiscriminator.isPublication(entity)) {
                let pub = entity;
                this._publications = this._publications.filter(d => pub.id != d.id);
                return;
            }
            if (persistence_1.MatchmoreEntityDiscriminator.isSubscription(entity)) {
                let sub = entity;
                this._subscriptions = this._subscriptions.filter(d => sub.id != d.id);
                return;
            }
        }
        defaultDevice() {
            return this._defaultDevice;
        }
        addDevice(device, isDefault) {
            this.add(device);
            if (isDefault)
                this._defaultDevice = device;
        }
        load() {
            return __awaiter(this, void 0, void 0, function* () {
                // do nothing
                return true;
            });
        }
        save() {
            return __awaiter(this, void 0, void 0, function* () {
                // do nothing
                return true;
            });
        }
    }
    exports.default = InMemoryPersistenceManager;
    
    },{"../persistence":32}],34:[function(require,module,exports){
    "use strict";
    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    const persistence_1 = require("../persistence");
    const platform_1 = require("../platform");
    const storageKey = '@matchmoreSdk:data';
    class LocalStoragePersistenceManager {
        constructor() {
            this._devices = [];
            this._publications = [];
            this._subscriptions = [];
        }
        devices() {
            return this._devices;
        }
        publications() {
            return this._publications;
        }
        subscriptions() {
            return this._subscriptions;
        }
        add(entity) {
            if (persistence_1.MatchmoreEntityDiscriminator.isDevice(entity)) {
                let device = entity;
                this._devices.push(device);
                this.save();
                return;
            }
            if (persistence_1.MatchmoreEntityDiscriminator.isPublication(entity)) {
                let pub = entity;
                this._publications.push(pub);
                this.save();
                return;
            }
            if (persistence_1.MatchmoreEntityDiscriminator.isSubscription(entity)) {
                let sub = entity;
                this._subscriptions.push(sub);
                this.save();
                return;
            }
        }
        remove(entity) {
            if (persistence_1.MatchmoreEntityDiscriminator.isDevice(entity)) {
                let device = entity;
                if (device.id == this._defaultDevice.id)
                    throw new Error("Cannot delete default device");
                this._devices = this._devices.filter(d => device.id != d.id);
                this.save();
                return;
            }
            if (persistence_1.MatchmoreEntityDiscriminator.isPublication(entity)) {
                let pub = entity;
                this._publications = this._publications.filter(d => pub.id != d.id);
                this.save();
                return;
            }
            if (persistence_1.MatchmoreEntityDiscriminator.isSubscription(entity)) {
                let sub = entity;
                this._subscriptions = this._subscriptions.filter(d => sub.id != d.id);
                this.save();
                return;
            }
        }
        defaultDevice() {
            return this._defaultDevice;
        }
        addDevice(device, isDefault) {
            this.add(device);
            if (isDefault)
                this._defaultDevice = device;
            this.save();
        }
        onLoad(onLoad) {
            this._onLoad = onLoad;
        }
        load() {
            return __awaiter(this, void 0, void 0, function* () {
                const dataString = yield platform_1.default.storage.load(storageKey);
                const data = JSON.parse(dataString);
                if (data) {
                    this._devices = data.devices.map((deviceObject) => deviceObject);
                    this._subscriptions = data.subscriptions.map((subscriptionObject) => subscriptionObject);
                    this._publications = data.publications.map((publicationObject) => publicationObject);
                    this._defaultDevice = data.defaultDevice;
                }
                return true;
            });
        }
        save() {
            return __awaiter(this, void 0, void 0, function* () {
                const saveData = {
                    devices: this._devices,
                    subscriptions: this._subscriptions,
                    publications: this._publications,
                    defaultDevice: this._defaultDevice,
                };
                return yield platform_1.default.storage.save(storageKey, JSON.stringify(saveData));
            });
        }
    }
    exports.default = LocalStoragePersistenceManager;
    
    },{"../persistence":32,"../platform":35}],35:[function(require,module,exports){
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PlatformConfig {
        constructor() {
            this.storage = null;
            this.webSocket = null;
        }
        static getInstance() {
            if (!PlatformConfig.instance) {
                PlatformConfig.instance = new PlatformConfig();
            }
            return PlatformConfig.instance;
        }
    }
    exports.PlatformConfig = PlatformConfig;
    const instance = PlatformConfig.getInstance();
    exports.default = instance;
    
    },{}],36:[function(require,module,exports){
    ;(function () {
    
      var object =
        typeof exports != 'undefined' ? exports :
        typeof self != 'undefined' ? self : // #8: web workers
        $.global; // #31: ExtendScript
    
      var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    
      function InvalidCharacterError(message) {
        this.message = message;
      }
      InvalidCharacterError.prototype = new Error;
      InvalidCharacterError.prototype.name = 'InvalidCharacterError';
    
      // encoder
      // [https://gist.github.com/999166] by [https://github.com/nignag]
      object.btoa || (
      object.btoa = function (input) {
        var str = String(input);
        for (
          // initialize result and counter
          var block, charCode, idx = 0, map = chars, output = '';
          // if the next str index does not exist:
          //   change the mapping table to "="
          //   check if d has no fractional digits
          str.charAt(idx | 0) || (map = '=', idx % 1);
          // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
          output += map.charAt(63 & block >> 8 - idx % 1 * 8)
        ) {
          charCode = str.charCodeAt(idx += 3/4);
          if (charCode > 0xFF) {
            throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
          }
          block = block << 8 | charCode;
        }
        return output;
      });
    
      // decoder
      // [https://gist.github.com/1020396] by [https://github.com/atk]
      object.atob || (
      object.atob = function (input) {
        var str = String(input).replace(/[=]+$/, ''); // #31: ExtendScript bad parse of /=
        if (str.length % 4 == 1) {
          throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
        }
        for (
          // initialize result and counters
          var bc = 0, bs, buffer, idx = 0, output = '';
          // get next character
          buffer = str.charAt(idx++);
          // character found in table? initialize bit storage and add its ascii value;
          ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
            // and if not first of each 4 characters,
            // convert the first 8 bits to one ascii character
            bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
        ) {
          // try to find character in table (0-63, not found => -1)
          buffer = chars.indexOf(buffer);
        }
        return output;
      });
    
    }());
    
    },{}],37:[function(require,module,exports){
    'use strict'
    
    exports.byteLength = byteLength
    exports.toByteArray = toByteArray
    exports.fromByteArray = fromByteArray
    
    var lookup = []
    var revLookup = []
    var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array
    
    var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    for (var i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i]
      revLookup[code.charCodeAt(i)] = i
    }
    
    // Support decoding URL-safe base64 strings, as Node.js does.
    // See: https://en.wikipedia.org/wiki/Base64#URL_applications
    revLookup['-'.charCodeAt(0)] = 62
    revLookup['_'.charCodeAt(0)] = 63
    
    function placeHoldersCount (b64) {
      var len = b64.length
      if (len % 4 > 0) {
        throw new Error('Invalid string. Length must be a multiple of 4')
      }
    
      // the number of equal signs (place holders)
      // if there are two placeholders, than the two characters before it
      // represent one byte
      // if there is only one, then the three characters before it represent 2 bytes
      // this is just a cheap hack to not do indexOf twice
      return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
    }
    
    function byteLength (b64) {
      // base64 is 4/3 + up to two characters of the original data
      return (b64.length * 3 / 4) - placeHoldersCount(b64)
    }
    
    function toByteArray (b64) {
      var i, l, tmp, placeHolders, arr
      var len = b64.length
      placeHolders = placeHoldersCount(b64)
    
      arr = new Arr((len * 3 / 4) - placeHolders)
    
      // if there are placeholders, only get up to the last complete 4 chars
      l = placeHolders > 0 ? len - 4 : len
    
      var L = 0
    
      for (i = 0; i < l; i += 4) {
        tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
        arr[L++] = (tmp >> 16) & 0xFF
        arr[L++] = (tmp >> 8) & 0xFF
        arr[L++] = tmp & 0xFF
      }
    
      if (placeHolders === 2) {
        tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
        arr[L++] = tmp & 0xFF
      } else if (placeHolders === 1) {
        tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
        arr[L++] = (tmp >> 8) & 0xFF
        arr[L++] = tmp & 0xFF
      }
    
      return arr
    }
    
    function tripletToBase64 (num) {
      return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
    }
    
    function encodeChunk (uint8, start, end) {
      var tmp
      var output = []
      for (var i = start; i < end; i += 3) {
        tmp = ((uint8[i] << 16) & 0xFF0000) + ((uint8[i + 1] << 8) & 0xFF00) + (uint8[i + 2] & 0xFF)
        output.push(tripletToBase64(tmp))
      }
      return output.join('')
    }
    
    function fromByteArray (uint8) {
      var tmp
      var len = uint8.length
      var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
      var output = ''
      var parts = []
      var maxChunkLength = 16383 // must be multiple of 3
    
      // go through the array every three bytes, we'll deal with trailing stuff later
      for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
        parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
      }
    
      // pad the end with zeros, but make sure to not forget the extra bytes
      if (extraBytes === 1) {
        tmp = uint8[len - 1]
        output += lookup[tmp >> 2]
        output += lookup[(tmp << 4) & 0x3F]
        output += '=='
      } else if (extraBytes === 2) {
        tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
        output += lookup[tmp >> 10]
        output += lookup[(tmp >> 4) & 0x3F]
        output += lookup[(tmp << 2) & 0x3F]
        output += '='
      }
    
      parts.push(output)
    
      return parts.join('')
    }
    
    },{}],38:[function(require,module,exports){
    /*!
     * The buffer module from node.js, for the browser.
     *
     * @author   Feross Aboukhadijeh <https://feross.org>
     * @license  MIT
     */
    /* eslint-disable no-proto */
    
    'use strict'
    
    var base64 = require('base64-js')
    var ieee754 = require('ieee754')
    
    exports.Buffer = Buffer
    exports.SlowBuffer = SlowBuffer
    exports.INSPECT_MAX_BYTES = 50
    
    var K_MAX_LENGTH = 0x7fffffff
    exports.kMaxLength = K_MAX_LENGTH
    
    /**
     * If `Buffer.TYPED_ARRAY_SUPPORT`:
     *   === true    Use Uint8Array implementation (fastest)
     *   === false   Print warning and recommend using `buffer` v4.x which has an Object
     *               implementation (most compatible, even IE6)
     *
     * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
     * Opera 11.6+, iOS 4.2+.
     *
     * We report that the browser does not support typed arrays if the are not subclassable
     * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
     * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
     * for __proto__ and has a buggy typed array implementation.
     */
    Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()
    
    if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
        typeof console.error === 'function') {
      console.error(
        'This browser lacks typed array (Uint8Array) support which is required by ' +
        '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
      )
    }
    
    function typedArraySupport () {
      // Can typed array instances can be augmented?
      try {
        var arr = new Uint8Array(1)
        arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
        return arr.foo() === 42
      } catch (e) {
        return false
      }
    }
    
    Object.defineProperty(Buffer.prototype, 'parent', {
      get: function () {
        if (!(this instanceof Buffer)) {
          return undefined
        }
        return this.buffer
      }
    })
    
    Object.defineProperty(Buffer.prototype, 'offset', {
      get: function () {
        if (!(this instanceof Buffer)) {
          return undefined
        }
        return this.byteOffset
      }
    })
    
    function createBuffer (length) {
      if (length > K_MAX_LENGTH) {
        throw new RangeError('Invalid typed array length')
      }
      // Return an augmented `Uint8Array` instance
      var buf = new Uint8Array(length)
      buf.__proto__ = Buffer.prototype
      return buf
    }
    
    /**
     * The Buffer constructor returns instances of `Uint8Array` that have their
     * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
     * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
     * and the `Uint8Array` methods. Square bracket notation works as expected -- it
     * returns a single octet.
     *
     * The `Uint8Array` prototype remains unmodified.
     */
    
    function Buffer (arg, encodingOrOffset, length) {
      // Common case.
      if (typeof arg === 'number') {
        if (typeof encodingOrOffset === 'string') {
          throw new Error(
            'If encoding is specified then the first argument must be a string'
          )
        }
        return allocUnsafe(arg)
      }
      return from(arg, encodingOrOffset, length)
    }
    
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    if (typeof Symbol !== 'undefined' && Symbol.species &&
        Buffer[Symbol.species] === Buffer) {
      Object.defineProperty(Buffer, Symbol.species, {
        value: null,
        configurable: true,
        enumerable: false,
        writable: false
      })
    }
    
    Buffer.poolSize = 8192 // not used by this implementation
    
    function from (value, encodingOrOffset, length) {
      if (typeof value === 'number') {
        throw new TypeError('"value" argument must not be a number')
      }
    
      if (isArrayBuffer(value) || (value && isArrayBuffer(value.buffer))) {
        return fromArrayBuffer(value, encodingOrOffset, length)
      }
    
      if (typeof value === 'string') {
        return fromString(value, encodingOrOffset)
      }
    
      return fromObject(value)
    }
    
    /**
     * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
     * if value is a number.
     * Buffer.from(str[, encoding])
     * Buffer.from(array)
     * Buffer.from(buffer)
     * Buffer.from(arrayBuffer[, byteOffset[, length]])
     **/
    Buffer.from = function (value, encodingOrOffset, length) {
      return from(value, encodingOrOffset, length)
    }
    
    // Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
    // https://github.com/feross/buffer/pull/148
    Buffer.prototype.__proto__ = Uint8Array.prototype
    Buffer.__proto__ = Uint8Array
    
    function assertSize (size) {
      if (typeof size !== 'number') {
        throw new TypeError('"size" argument must be of type number')
      } else if (size < 0) {
        throw new RangeError('"size" argument must not be negative')
      }
    }
    
    function alloc (size, fill, encoding) {
      assertSize(size)
      if (size <= 0) {
        return createBuffer(size)
      }
      if (fill !== undefined) {
        // Only pay attention to encoding if it's a string. This
        // prevents accidentally sending in a number that would
        // be interpretted as a start offset.
        return typeof encoding === 'string'
          ? createBuffer(size).fill(fill, encoding)
          : createBuffer(size).fill(fill)
      }
      return createBuffer(size)
    }
    
    /**
     * Creates a new filled Buffer instance.
     * alloc(size[, fill[, encoding]])
     **/
    Buffer.alloc = function (size, fill, encoding) {
      return alloc(size, fill, encoding)
    }
    
    function allocUnsafe (size) {
      assertSize(size)
      return createBuffer(size < 0 ? 0 : checked(size) | 0)
    }
    
    /**
     * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
     * */
    Buffer.allocUnsafe = function (size) {
      return allocUnsafe(size)
    }
    /**
     * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
     */
    Buffer.allocUnsafeSlow = function (size) {
      return allocUnsafe(size)
    }
    
    function fromString (string, encoding) {
      if (typeof encoding !== 'string' || encoding === '') {
        encoding = 'utf8'
      }
    
      if (!Buffer.isEncoding(encoding)) {
        throw new TypeError('Unknown encoding: ' + encoding)
      }
    
      var length = byteLength(string, encoding) | 0
      var buf = createBuffer(length)
    
      var actual = buf.write(string, encoding)
    
      if (actual !== length) {
        // Writing a hex string, for example, that contains invalid characters will
        // cause everything after the first invalid character to be ignored. (e.g.
        // 'abxxcd' will be treated as 'ab')
        buf = buf.slice(0, actual)
      }
    
      return buf
    }
    
    function fromArrayLike (array) {
      var length = array.length < 0 ? 0 : checked(array.length) | 0
      var buf = createBuffer(length)
      for (var i = 0; i < length; i += 1) {
        buf[i] = array[i] & 255
      }
      return buf
    }
    
    function fromArrayBuffer (array, byteOffset, length) {
      if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('"offset" is outside of buffer bounds')
      }
    
      if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('"length" is outside of buffer bounds')
      }
    
      var buf
      if (byteOffset === undefined && length === undefined) {
        buf = new Uint8Array(array)
      } else if (length === undefined) {
        buf = new Uint8Array(array, byteOffset)
      } else {
        buf = new Uint8Array(array, byteOffset, length)
      }
    
      // Return an augmented `Uint8Array` instance
      buf.__proto__ = Buffer.prototype
      return buf
    }
    
    function fromObject (obj) {
      if (Buffer.isBuffer(obj)) {
        var len = checked(obj.length) | 0
        var buf = createBuffer(len)
    
        if (buf.length === 0) {
          return buf
        }
    
        obj.copy(buf, 0, 0, len)
        return buf
      }
    
      if (obj) {
        if (ArrayBuffer.isView(obj) || 'length' in obj) {
          if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
            return createBuffer(0)
          }
          return fromArrayLike(obj)
        }
    
        if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
          return fromArrayLike(obj.data)
        }
      }
    
      throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object.')
    }
    
    function checked (length) {
      // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
      // length is NaN (which is otherwise coerced to zero.)
      if (length >= K_MAX_LENGTH) {
        throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                             'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
      }
      return length | 0
    }
    
    function SlowBuffer (length) {
      if (+length != length) { // eslint-disable-line eqeqeq
        length = 0
      }
      return Buffer.alloc(+length)
    }
    
    Buffer.isBuffer = function isBuffer (b) {
      return b != null && b._isBuffer === true
    }
    
    Buffer.compare = function compare (a, b) {
      if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
        throw new TypeError('Arguments must be Buffers')
      }
    
      if (a === b) return 0
    
      var x = a.length
      var y = b.length
    
      for (var i = 0, len = Math.min(x, y); i < len; ++i) {
        if (a[i] !== b[i]) {
          x = a[i]
          y = b[i]
          break
        }
      }
    
      if (x < y) return -1
      if (y < x) return 1
      return 0
    }
    
    Buffer.isEncoding = function isEncoding (encoding) {
      switch (String(encoding).toLowerCase()) {
        case 'hex':
        case 'utf8':
        case 'utf-8':
        case 'ascii':
        case 'latin1':
        case 'binary':
        case 'base64':
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return true
        default:
          return false
      }
    }
    
    Buffer.concat = function concat (list, length) {
      if (!Array.isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers')
      }
    
      if (list.length === 0) {
        return Buffer.alloc(0)
      }
    
      var i
      if (length === undefined) {
        length = 0
        for (i = 0; i < list.length; ++i) {
          length += list[i].length
        }
      }
    
      var buffer = Buffer.allocUnsafe(length)
      var pos = 0
      for (i = 0; i < list.length; ++i) {
        var buf = list[i]
        if (ArrayBuffer.isView(buf)) {
          buf = Buffer.from(buf)
        }
        if (!Buffer.isBuffer(buf)) {
          throw new TypeError('"list" argument must be an Array of Buffers')
        }
        buf.copy(buffer, pos)
        pos += buf.length
      }
      return buffer
    }
    
    function byteLength (string, encoding) {
      if (Buffer.isBuffer(string)) {
        return string.length
      }
      if (ArrayBuffer.isView(string) || isArrayBuffer(string)) {
        return string.byteLength
      }
      if (typeof string !== 'string') {
        string = '' + string
      }
    
      var len = string.length
      if (len === 0) return 0
    
      // Use a for loop to avoid recursion
      var loweredCase = false
      for (;;) {
        switch (encoding) {
          case 'ascii':
          case 'latin1':
          case 'binary':
            return len
          case 'utf8':
          case 'utf-8':
          case undefined:
            return utf8ToBytes(string).length
          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return len * 2
          case 'hex':
            return len >>> 1
          case 'base64':
            return base64ToBytes(string).length
          default:
            if (loweredCase) return utf8ToBytes(string).length // assume utf8
            encoding = ('' + encoding).toLowerCase()
            loweredCase = true
        }
      }
    }
    Buffer.byteLength = byteLength
    
    function slowToString (encoding, start, end) {
      var loweredCase = false
    
      // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
      // property of a typed array.
    
      // This behaves neither like String nor Uint8Array in that we set start/end
      // to their upper/lower bounds if the value passed is out of range.
      // undefined is handled specially as per ECMA-262 6th Edition,
      // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
      if (start === undefined || start < 0) {
        start = 0
      }
      // Return early if start > this.length. Done here to prevent potential uint32
      // coercion fail below.
      if (start > this.length) {
        return ''
      }
    
      if (end === undefined || end > this.length) {
        end = this.length
      }
    
      if (end <= 0) {
        return ''
      }
    
      // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
      end >>>= 0
      start >>>= 0
    
      if (end <= start) {
        return ''
      }
    
      if (!encoding) encoding = 'utf8'
    
      while (true) {
        switch (encoding) {
          case 'hex':
            return hexSlice(this, start, end)
    
          case 'utf8':
          case 'utf-8':
            return utf8Slice(this, start, end)
    
          case 'ascii':
            return asciiSlice(this, start, end)
    
          case 'latin1':
          case 'binary':
            return latin1Slice(this, start, end)
    
          case 'base64':
            return base64Slice(this, start, end)
    
          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return utf16leSlice(this, start, end)
    
          default:
            if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
            encoding = (encoding + '').toLowerCase()
            loweredCase = true
        }
      }
    }
    
    // This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
    // to detect a Buffer instance. It's not possible to use `instanceof Buffer`
    // reliably in a browserify context because there could be multiple different
    // copies of the 'buffer' package in use. This method works even for Buffer
    // instances that were created from another copy of the `buffer` package.
    // See: https://github.com/feross/buffer/issues/154
    Buffer.prototype._isBuffer = true
    
    function swap (b, n, m) {
      var i = b[n]
      b[n] = b[m]
      b[m] = i
    }
    
    Buffer.prototype.swap16 = function swap16 () {
      var len = this.length
      if (len % 2 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 16-bits')
      }
      for (var i = 0; i < len; i += 2) {
        swap(this, i, i + 1)
      }
      return this
    }
    
    Buffer.prototype.swap32 = function swap32 () {
      var len = this.length
      if (len % 4 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 32-bits')
      }
      for (var i = 0; i < len; i += 4) {
        swap(this, i, i + 3)
        swap(this, i + 1, i + 2)
      }
      return this
    }
    
    Buffer.prototype.swap64 = function swap64 () {
      var len = this.length
      if (len % 8 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 64-bits')
      }
      for (var i = 0; i < len; i += 8) {
        swap(this, i, i + 7)
        swap(this, i + 1, i + 6)
        swap(this, i + 2, i + 5)
        swap(this, i + 3, i + 4)
      }
      return this
    }
    
    Buffer.prototype.toString = function toString () {
      var length = this.length
      if (length === 0) return ''
      if (arguments.length === 0) return utf8Slice(this, 0, length)
      return slowToString.apply(this, arguments)
    }
    
    Buffer.prototype.toLocaleString = Buffer.prototype.toString
    
    Buffer.prototype.equals = function equals (b) {
      if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
      if (this === b) return true
      return Buffer.compare(this, b) === 0
    }
    
    Buffer.prototype.inspect = function inspect () {
      var str = ''
      var max = exports.INSPECT_MAX_BYTES
      if (this.length > 0) {
        str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
        if (this.length > max) str += ' ... '
      }
      return '<Buffer ' + str + '>'
    }
    
    Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
      if (!Buffer.isBuffer(target)) {
        throw new TypeError('Argument must be a Buffer')
      }
    
      if (start === undefined) {
        start = 0
      }
      if (end === undefined) {
        end = target ? target.length : 0
      }
      if (thisStart === undefined) {
        thisStart = 0
      }
      if (thisEnd === undefined) {
        thisEnd = this.length
      }
    
      if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError('out of range index')
      }
    
      if (thisStart >= thisEnd && start >= end) {
        return 0
      }
      if (thisStart >= thisEnd) {
        return -1
      }
      if (start >= end) {
        return 1
      }
    
      start >>>= 0
      end >>>= 0
      thisStart >>>= 0
      thisEnd >>>= 0
    
      if (this === target) return 0
    
      var x = thisEnd - thisStart
      var y = end - start
      var len = Math.min(x, y)
    
      var thisCopy = this.slice(thisStart, thisEnd)
      var targetCopy = target.slice(start, end)
    
      for (var i = 0; i < len; ++i) {
        if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i]
          y = targetCopy[i]
          break
        }
      }
    
      if (x < y) return -1
      if (y < x) return 1
      return 0
    }
    
    // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
    // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
    //
    // Arguments:
    // - buffer - a Buffer to search
    // - val - a string, Buffer, or number
    // - byteOffset - an index into `buffer`; will be clamped to an int32
    // - encoding - an optional encoding, relevant is val is a string
    // - dir - true for indexOf, false for lastIndexOf
    function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
      // Empty buffer means no match
      if (buffer.length === 0) return -1
    
      // Normalize byteOffset
      if (typeof byteOffset === 'string') {
        encoding = byteOffset
        byteOffset = 0
      } else if (byteOffset > 0x7fffffff) {
        byteOffset = 0x7fffffff
      } else if (byteOffset < -0x80000000) {
        byteOffset = -0x80000000
      }
      byteOffset = +byteOffset  // Coerce to Number.
      if (numberIsNaN(byteOffset)) {
        // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
        byteOffset = dir ? 0 : (buffer.length - 1)
      }
    
      // Normalize byteOffset: negative offsets start from the end of the buffer
      if (byteOffset < 0) byteOffset = buffer.length + byteOffset
      if (byteOffset >= buffer.length) {
        if (dir) return -1
        else byteOffset = buffer.length - 1
      } else if (byteOffset < 0) {
        if (dir) byteOffset = 0
        else return -1
      }
    
      // Normalize val
      if (typeof val === 'string') {
        val = Buffer.from(val, encoding)
      }
    
      // Finally, search either indexOf (if dir is true) or lastIndexOf
      if (Buffer.isBuffer(val)) {
        // Special case: looking for empty string/buffer always fails
        if (val.length === 0) {
          return -1
        }
        return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
      } else if (typeof val === 'number') {
        val = val & 0xFF // Search for a byte value [0-255]
        if (typeof Uint8Array.prototype.indexOf === 'function') {
          if (dir) {
            return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
          } else {
            return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
          }
        }
        return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
      }
    
      throw new TypeError('val must be string, number or Buffer')
    }
    
    function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
      var indexSize = 1
      var arrLength = arr.length
      var valLength = val.length
    
      if (encoding !== undefined) {
        encoding = String(encoding).toLowerCase()
        if (encoding === 'ucs2' || encoding === 'ucs-2' ||
            encoding === 'utf16le' || encoding === 'utf-16le') {
          if (arr.length < 2 || val.length < 2) {
            return -1
          }
          indexSize = 2
          arrLength /= 2
          valLength /= 2
          byteOffset /= 2
        }
      }
    
      function read (buf, i) {
        if (indexSize === 1) {
          return buf[i]
        } else {
          return buf.readUInt16BE(i * indexSize)
        }
      }
    
      var i
      if (dir) {
        var foundIndex = -1
        for (i = byteOffset; i < arrLength; i++) {
          if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
            if (foundIndex === -1) foundIndex = i
            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
          } else {
            if (foundIndex !== -1) i -= i - foundIndex
            foundIndex = -1
          }
        }
      } else {
        if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
        for (i = byteOffset; i >= 0; i--) {
          var found = true
          for (var j = 0; j < valLength; j++) {
            if (read(arr, i + j) !== read(val, j)) {
              found = false
              break
            }
          }
          if (found) return i
        }
      }
    
      return -1
    }
    
    Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1
    }
    
    Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
    }
    
    Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
    }
    
    function hexWrite (buf, string, offset, length) {
      offset = Number(offset) || 0
      var remaining = buf.length - offset
      if (!length) {
        length = remaining
      } else {
        length = Number(length)
        if (length > remaining) {
          length = remaining
        }
      }
    
      var strLen = string.length
    
      if (length > strLen / 2) {
        length = strLen / 2
      }
      for (var i = 0; i < length; ++i) {
        var parsed = parseInt(string.substr(i * 2, 2), 16)
        if (numberIsNaN(parsed)) return i
        buf[offset + i] = parsed
      }
      return i
    }
    
    function utf8Write (buf, string, offset, length) {
      return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
    }
    
    function asciiWrite (buf, string, offset, length) {
      return blitBuffer(asciiToBytes(string), buf, offset, length)
    }
    
    function latin1Write (buf, string, offset, length) {
      return asciiWrite(buf, string, offset, length)
    }
    
    function base64Write (buf, string, offset, length) {
      return blitBuffer(base64ToBytes(string), buf, offset, length)
    }
    
    function ucs2Write (buf, string, offset, length) {
      return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
    }
    
    Buffer.prototype.write = function write (string, offset, length, encoding) {
      // Buffer#write(string)
      if (offset === undefined) {
        encoding = 'utf8'
        length = this.length
        offset = 0
      // Buffer#write(string, encoding)
      } else if (length === undefined && typeof offset === 'string') {
        encoding = offset
        length = this.length
        offset = 0
      // Buffer#write(string, offset[, length][, encoding])
      } else if (isFinite(offset)) {
        offset = offset >>> 0
        if (isFinite(length)) {
          length = length >>> 0
          if (encoding === undefined) encoding = 'utf8'
        } else {
          encoding = length
          length = undefined
        }
      } else {
        throw new Error(
          'Buffer.write(string, encoding, offset[, length]) is no longer supported'
        )
      }
    
      var remaining = this.length - offset
      if (length === undefined || length > remaining) length = remaining
    
      if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
        throw new RangeError('Attempt to write outside buffer bounds')
      }
    
      if (!encoding) encoding = 'utf8'
    
      var loweredCase = false
      for (;;) {
        switch (encoding) {
          case 'hex':
            return hexWrite(this, string, offset, length)
    
          case 'utf8':
          case 'utf-8':
            return utf8Write(this, string, offset, length)
    
          case 'ascii':
            return asciiWrite(this, string, offset, length)
    
          case 'latin1':
          case 'binary':
            return latin1Write(this, string, offset, length)
    
          case 'base64':
            // Warning: maxLength not taken into account in base64Write
            return base64Write(this, string, offset, length)
    
          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return ucs2Write(this, string, offset, length)
    
          default:
            if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
            encoding = ('' + encoding).toLowerCase()
            loweredCase = true
        }
      }
    }
    
    Buffer.prototype.toJSON = function toJSON () {
      return {
        type: 'Buffer',
        data: Array.prototype.slice.call(this._arr || this, 0)
      }
    }
    
    function base64Slice (buf, start, end) {
      if (start === 0 && end === buf.length) {
        return base64.fromByteArray(buf)
      } else {
        return base64.fromByteArray(buf.slice(start, end))
      }
    }
    
    function utf8Slice (buf, start, end) {
      end = Math.min(buf.length, end)
      var res = []
    
      var i = start
      while (i < end) {
        var firstByte = buf[i]
        var codePoint = null
        var bytesPerSequence = (firstByte > 0xEF) ? 4
          : (firstByte > 0xDF) ? 3
          : (firstByte > 0xBF) ? 2
          : 1
    
        if (i + bytesPerSequence <= end) {
          var secondByte, thirdByte, fourthByte, tempCodePoint
    
          switch (bytesPerSequence) {
            case 1:
              if (firstByte < 0x80) {
                codePoint = firstByte
              }
              break
            case 2:
              secondByte = buf[i + 1]
              if ((secondByte & 0xC0) === 0x80) {
                tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
                if (tempCodePoint > 0x7F) {
                  codePoint = tempCodePoint
                }
              }
              break
            case 3:
              secondByte = buf[i + 1]
              thirdByte = buf[i + 2]
              if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
                if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                  codePoint = tempCodePoint
                }
              }
              break
            case 4:
              secondByte = buf[i + 1]
              thirdByte = buf[i + 2]
              fourthByte = buf[i + 3]
              if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
                if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                  codePoint = tempCodePoint
                }
              }
          }
        }
    
        if (codePoint === null) {
          // we did not generate a valid codePoint so insert a
          // replacement char (U+FFFD) and advance only 1 byte
          codePoint = 0xFFFD
          bytesPerSequence = 1
        } else if (codePoint > 0xFFFF) {
          // encode to utf16 (surrogate pair dance)
          codePoint -= 0x10000
          res.push(codePoint >>> 10 & 0x3FF | 0xD800)
          codePoint = 0xDC00 | codePoint & 0x3FF
        }
    
        res.push(codePoint)
        i += bytesPerSequence
      }
    
      return decodeCodePointsArray(res)
    }
    
    // Based on http://stackoverflow.com/a/22747272/680742, the browser with
    // the lowest limit is Chrome, with 0x10000 args.
    // We go 1 magnitude less, for safety
    var MAX_ARGUMENTS_LENGTH = 0x1000
    
    function decodeCodePointsArray (codePoints) {
      var len = codePoints.length
      if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
      }
    
      // Decode in chunks to avoid "call stack size exceeded".
      var res = ''
      var i = 0
      while (i < len) {
        res += String.fromCharCode.apply(
          String,
          codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
        )
      }
      return res
    }
    
    function asciiSlice (buf, start, end) {
      var ret = ''
      end = Math.min(buf.length, end)
    
      for (var i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i] & 0x7F)
      }
      return ret
    }
    
    function latin1Slice (buf, start, end) {
      var ret = ''
      end = Math.min(buf.length, end)
    
      for (var i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i])
      }
      return ret
    }
    
    function hexSlice (buf, start, end) {
      var len = buf.length
    
      if (!start || start < 0) start = 0
      if (!end || end < 0 || end > len) end = len
    
      var out = ''
      for (var i = start; i < end; ++i) {
        out += toHex(buf[i])
      }
      return out
    }
    
    function utf16leSlice (buf, start, end) {
      var bytes = buf.slice(start, end)
      var res = ''
      for (var i = 0; i < bytes.length; i += 2) {
        res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
      }
      return res
    }
    
    Buffer.prototype.slice = function slice (start, end) {
      var len = this.length
      start = ~~start
      end = end === undefined ? len : ~~end
    
      if (start < 0) {
        start += len
        if (start < 0) start = 0
      } else if (start > len) {
        start = len
      }
    
      if (end < 0) {
        end += len
        if (end < 0) end = 0
      } else if (end > len) {
        end = len
      }
    
      if (end < start) end = start
    
      var newBuf = this.subarray(start, end)
      // Return an augmented `Uint8Array` instance
      newBuf.__proto__ = Buffer.prototype
      return newBuf
    }
    
    /*
     * Need to make sure that buffer isn't trying to write out of bounds.
     */
    function checkOffset (offset, ext, length) {
      if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
      if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
    }
    
    Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
      offset = offset >>> 0
      byteLength = byteLength >>> 0
      if (!noAssert) checkOffset(offset, byteLength, this.length)
    
      var val = this[offset]
      var mul = 1
      var i = 0
      while (++i < byteLength && (mul *= 0x100)) {
        val += this[offset + i] * mul
      }
    
      return val
    }
    
    Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
      offset = offset >>> 0
      byteLength = byteLength >>> 0
      if (!noAssert) {
        checkOffset(offset, byteLength, this.length)
      }
    
      var val = this[offset + --byteLength]
      var mul = 1
      while (byteLength > 0 && (mul *= 0x100)) {
        val += this[offset + --byteLength] * mul
      }
    
      return val
    }
    
    Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
      offset = offset >>> 0
      if (!noAssert) checkOffset(offset, 1, this.length)
      return this[offset]
    }
    
    Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
      offset = offset >>> 0
      if (!noAssert) checkOffset(offset, 2, this.length)
      return this[offset] | (this[offset + 1] << 8)
    }
    
    Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
      offset = offset >>> 0
      if (!noAssert) checkOffset(offset, 2, this.length)
      return (this[offset] << 8) | this[offset + 1]
    }
    
    Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
      offset = offset >>> 0
      if (!noAssert) checkOffset(offset, 4, this.length)
    
      return ((this[offset]) |
          (this[offset + 1] << 8) |
          (this[offset + 2] << 16)) +
          (this[offset + 3] * 0x1000000)
    }
    
    Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
      offset = offset >>> 0
      if (!noAssert) checkOffset(offset, 4, this.length)
    
      return (this[offset] * 0x1000000) +
        ((this[offset + 1] << 16) |
        (this[offset + 2] << 8) |
        this[offset + 3])
    }
    
    Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
      offset = offset >>> 0
      byteLength = byteLength >>> 0
      if (!noAssert) checkOffset(offset, byteLength, this.length)
    
      var val = this[offset]
      var mul = 1
      var i = 0
      while (++i < byteLength && (mul *= 0x100)) {
        val += this[offset + i] * mul
      }
      mul *= 0x80
    
      if (val >= mul) val -= Math.pow(2, 8 * byteLength)
    
      return val
    }
    
    Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
      offset = offset >>> 0
      byteLength = byteLength >>> 0
      if (!noAssert) checkOffset(offset, byteLength, this.length)
    
      var i = byteLength
      var mul = 1
      var val = this[offset + --i]
      while (i > 0 && (mul *= 0x100)) {
        val += this[offset + --i] * mul
      }
      mul *= 0x80
    
      if (val >= mul) val -= Math.pow(2, 8 * byteLength)
    
      return val
    }
    
    Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
      offset = offset >>> 0
      if (!noAssert) checkOffset(offset, 1, this.length)
      if (!(this[offset] & 0x80)) return (this[offset])
      return ((0xff - this[offset] + 1) * -1)
    }
    
    Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
      offset = offset >>> 0
      if (!noAssert) checkOffset(offset, 2, this.length)
      var val = this[offset] | (this[offset + 1] << 8)
      return (val & 0x8000) ? val | 0xFFFF0000 : val
    }
    
    Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
      offset = offset >>> 0
      if (!noAssert) checkOffset(offset, 2, this.length)
      var val = this[offset + 1] | (this[offset] << 8)
      return (val & 0x8000) ? val | 0xFFFF0000 : val
    }
    
    Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
      offset = offset >>> 0
      if (!noAssert) checkOffset(offset, 4, this.length)
    
      return (this[offset]) |
        (this[offset + 1] << 8) |
        (this[offset + 2] << 16) |
        (this[offset + 3] << 24)
    }
    
    Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
      offset = offset >>> 0
      if (!noAssert) checkOffset(offset, 4, this.length)
    
      return (this[offset] << 24) |
        (this[offset + 1] << 16) |
        (this[offset + 2] << 8) |
        (this[offset + 3])
    }
    
    Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
      offset = offset >>> 0
      if (!noAssert) checkOffset(offset, 4, this.length)
      return ieee754.read(this, offset, true, 23, 4)
    }
    
    Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
      offset = offset >>> 0
      if (!noAssert) checkOffset(offset, 4, this.length)
      return ieee754.read(this, offset, false, 23, 4)
    }
    
    Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
      offset = offset >>> 0
      if (!noAssert) checkOffset(offset, 8, this.length)
      return ieee754.read(this, offset, true, 52, 8)
    }
    
    Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
      offset = offset >>> 0
      if (!noAssert) checkOffset(offset, 8, this.length)
      return ieee754.read(this, offset, false, 52, 8)
    }
    
    function checkInt (buf, value, offset, ext, max, min) {
      if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
      if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
      if (offset + ext > buf.length) throw new RangeError('Index out of range')
    }
    
    Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
      value = +value
      offset = offset >>> 0
      byteLength = byteLength >>> 0
      if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength) - 1
        checkInt(this, value, offset, byteLength, maxBytes, 0)
      }
    
      var mul = 1
      var i = 0
      this[offset] = value & 0xFF
      while (++i < byteLength && (mul *= 0x100)) {
        this[offset + i] = (value / mul) & 0xFF
      }
    
      return offset + byteLength
    }
    
    Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
      value = +value
      offset = offset >>> 0
      byteLength = byteLength >>> 0
      if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength) - 1
        checkInt(this, value, offset, byteLength, maxBytes, 0)
      }
    
      var i = byteLength - 1
      var mul = 1
      this[offset + i] = value & 0xFF
      while (--i >= 0 && (mul *= 0x100)) {
        this[offset + i] = (value / mul) & 0xFF
      }
    
      return offset + byteLength
    }
    
    Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
      value = +value
      offset = offset >>> 0
      if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
      this[offset] = (value & 0xff)
      return offset + 1
    }
    
    Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
      value = +value
      offset = offset >>> 0
      if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
      this[offset] = (value & 0xff)
      this[offset + 1] = (value >>> 8)
      return offset + 2
    }
    
    Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
      value = +value
      offset = offset >>> 0
      if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
      this[offset] = (value >>> 8)
      this[offset + 1] = (value & 0xff)
      return offset + 2
    }
    
    Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
      value = +value
      offset = offset >>> 0
      if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
      this[offset + 3] = (value >>> 24)
      this[offset + 2] = (value >>> 16)
      this[offset + 1] = (value >>> 8)
      this[offset] = (value & 0xff)
      return offset + 4
    }
    
    Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
      value = +value
      offset = offset >>> 0
      if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
      this[offset] = (value >>> 24)
      this[offset + 1] = (value >>> 16)
      this[offset + 2] = (value >>> 8)
      this[offset + 3] = (value & 0xff)
      return offset + 4
    }
    
    Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
      value = +value
      offset = offset >>> 0
      if (!noAssert) {
        var limit = Math.pow(2, (8 * byteLength) - 1)
    
        checkInt(this, value, offset, byteLength, limit - 1, -limit)
      }
    
      var i = 0
      var mul = 1
      var sub = 0
      this[offset] = value & 0xFF
      while (++i < byteLength && (mul *= 0x100)) {
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
          sub = 1
        }
        this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
      }
    
      return offset + byteLength
    }
    
    Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
      value = +value
      offset = offset >>> 0
      if (!noAssert) {
        var limit = Math.pow(2, (8 * byteLength) - 1)
    
        checkInt(this, value, offset, byteLength, limit - 1, -limit)
      }
    
      var i = byteLength - 1
      var mul = 1
      var sub = 0
      this[offset + i] = value & 0xFF
      while (--i >= 0 && (mul *= 0x100)) {
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
          sub = 1
        }
        this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
      }
    
      return offset + byteLength
    }
    
    Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
      value = +value
      offset = offset >>> 0
      if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
      if (value < 0) value = 0xff + value + 1
      this[offset] = (value & 0xff)
      return offset + 1
    }
    
    Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
      value = +value
      offset = offset >>> 0
      if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
      this[offset] = (value & 0xff)
      this[offset + 1] = (value >>> 8)
      return offset + 2
    }
    
    Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
      value = +value
      offset = offset >>> 0
      if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
      this[offset] = (value >>> 8)
      this[offset + 1] = (value & 0xff)
      return offset + 2
    }
    
    Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
      value = +value
      offset = offset >>> 0
      if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
      this[offset] = (value & 0xff)
      this[offset + 1] = (value >>> 8)
      this[offset + 2] = (value >>> 16)
      this[offset + 3] = (value >>> 24)
      return offset + 4
    }
    
    Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
      value = +value
      offset = offset >>> 0
      if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
      if (value < 0) value = 0xffffffff + value + 1
      this[offset] = (value >>> 24)
      this[offset + 1] = (value >>> 16)
      this[offset + 2] = (value >>> 8)
      this[offset + 3] = (value & 0xff)
      return offset + 4
    }
    
    function checkIEEE754 (buf, value, offset, ext, max, min) {
      if (offset + ext > buf.length) throw new RangeError('Index out of range')
      if (offset < 0) throw new RangeError('Index out of range')
    }
    
    function writeFloat (buf, value, offset, littleEndian, noAssert) {
      value = +value
      offset = offset >>> 0
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
      }
      ieee754.write(buf, value, offset, littleEndian, 23, 4)
      return offset + 4
    }
    
    Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
      return writeFloat(this, value, offset, true, noAssert)
    }
    
    Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
      return writeFloat(this, value, offset, false, noAssert)
    }
    
    function writeDouble (buf, value, offset, littleEndian, noAssert) {
      value = +value
      offset = offset >>> 0
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
      }
      ieee754.write(buf, value, offset, littleEndian, 52, 8)
      return offset + 8
    }
    
    Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
      return writeDouble(this, value, offset, true, noAssert)
    }
    
    Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
      return writeDouble(this, value, offset, false, noAssert)
    }
    
    // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
    Buffer.prototype.copy = function copy (target, targetStart, start, end) {
      if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
      if (!start) start = 0
      if (!end && end !== 0) end = this.length
      if (targetStart >= target.length) targetStart = target.length
      if (!targetStart) targetStart = 0
      if (end > 0 && end < start) end = start
    
      // Copy 0 bytes; we're done
      if (end === start) return 0
      if (target.length === 0 || this.length === 0) return 0
    
      // Fatal error conditions
      if (targetStart < 0) {
        throw new RangeError('targetStart out of bounds')
      }
      if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
      if (end < 0) throw new RangeError('sourceEnd out of bounds')
    
      // Are we oob?
      if (end > this.length) end = this.length
      if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start
      }
    
      var len = end - start
    
      if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
        // Use built-in when available, missing from IE11
        this.copyWithin(targetStart, start, end)
      } else if (this === target && start < targetStart && targetStart < end) {
        // descending copy from end
        for (var i = len - 1; i >= 0; --i) {
          target[i + targetStart] = this[i + start]
        }
      } else {
        Uint8Array.prototype.set.call(
          target,
          this.subarray(start, end),
          targetStart
        )
      }
    
      return len
    }
    
    // Usage:
    //    buffer.fill(number[, offset[, end]])
    //    buffer.fill(buffer[, offset[, end]])
    //    buffer.fill(string[, offset[, end]][, encoding])
    Buffer.prototype.fill = function fill (val, start, end, encoding) {
      // Handle string cases:
      if (typeof val === 'string') {
        if (typeof start === 'string') {
          encoding = start
          start = 0
          end = this.length
        } else if (typeof end === 'string') {
          encoding = end
          end = this.length
        }
        if (encoding !== undefined && typeof encoding !== 'string') {
          throw new TypeError('encoding must be a string')
        }
        if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
          throw new TypeError('Unknown encoding: ' + encoding)
        }
        if (val.length === 1) {
          var code = val.charCodeAt(0)
          if ((encoding === 'utf8' && code < 128) ||
              encoding === 'latin1') {
            // Fast path: If `val` fits into a single byte, use that numeric value.
            val = code
          }
        }
      } else if (typeof val === 'number') {
        val = val & 255
      }
    
      // Invalid ranges are not set to a default, so can range check early.
      if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError('Out of range index')
      }
    
      if (end <= start) {
        return this
      }
    
      start = start >>> 0
      end = end === undefined ? this.length : end >>> 0
    
      if (!val) val = 0
    
      var i
      if (typeof val === 'number') {
        for (i = start; i < end; ++i) {
          this[i] = val
        }
      } else {
        var bytes = Buffer.isBuffer(val)
          ? val
          : new Buffer(val, encoding)
        var len = bytes.length
        if (len === 0) {
          throw new TypeError('The value "' + val +
            '" is invalid for argument "value"')
        }
        for (i = 0; i < end - start; ++i) {
          this[i + start] = bytes[i % len]
        }
      }
    
      return this
    }
    
    // HELPER FUNCTIONS
    // ================
    
    var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g
    
    function base64clean (str) {
      // Node takes equal signs as end of the Base64 encoding
      str = str.split('=')[0]
      // Node strips out invalid characters like \n and \t from the string, base64-js does not
      str = str.trim().replace(INVALID_BASE64_RE, '')
      // Node converts strings with length < 2 to ''
      if (str.length < 2) return ''
      // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
      while (str.length % 4 !== 0) {
        str = str + '='
      }
      return str
    }
    
    function toHex (n) {
      if (n < 16) return '0' + n.toString(16)
      return n.toString(16)
    }
    
    function utf8ToBytes (string, units) {
      units = units || Infinity
      var codePoint
      var length = string.length
      var leadSurrogate = null
      var bytes = []
    
      for (var i = 0; i < length; ++i) {
        codePoint = string.charCodeAt(i)
    
        // is surrogate component
        if (codePoint > 0xD7FF && codePoint < 0xE000) {
          // last char was a lead
          if (!leadSurrogate) {
            // no lead yet
            if (codePoint > 0xDBFF) {
              // unexpected trail
              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
              continue
            } else if (i + 1 === length) {
              // unpaired lead
              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
              continue
            }
    
            // valid lead
            leadSurrogate = codePoint
    
            continue
          }
    
          // 2 leads in a row
          if (codePoint < 0xDC00) {
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
            leadSurrogate = codePoint
            continue
          }
    
          // valid surrogate pair
          codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
        } else if (leadSurrogate) {
          // valid bmp char, but last char was a lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        }
    
        leadSurrogate = null
    
        // encode utf8
        if (codePoint < 0x80) {
          if ((units -= 1) < 0) break
          bytes.push(codePoint)
        } else if (codePoint < 0x800) {
          if ((units -= 2) < 0) break
          bytes.push(
            codePoint >> 0x6 | 0xC0,
            codePoint & 0x3F | 0x80
          )
        } else if (codePoint < 0x10000) {
          if ((units -= 3) < 0) break
          bytes.push(
            codePoint >> 0xC | 0xE0,
            codePoint >> 0x6 & 0x3F | 0x80,
            codePoint & 0x3F | 0x80
          )
        } else if (codePoint < 0x110000) {
          if ((units -= 4) < 0) break
          bytes.push(
            codePoint >> 0x12 | 0xF0,
            codePoint >> 0xC & 0x3F | 0x80,
            codePoint >> 0x6 & 0x3F | 0x80,
            codePoint & 0x3F | 0x80
          )
        } else {
          throw new Error('Invalid code point')
        }
      }
    
      return bytes
    }
    
    function asciiToBytes (str) {
      var byteArray = []
      for (var i = 0; i < str.length; ++i) {
        // Node's code seems to be doing this and not & 0x7F..
        byteArray.push(str.charCodeAt(i) & 0xFF)
      }
      return byteArray
    }
    
    function utf16leToBytes (str, units) {
      var c, hi, lo
      var byteArray = []
      for (var i = 0; i < str.length; ++i) {
        if ((units -= 2) < 0) break
    
        c = str.charCodeAt(i)
        hi = c >> 8
        lo = c % 256
        byteArray.push(lo)
        byteArray.push(hi)
      }
    
      return byteArray
    }
    
    function base64ToBytes (str) {
      return base64.toByteArray(base64clean(str))
    }
    
    function blitBuffer (src, dst, offset, length) {
      for (var i = 0; i < length; ++i) {
        if ((i + offset >= dst.length) || (i >= src.length)) break
        dst[i + offset] = src[i]
      }
      return i
    }
    
    // ArrayBuffers from another context (i.e. an iframe) do not pass the `instanceof` check
    // but they should be treated as valid. See: https://github.com/feross/buffer/issues/166
    function isArrayBuffer (obj) {
      return obj instanceof ArrayBuffer ||
        (obj != null && obj.constructor != null && obj.constructor.name === 'ArrayBuffer' &&
          typeof obj.byteLength === 'number')
    }
    
    function numberIsNaN (obj) {
      return obj !== obj // eslint-disable-line no-self-compare
    }
    
    },{"base64-js":37,"ieee754":40}],39:[function(require,module,exports){
    
    /**
     * Expose `Emitter`.
     */
    
    if (typeof module !== 'undefined') {
      module.exports = Emitter;
    }
    
    /**
     * Initialize a new `Emitter`.
     *
     * @api public
     */
    
    function Emitter(obj) {
      if (obj) return mixin(obj);
    };
    
    /**
     * Mixin the emitter properties.
     *
     * @param {Object} obj
     * @return {Object}
     * @api private
     */
    
    function mixin(obj) {
      for (var key in Emitter.prototype) {
        obj[key] = Emitter.prototype[key];
      }
      return obj;
    }
    
    /**
     * Listen on the given `event` with `fn`.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */
    
    Emitter.prototype.on =
    Emitter.prototype.addEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};
      (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
        .push(fn);
      return this;
    };
    
    /**
     * Adds an `event` listener that will be invoked a single
     * time then automatically removed.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */
    
    Emitter.prototype.once = function(event, fn){
      function on() {
        this.off(event, on);
        fn.apply(this, arguments);
      }
    
      on.fn = fn;
      this.on(event, on);
      return this;
    };
    
    /**
     * Remove the given callback for `event` or all
     * registered callbacks.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */
    
    Emitter.prototype.off =
    Emitter.prototype.removeListener =
    Emitter.prototype.removeAllListeners =
    Emitter.prototype.removeEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};
    
      // all
      if (0 == arguments.length) {
        this._callbacks = {};
        return this;
      }
    
      // specific event
      var callbacks = this._callbacks['$' + event];
      if (!callbacks) return this;
    
      // remove all handlers
      if (1 == arguments.length) {
        delete this._callbacks['$' + event];
        return this;
      }
    
      // remove specific handler
      var cb;
      for (var i = 0; i < callbacks.length; i++) {
        cb = callbacks[i];
        if (cb === fn || cb.fn === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }
      return this;
    };
    
    /**
     * Emit `event` with the given args.
     *
     * @param {String} event
     * @param {Mixed} ...
     * @return {Emitter}
     */
    
    Emitter.prototype.emit = function(event){
      this._callbacks = this._callbacks || {};
      var args = [].slice.call(arguments, 1)
        , callbacks = this._callbacks['$' + event];
    
      if (callbacks) {
        callbacks = callbacks.slice(0);
        for (var i = 0, len = callbacks.length; i < len; ++i) {
          callbacks[i].apply(this, args);
        }
      }
    
      return this;
    };
    
    /**
     * Return array of callbacks for `event`.
     *
     * @param {String} event
     * @return {Array}
     * @api public
     */
    
    Emitter.prototype.listeners = function(event){
      this._callbacks = this._callbacks || {};
      return this._callbacks['$' + event] || [];
    };
    
    /**
     * Check if this emitter has `event` handlers.
     *
     * @param {String} event
     * @return {Boolean}
     * @api public
     */
    
    Emitter.prototype.hasListeners = function(event){
      return !! this.listeners(event).length;
    };
    
    },{}],40:[function(require,module,exports){
    exports.read = function (buffer, offset, isLE, mLen, nBytes) {
      var e, m
      var eLen = (nBytes * 8) - mLen - 1
      var eMax = (1 << eLen) - 1
      var eBias = eMax >> 1
      var nBits = -7
      var i = isLE ? (nBytes - 1) : 0
      var d = isLE ? -1 : 1
      var s = buffer[offset + i]
    
      i += d
    
      e = s & ((1 << (-nBits)) - 1)
      s >>= (-nBits)
      nBits += eLen
      for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}
    
      m = e & ((1 << (-nBits)) - 1)
      e >>= (-nBits)
      nBits += mLen
      for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}
    
      if (e === 0) {
        e = 1 - eBias
      } else if (e === eMax) {
        return m ? NaN : ((s ? -1 : 1) * Infinity)
      } else {
        m = m + Math.pow(2, mLen)
        e = e - eBias
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
    }
    
    exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c
      var eLen = (nBytes * 8) - mLen - 1
      var eMax = (1 << eLen) - 1
      var eBias = eMax >> 1
      var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
      var i = isLE ? 0 : (nBytes - 1)
      var d = isLE ? 1 : -1
      var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0
    
      value = Math.abs(value)
    
      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0
        e = eMax
      } else {
        e = Math.floor(Math.log(value) / Math.LN2)
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--
          c *= 2
        }
        if (e + eBias >= 1) {
          value += rt / c
        } else {
          value += rt * Math.pow(2, 1 - eBias)
        }
        if (value * c >= 2) {
          e++
          c /= 2
        }
    
        if (e + eBias >= eMax) {
          m = 0
          e = eMax
        } else if (e + eBias >= 1) {
          m = ((value * c) - 1) * Math.pow(2, mLen)
          e = e + eBias
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
          e = 0
        }
      }
    
      for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}
    
      e = (e << mLen) | m
      eLen += mLen
      for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}
    
      buffer[offset + i - d] |= s * 128
    }
    
    },{}],41:[function(require,module,exports){
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.
    
    'use strict';
    
    // If obj.hasOwnProperty has been overridden, then calling
    // obj.hasOwnProperty(prop) will break.
    // See: https://github.com/joyent/node/issues/1707
    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }
    
    module.exports = function(qs, sep, eq, options) {
      sep = sep || '&';
      eq = eq || '=';
      var obj = {};
    
      if (typeof qs !== 'string' || qs.length === 0) {
        return obj;
      }
    
      var regexp = /\+/g;
      qs = qs.split(sep);
    
      var maxKeys = 1000;
      if (options && typeof options.maxKeys === 'number') {
        maxKeys = options.maxKeys;
      }
    
      var len = qs.length;
      // maxKeys <= 0 means that we should not limit keys count
      if (maxKeys > 0 && len > maxKeys) {
        len = maxKeys;
      }
    
      for (var i = 0; i < len; ++i) {
        var x = qs[i].replace(regexp, '%20'),
            idx = x.indexOf(eq),
            kstr, vstr, k, v;
    
        if (idx >= 0) {
          kstr = x.substr(0, idx);
          vstr = x.substr(idx + 1);
        } else {
          kstr = x;
          vstr = '';
        }
    
        k = decodeURIComponent(kstr);
        v = decodeURIComponent(vstr);
    
        if (!hasOwnProperty(obj, k)) {
          obj[k] = v;
        } else if (isArray(obj[k])) {
          obj[k].push(v);
        } else {
          obj[k] = [obj[k], v];
        }
      }
    
      return obj;
    };
    
    var isArray = Array.isArray || function (xs) {
      return Object.prototype.toString.call(xs) === '[object Array]';
    };
    
    },{}],42:[function(require,module,exports){
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.
    
    'use strict';
    
    var stringifyPrimitive = function(v) {
      switch (typeof v) {
        case 'string':
          return v;
    
        case 'boolean':
          return v ? 'true' : 'false';
    
        case 'number':
          return isFinite(v) ? v : '';
    
        default:
          return '';
      }
    };
    
    module.exports = function(obj, sep, eq, name) {
      sep = sep || '&';
      eq = eq || '=';
      if (obj === null) {
        obj = undefined;
      }
    
      if (typeof obj === 'object') {
        return map(objectKeys(obj), function(k) {
          var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
          if (isArray(obj[k])) {
            return map(obj[k], function(v) {
              return ks + encodeURIComponent(stringifyPrimitive(v));
            }).join(sep);
          } else {
            return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
          }
        }).join(sep);
    
      }
    
      if (!name) return '';
      return encodeURIComponent(stringifyPrimitive(name)) + eq +
             encodeURIComponent(stringifyPrimitive(obj));
    };
    
    var isArray = Array.isArray || function (xs) {
      return Object.prototype.toString.call(xs) === '[object Array]';
    };
    
    function map (xs, f) {
      if (xs.map) return xs.map(f);
      var res = [];
      for (var i = 0; i < xs.length; i++) {
        res.push(f(xs[i], i));
      }
      return res;
    }
    
    var objectKeys = Object.keys || function (obj) {
      var res = [];
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
      }
      return res;
    };
    
    },{}],43:[function(require,module,exports){
    'use strict';
    
    exports.decode = exports.parse = require('./decode');
    exports.encode = exports.stringify = require('./encode');
    
    },{"./decode":41,"./encode":42}],44:[function(require,module,exports){
    function Agent() {
      this._defaults = [];
    }
    
    ["use", "on", "once", "set", "query", "type", "accept", "auth", "withCredentials", "sortQuery", "retry", "ok", "redirects",
     "timeout", "buffer", "serialize", "parse", "ca", "key", "pfx", "cert"].forEach(function(fn) {
      /** Default setting for all requests from this agent */
      Agent.prototype[fn] = function(/*varargs*/) {
        this._defaults.push({fn:fn, arguments:arguments});
        return this;
      }
    });
    
    Agent.prototype._setDefaults = function(req) {
        this._defaults.forEach(function(def) {
          req[def.fn].apply(req, def.arguments);
        });
    };
    
    module.exports = Agent;
    
    },{}],45:[function(require,module,exports){
    /**
     * Root reference for iframes.
     */
    
    var root;
    if (typeof window !== 'undefined') { // Browser window
      root = window;
    } else if (typeof self !== 'undefined') { // Web Worker
      root = self;
    } else { // Other environments
      console.warn("Using browser-only version of superagent in non-browser environment");
      root = this;
    }
    
    var Emitter = require('component-emitter');
    var RequestBase = require('./request-base');
    var isObject = require('./is-object');
    var ResponseBase = require('./response-base');
    var Agent = require('./agent-base');
    
    /**
     * Noop.
     */
    
    function noop(){};
    
    /**
     * Expose `request`.
     */
    
    var request = exports = module.exports = function(method, url) {
      // callback
      if ('function' == typeof url) {
        return new exports.Request('GET', method).end(url);
      }
    
      // url first
      if (1 == arguments.length) {
        return new exports.Request('GET', method);
      }
    
      return new exports.Request(method, url);
    }
    
    exports.Request = Request;
    
    /**
     * Determine XHR.
     */
    
    request.getXHR = function () {
      if (root.XMLHttpRequest
          && (!root.location || 'file:' != root.location.protocol
              || !root.ActiveXObject)) {
        return new XMLHttpRequest;
      } else {
        try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
        try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
        try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
        try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
      }
      throw Error("Browser-only version of superagent could not find XHR");
    };
    
    /**
     * Removes leading and trailing whitespace, added to support IE.
     *
     * @param {String} s
     * @return {String}
     * @api private
     */
    
    var trim = ''.trim
      ? function(s) { return s.trim(); }
      : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };
    
    /**
     * Serialize the given `obj`.
     *
     * @param {Object} obj
     * @return {String}
     * @api private
     */
    
    function serialize(obj) {
      if (!isObject(obj)) return obj;
      var pairs = [];
      for (var key in obj) {
        pushEncodedKeyValuePair(pairs, key, obj[key]);
      }
      return pairs.join('&');
    }
    
    /**
     * Helps 'serialize' with serializing arrays.
     * Mutates the pairs array.
     *
     * @param {Array} pairs
     * @param {String} key
     * @param {Mixed} val
     */
    
    function pushEncodedKeyValuePair(pairs, key, val) {
      if (val != null) {
        if (Array.isArray(val)) {
          val.forEach(function(v) {
            pushEncodedKeyValuePair(pairs, key, v);
          });
        } else if (isObject(val)) {
          for(var subkey in val) {
            pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
          }
        } else {
          pairs.push(encodeURIComponent(key)
            + '=' + encodeURIComponent(val));
        }
      } else if (val === null) {
        pairs.push(encodeURIComponent(key));
      }
    }
    
    /**
     * Expose serialization method.
     */
    
    request.serializeObject = serialize;
    
    /**
      * Parse the given x-www-form-urlencoded `str`.
      *
      * @param {String} str
      * @return {Object}
      * @api private
      */
    
    function parseString(str) {
      var obj = {};
      var pairs = str.split('&');
      var pair;
      var pos;
    
      for (var i = 0, len = pairs.length; i < len; ++i) {
        pair = pairs[i];
        pos = pair.indexOf('=');
        if (pos == -1) {
          obj[decodeURIComponent(pair)] = '';
        } else {
          obj[decodeURIComponent(pair.slice(0, pos))] =
            decodeURIComponent(pair.slice(pos + 1));
        }
      }
    
      return obj;
    }
    
    /**
     * Expose parser.
     */
    
    request.parseString = parseString;
    
    /**
     * Default MIME type map.
     *
     *     superagent.types.xml = 'application/xml';
     *
     */
    
    request.types = {
      html: 'text/html',
      json: 'application/json',
      xml: 'text/xml',
      urlencoded: 'application/x-www-form-urlencoded',
      'form': 'application/x-www-form-urlencoded',
      'form-data': 'application/x-www-form-urlencoded'
    };
    
    /**
     * Default serialization map.
     *
     *     superagent.serialize['application/xml'] = function(obj){
     *       return 'generated xml here';
     *     };
     *
     */
    
    request.serialize = {
      'application/x-www-form-urlencoded': serialize,
      'application/json': JSON.stringify
    };
    
    /**
      * Default parsers.
      *
      *     superagent.parse['application/xml'] = function(str){
      *       return { object parsed from str };
      *     };
      *
      */
    
    request.parse = {
      'application/x-www-form-urlencoded': parseString,
      'application/json': JSON.parse
    };
    
    /**
     * Parse the given header `str` into
     * an object containing the mapped fields.
     *
     * @param {String} str
     * @return {Object}
     * @api private
     */
    
    function parseHeader(str) {
      var lines = str.split(/\r?\n/);
      var fields = {};
      var index;
      var line;
      var field;
      var val;
    
      for (var i = 0, len = lines.length; i < len; ++i) {
        line = lines[i];
        index = line.indexOf(':');
        if (index === -1) { // could be empty line, just skip it
          continue;
        }
        field = line.slice(0, index).toLowerCase();
        val = trim(line.slice(index + 1));
        fields[field] = val;
      }
    
      return fields;
    }
    
    /**
     * Check if `mime` is json or has +json structured syntax suffix.
     *
     * @param {String} mime
     * @return {Boolean}
     * @api private
     */
    
    function isJSON(mime) {
      // should match /json or +json
      // but not /json-seq
      return /[\/+]json($|[^-\w])/.test(mime);
    }
    
    /**
     * Initialize a new `Response` with the given `xhr`.
     *
     *  - set flags (.ok, .error, etc)
     *  - parse header
     *
     * Examples:
     *
     *  Aliasing `superagent` as `request` is nice:
     *
     *      request = superagent;
     *
     *  We can use the promise-like API, or pass callbacks:
     *
     *      request.get('/').end(function(res){});
     *      request.get('/', function(res){});
     *
     *  Sending data can be chained:
     *
     *      request
     *        .post('/user')
     *        .send({ name: 'tj' })
     *        .end(function(res){});
     *
     *  Or passed to `.send()`:
     *
     *      request
     *        .post('/user')
     *        .send({ name: 'tj' }, function(res){});
     *
     *  Or passed to `.post()`:
     *
     *      request
     *        .post('/user', { name: 'tj' })
     *        .end(function(res){});
     *
     * Or further reduced to a single call for simple cases:
     *
     *      request
     *        .post('/user', { name: 'tj' }, function(res){});
     *
     * @param {XMLHTTPRequest} xhr
     * @param {Object} options
     * @api private
     */
    
    function Response(req) {
      this.req = req;
      this.xhr = this.req.xhr;
      // responseText is accessible only if responseType is '' or 'text' and on older browsers
      this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
         ? this.xhr.responseText
         : null;
      this.statusText = this.req.xhr.statusText;
      var status = this.xhr.status;
      // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
      if (status === 1223) {
        status = 204;
      }
      this._setStatusProperties(status);
      this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
      // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
      // getResponseHeader still works. so we get content-type even if getting
      // other headers fails.
      this.header['content-type'] = this.xhr.getResponseHeader('content-type');
      this._setHeaderProperties(this.header);
    
      if (null === this.text && req._responseType) {
        this.body = this.xhr.response;
      } else {
        this.body = this.req.method != 'HEAD'
          ? this._parseBody(this.text ? this.text : this.xhr.response)
          : null;
      }
    }
    
    ResponseBase(Response.prototype);
    
    /**
     * Parse the given body `str`.
     *
     * Used for auto-parsing of bodies. Parsers
     * are defined on the `superagent.parse` object.
     *
     * @param {String} str
     * @return {Mixed}
     * @api private
     */
    
    Response.prototype._parseBody = function(str) {
      var parse = request.parse[this.type];
      if (this.req._parser) {
        return this.req._parser(this, str);
      }
      if (!parse && isJSON(this.type)) {
        parse = request.parse['application/json'];
      }
      return parse && str && (str.length || str instanceof Object)
        ? parse(str)
        : null;
    };
    
    /**
     * Return an `Error` representative of this response.
     *
     * @return {Error}
     * @api public
     */
    
    Response.prototype.toError = function(){
      var req = this.req;
      var method = req.method;
      var url = req.url;
    
      var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
      var err = new Error(msg);
      err.status = this.status;
      err.method = method;
      err.url = url;
    
      return err;
    };
    
    /**
     * Expose `Response`.
     */
    
    request.Response = Response;
    
    /**
     * Initialize a new `Request` with the given `method` and `url`.
     *
     * @param {String} method
     * @param {String} url
     * @api public
     */
    
    function Request(method, url) {
      var self = this;
      this._query = this._query || [];
      this.method = method;
      this.url = url;
      this.header = {}; // preserves header name case
      this._header = {}; // coerces header names to lowercase
      this.on('end', function(){
        var err = null;
        var res = null;
    
        try {
          res = new Response(self);
        } catch(e) {
          err = new Error('Parser is unable to parse the response');
          err.parse = true;
          err.original = e;
          // issue #675: return the raw response if the response parsing fails
          if (self.xhr) {
            // ie9 doesn't have 'response' property
            err.rawResponse = typeof self.xhr.responseType == 'undefined' ? self.xhr.responseText : self.xhr.response;
            // issue #876: return the http status code if the response parsing fails
            err.status = self.xhr.status ? self.xhr.status : null;
            err.statusCode = err.status; // backwards-compat only
          } else {
            err.rawResponse = null;
            err.status = null;
          }
    
          return self.callback(err);
        }
    
        self.emit('response', res);
    
        var new_err;
        try {
          if (!self._isResponseOK(res)) {
            new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
          }
        } catch(custom_err) {
          new_err = custom_err; // ok() callback can throw
        }
    
        // #1000 don't catch errors from the callback to avoid double calling it
        if (new_err) {
          new_err.original = err;
          new_err.response = res;
          new_err.status = res.status;
          self.callback(new_err, res);
        } else {
          self.callback(null, res);
        }
      });
    }
    
    /**
     * Mixin `Emitter` and `RequestBase`.
     */
    
    Emitter(Request.prototype);
    RequestBase(Request.prototype);
    
    /**
     * Set Content-Type to `type`, mapping values from `request.types`.
     *
     * Examples:
     *
     *      superagent.types.xml = 'application/xml';
     *
     *      request.post('/')
     *        .type('xml')
     *        .send(xmlstring)
     *        .end(callback);
     *
     *      request.post('/')
     *        .type('application/xml')
     *        .send(xmlstring)
     *        .end(callback);
     *
     * @param {String} type
     * @return {Request} for chaining
     * @api public
     */
    
    Request.prototype.type = function(type){
      this.set('Content-Type', request.types[type] || type);
      return this;
    };
    
    /**
     * Set Accept to `type`, mapping values from `request.types`.
     *
     * Examples:
     *
     *      superagent.types.json = 'application/json';
     *
     *      request.get('/agent')
     *        .accept('json')
     *        .end(callback);
     *
     *      request.get('/agent')
     *        .accept('application/json')
     *        .end(callback);
     *
     * @param {String} accept
     * @return {Request} for chaining
     * @api public
     */
    
    Request.prototype.accept = function(type){
      this.set('Accept', request.types[type] || type);
      return this;
    };
    
    /**
     * Set Authorization field value with `user` and `pass`.
     *
     * @param {String} user
     * @param {String} [pass] optional in case of using 'bearer' as type
     * @param {Object} options with 'type' property 'auto', 'basic' or 'bearer' (default 'basic')
     * @return {Request} for chaining
     * @api public
     */
    
    Request.prototype.auth = function(user, pass, options){
      if (1 === arguments.length) pass = '';
      if (typeof pass === 'object' && pass !== null) { // pass is optional and can be replaced with options
        options = pass;
        pass = '';
      }
      if (!options) {
        options = {
          type: 'function' === typeof btoa ? 'basic' : 'auto',
        };
      }
    
      var encoder = function(string) {
        if ('function' === typeof btoa) {
          return btoa(string);
        }
        throw new Error('Cannot use basic auth, btoa is not a function');
      };
    
      return this._auth(user, pass, options, encoder);
    };
    
    /**
     * Add query-string `val`.
     *
     * Examples:
     *
     *   request.get('/shoes')
     *     .query('size=10')
     *     .query({ color: 'blue' })
     *
     * @param {Object|String} val
     * @return {Request} for chaining
     * @api public
     */
    
    Request.prototype.query = function(val){
      if ('string' != typeof val) val = serialize(val);
      if (val) this._query.push(val);
      return this;
    };
    
    /**
     * Queue the given `file` as an attachment to the specified `field`,
     * with optional `options` (or filename).
     *
     * ``` js
     * request.post('/upload')
     *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
     *   .end(callback);
     * ```
     *
     * @param {String} field
     * @param {Blob|File} file
     * @param {String|Object} options
     * @return {Request} for chaining
     * @api public
     */
    
    Request.prototype.attach = function(field, file, options){
      if (file) {
        if (this._data) {
          throw Error("superagent can't mix .send() and .attach()");
        }
    
        this._getFormData().append(field, file, options || file.name);
      }
      return this;
    };
    
    Request.prototype._getFormData = function(){
      if (!this._formData) {
        this._formData = new root.FormData();
      }
      return this._formData;
    };
    
    /**
     * Invoke the callback with `err` and `res`
     * and handle arity check.
     *
     * @param {Error} err
     * @param {Response} res
     * @api private
     */
    
    Request.prototype.callback = function(err, res){
      if (this._shouldRetry(err, res)) {
        return this._retry();
      }
    
      var fn = this._callback;
      this.clearTimeout();
    
      if (err) {
        if (this._maxRetries) err.retries = this._retries - 1;
        this.emit('error', err);
      }
    
      fn(err, res);
    };
    
    /**
     * Invoke callback with x-domain error.
     *
     * @api private
     */
    
    Request.prototype.crossDomainError = function(){
      var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
      err.crossDomain = true;
    
      err.status = this.status;
      err.method = this.method;
      err.url = this.url;
    
      this.callback(err);
    };
    
    // This only warns, because the request is still likely to work
    Request.prototype.buffer = Request.prototype.ca = Request.prototype.agent = function(){
      console.warn("This is not supported in browser version of superagent");
      return this;
    };
    
    // This throws, because it can't send/receive data as expected
    Request.prototype.pipe = Request.prototype.write = function(){
      throw Error("Streaming is not supported in browser version of superagent");
    };
    
    /**
     * Check if `obj` is a host object,
     * we don't want to serialize these :)
     *
     * @param {Object} obj
     * @return {Boolean}
     * @api private
     */
    Request.prototype._isHost = function _isHost(obj) {
      // Native objects stringify to [object File], [object Blob], [object FormData], etc.
      return obj && 'object' === typeof obj && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== '[object Object]';
    }
    
    /**
     * Initiate request, invoking callback `fn(res)`
     * with an instanceof `Response`.
     *
     * @param {Function} fn
     * @return {Request} for chaining
     * @api public
     */
    
    Request.prototype.end = function(fn){
      if (this._endCalled) {
        console.warn("Warning: .end() was called twice. This is not supported in superagent");
      }
      this._endCalled = true;
    
      // store callback
      this._callback = fn || noop;
    
      // querystring
      this._finalizeQueryString();
    
      return this._end();
    };
    
    Request.prototype._end = function() {
      var self = this;
      var xhr = (this.xhr = request.getXHR());
      var data = this._formData || this._data;
    
      this._setTimeouts();
    
      // state change
      xhr.onreadystatechange = function(){
        var readyState = xhr.readyState;
        if (readyState >= 2 && self._responseTimeoutTimer) {
          clearTimeout(self._responseTimeoutTimer);
        }
        if (4 != readyState) {
          return;
        }
    
        // In IE9, reads to any property (e.g. status) off of an aborted XHR will
        // result in the error "Could not complete the operation due to error c00c023f"
        var status;
        try { status = xhr.status } catch(e) { status = 0; }
    
        if (!status) {
          if (self.timedout || self._aborted) return;
          return self.crossDomainError();
        }
        self.emit('end');
      };
    
      // progress
      var handleProgress = function(direction, e) {
        if (e.total > 0) {
          e.percent = e.loaded / e.total * 100;
        }
        e.direction = direction;
        self.emit('progress', e);
      };
      if (this.hasListeners('progress')) {
        try {
          xhr.onprogress = handleProgress.bind(null, 'download');
          if (xhr.upload) {
            xhr.upload.onprogress = handleProgress.bind(null, 'upload');
          }
        } catch(e) {
          // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
          // Reported here:
          // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
        }
      }
    
      // initiate request
      try {
        if (this.username && this.password) {
          xhr.open(this.method, this.url, true, this.username, this.password);
        } else {
          xhr.open(this.method, this.url, true);
        }
      } catch (err) {
        // see #1149
        return this.callback(err);
      }
    
      // CORS
      if (this._withCredentials) xhr.withCredentials = true;
    
      // body
      if (!this._formData && 'GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
        // serialize stuff
        var contentType = this._header['content-type'];
        var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
        if (!serialize && isJSON(contentType)) {
          serialize = request.serialize['application/json'];
        }
        if (serialize) data = serialize(data);
      }
    
      // set header fields
      for (var field in this.header) {
        if (null == this.header[field]) continue;
    
        if (this.header.hasOwnProperty(field))
          xhr.setRequestHeader(field, this.header[field]);
      }
    
      if (this._responseType) {
        xhr.responseType = this._responseType;
      }
    
      // send stuff
      this.emit('request', this);
    
      // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
      // We need null here if data is undefined
      xhr.send(typeof data !== 'undefined' ? data : null);
      return this;
    };
    
    request.agent = function() {
      return new Agent();
    };
    
    ["GET", "POST", "OPTIONS", "PATCH", "PUT", "DELETE"].forEach(function(method) {
      Agent.prototype[method.toLowerCase()] = function(url, fn) {
        var req = new request.Request(method, url);
        this._setDefaults(req);
        if (fn) {
          req.end(fn);
        }
        return req;
      };
    });
    
    Agent.prototype.del = Agent.prototype['delete'];
    
    /**
     * GET `url` with optional callback `fn(res)`.
     *
     * @param {String} url
     * @param {Mixed|Function} [data] or fn
     * @param {Function} [fn]
     * @return {Request}
     * @api public
     */
    
    request.get = function(url, data, fn) {
      var req = request('GET', url);
      if ('function' == typeof data) (fn = data), (data = null);
      if (data) req.query(data);
      if (fn) req.end(fn);
      return req;
    };
    
    /**
     * HEAD `url` with optional callback `fn(res)`.
     *
     * @param {String} url
     * @param {Mixed|Function} [data] or fn
     * @param {Function} [fn]
     * @return {Request}
     * @api public
     */
    
    request.head = function(url, data, fn) {
      var req = request('HEAD', url);
      if ('function' == typeof data) (fn = data), (data = null);
      if (data) req.query(data);
      if (fn) req.end(fn);
      return req;
    };
    
    /**
     * OPTIONS query to `url` with optional callback `fn(res)`.
     *
     * @param {String} url
     * @param {Mixed|Function} [data] or fn
     * @param {Function} [fn]
     * @return {Request}
     * @api public
     */
    
    request.options = function(url, data, fn) {
      var req = request('OPTIONS', url);
      if ('function' == typeof data) (fn = data), (data = null);
      if (data) req.send(data);
      if (fn) req.end(fn);
      return req;
    };
    
    /**
     * DELETE `url` with optional `data` and callback `fn(res)`.
     *
     * @param {String} url
     * @param {Mixed} [data]
     * @param {Function} [fn]
     * @return {Request}
     * @api public
     */
    
    function del(url, data, fn) {
      var req = request('DELETE', url);
      if ('function' == typeof data) (fn = data), (data = null);
      if (data) req.send(data);
      if (fn) req.end(fn);
      return req;
    }
    
    request['del'] = del;
    request['delete'] = del;
    
    /**
     * PATCH `url` with optional `data` and callback `fn(res)`.
     *
     * @param {String} url
     * @param {Mixed} [data]
     * @param {Function} [fn]
     * @return {Request}
     * @api public
     */
    
    request.patch = function(url, data, fn) {
      var req = request('PATCH', url);
      if ('function' == typeof data) (fn = data), (data = null);
      if (data) req.send(data);
      if (fn) req.end(fn);
      return req;
    };
    
    /**
     * POST `url` with optional `data` and callback `fn(res)`.
     *
     * @param {String} url
     * @param {Mixed} [data]
     * @param {Function} [fn]
     * @return {Request}
     * @api public
     */
    
    request.post = function(url, data, fn) {
      var req = request('POST', url);
      if ('function' == typeof data) (fn = data), (data = null);
      if (data) req.send(data);
      if (fn) req.end(fn);
      return req;
    };
    
    /**
     * PUT `url` with optional `data` and callback `fn(res)`.
     *
     * @param {String} url
     * @param {Mixed|Function} [data] or fn
     * @param {Function} [fn]
     * @return {Request}
     * @api public
     */
    
    request.put = function(url, data, fn) {
      var req = request('PUT', url);
      if ('function' == typeof data) (fn = data), (data = null);
      if (data) req.send(data);
      if (fn) req.end(fn);
      return req;
    };
    
    },{"./agent-base":44,"./is-object":46,"./request-base":47,"./response-base":48,"component-emitter":39}],46:[function(require,module,exports){
    'use strict';
    
    /**
     * Check if `obj` is an object.
     *
     * @param {Object} obj
     * @return {Boolean}
     * @api private
     */
    
    function isObject(obj) {
      return null !== obj && 'object' === typeof obj;
    }
    
    module.exports = isObject;
    
    },{}],47:[function(require,module,exports){
    'use strict';
    
    /**
     * Module of mixed-in functions shared between node and client code
     */
    var isObject = require('./is-object');
    
    /**
     * Expose `RequestBase`.
     */
    
    module.exports = RequestBase;
    
    /**
     * Initialize a new `RequestBase`.
     *
     * @api public
     */
    
    function RequestBase(obj) {
      if (obj) return mixin(obj);
    }
    
    /**
     * Mixin the prototype properties.
     *
     * @param {Object} obj
     * @return {Object}
     * @api private
     */
    
    function mixin(obj) {
      for (var key in RequestBase.prototype) {
        obj[key] = RequestBase.prototype[key];
      }
      return obj;
    }
    
    /**
     * Clear previous timeout.
     *
     * @return {Request} for chaining
     * @api public
     */
    
    RequestBase.prototype.clearTimeout = function _clearTimeout(){
      clearTimeout(this._timer);
      clearTimeout(this._responseTimeoutTimer);
      delete this._timer;
      delete this._responseTimeoutTimer;
      return this;
    };
    
    /**
     * Override default response body parser
     *
     * This function will be called to convert incoming data into request.body
     *
     * @param {Function}
     * @api public
     */
    
    RequestBase.prototype.parse = function parse(fn){
      this._parser = fn;
      return this;
    };
    
    /**
     * Set format of binary response body.
     * In browser valid formats are 'blob' and 'arraybuffer',
     * which return Blob and ArrayBuffer, respectively.
     *
     * In Node all values result in Buffer.
     *
     * Examples:
     *
     *      req.get('/')
     *        .responseType('blob')
     *        .end(callback);
     *
     * @param {String} val
     * @return {Request} for chaining
     * @api public
     */
    
    RequestBase.prototype.responseType = function(val){
      this._responseType = val;
      return this;
    };
    
    /**
     * Override default request body serializer
     *
     * This function will be called to convert data set via .send or .attach into payload to send
     *
     * @param {Function}
     * @api public
     */
    
    RequestBase.prototype.serialize = function serialize(fn){
      this._serializer = fn;
      return this;
    };
    
    /**
     * Set timeouts.
     *
     * - response timeout is time between sending request and receiving the first byte of the response. Includes DNS and connection time.
     * - deadline is the time from start of the request to receiving response body in full. If the deadline is too short large files may not load at all on slow connections.
     *
     * Value of 0 or false means no timeout.
     *
     * @param {Number|Object} ms or {response, deadline}
     * @return {Request} for chaining
     * @api public
     */
    
    RequestBase.prototype.timeout = function timeout(options){
      if (!options || 'object' !== typeof options) {
        this._timeout = options;
        this._responseTimeout = 0;
        return this;
      }
    
      for(var option in options) {
        switch(option) {
          case 'deadline':
            this._timeout = options.deadline;
            break;
          case 'response':
            this._responseTimeout = options.response;
            break;
          default:
            console.warn("Unknown timeout option", option);
        }
      }
      return this;
    };
    
    /**
     * Set number of retry attempts on error.
     *
     * Failed requests will be retried 'count' times if timeout or err.code >= 500.
     *
     * @param {Number} count
     * @param {Function} [fn]
     * @return {Request} for chaining
     * @api public
     */
    
    RequestBase.prototype.retry = function retry(count, fn){
      // Default to 1 if no count passed or true
      if (arguments.length === 0 || count === true) count = 1;
      if (count <= 0) count = 0;
      this._maxRetries = count;
      this._retries = 0;
      this._retryCallback = fn;
      return this;
    };
    
    var ERROR_CODES = [
      'ECONNRESET',
      'ETIMEDOUT',
      'EADDRINFO',
      'ESOCKETTIMEDOUT'
    ];
    
    /**
     * Determine if a request should be retried.
     * (Borrowed from segmentio/superagent-retry)
     *
     * @param {Error} err
     * @param {Response} [res]
     * @returns {Boolean}
     */
    RequestBase.prototype._shouldRetry = function(err, res) {
      if (!this._maxRetries || this._retries++ >= this._maxRetries) {
        return false;
      }
      if (this._retryCallback) {
        try {
          var override = this._retryCallback(err, res);
          if (override === true) return true;
          if (override === false) return false;
          // undefined falls back to defaults
        } catch(e) {
          console.error(e);
        }
      }
      if (res && res.status && res.status >= 500 && res.status != 501) return true;
      if (err) {
        if (err.code && ~ERROR_CODES.indexOf(err.code)) return true;
        // Superagent timeout
        if (err.timeout && err.code == 'ECONNABORTED') return true;
        if (err.crossDomain) return true;
      }
      return false;
    };
    
    /**
     * Retry request
     *
     * @return {Request} for chaining
     * @api private
     */
    
    RequestBase.prototype._retry = function() {
    
      this.clearTimeout();
    
      // node
      if (this.req) {
        this.req = null;
        this.req = this.request();
      }
    
      this._aborted = false;
      this.timedout = false;
    
      return this._end();
    };
    
    /**
     * Promise support
     *
     * @param {Function} resolve
     * @param {Function} [reject]
     * @return {Request}
     */
    
    RequestBase.prototype.then = function then(resolve, reject) {
      if (!this._fullfilledPromise) {
        var self = this;
        if (this._endCalled) {
          console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises");
        }
        this._fullfilledPromise = new Promise(function(innerResolve, innerReject) {
          self.end(function(err, res) {
            if (err) innerReject(err);
            else innerResolve(res);
          });
        });
      }
      return this._fullfilledPromise.then(resolve, reject);
    };
    
    RequestBase.prototype['catch'] = function(cb) {
      return this.then(undefined, cb);
    };
    
    /**
     * Allow for extension
     */
    
    RequestBase.prototype.use = function use(fn) {
      fn(this);
      return this;
    };
    
    RequestBase.prototype.ok = function(cb) {
      if ('function' !== typeof cb) throw Error("Callback required");
      this._okCallback = cb;
      return this;
    };
    
    RequestBase.prototype._isResponseOK = function(res) {
      if (!res) {
        return false;
      }
    
      if (this._okCallback) {
        return this._okCallback(res);
      }
    
      return res.status >= 200 && res.status < 300;
    };
    
    /**
     * Get request header `field`.
     * Case-insensitive.
     *
     * @param {String} field
     * @return {String}
     * @api public
     */
    
    RequestBase.prototype.get = function(field){
      return this._header[field.toLowerCase()];
    };
    
    /**
     * Get case-insensitive header `field` value.
     * This is a deprecated internal API. Use `.get(field)` instead.
     *
     * (getHeader is no longer used internally by the superagent code base)
     *
     * @param {String} field
     * @return {String}
     * @api private
     * @deprecated
     */
    
    RequestBase.prototype.getHeader = RequestBase.prototype.get;
    
    /**
     * Set header `field` to `val`, or multiple fields with one object.
     * Case-insensitive.
     *
     * Examples:
     *
     *      req.get('/')
     *        .set('Accept', 'application/json')
     *        .set('X-API-Key', 'foobar')
     *        .end(callback);
     *
     *      req.get('/')
     *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
     *        .end(callback);
     *
     * @param {String|Object} field
     * @param {String} val
     * @return {Request} for chaining
     * @api public
     */
    
    RequestBase.prototype.set = function(field, val){
      if (isObject(field)) {
        for (var key in field) {
          this.set(key, field[key]);
        }
        return this;
      }
      this._header[field.toLowerCase()] = val;
      this.header[field] = val;
      return this;
    };
    
    /**
     * Remove header `field`.
     * Case-insensitive.
     *
     * Example:
     *
     *      req.get('/')
     *        .unset('User-Agent')
     *        .end(callback);
     *
     * @param {String} field
     */
    RequestBase.prototype.unset = function(field){
      delete this._header[field.toLowerCase()];
      delete this.header[field];
      return this;
    };
    
    /**
     * Write the field `name` and `val`, or multiple fields with one object
     * for "multipart/form-data" request bodies.
     *
     * ``` js
     * request.post('/upload')
     *   .field('foo', 'bar')
     *   .end(callback);
     *
     * request.post('/upload')
     *   .field({ foo: 'bar', baz: 'qux' })
     *   .end(callback);
     * ```
     *
     * @param {String|Object} name
     * @param {String|Blob|File|Buffer|fs.ReadStream} val
     * @return {Request} for chaining
     * @api public
     */
    RequestBase.prototype.field = function(name, val) {
      // name should be either a string or an object.
      if (null === name || undefined === name) {
        throw new Error('.field(name, val) name can not be empty');
      }
    
      if (this._data) {
        console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
      }
    
      if (isObject(name)) {
        for (var key in name) {
          this.field(key, name[key]);
        }
        return this;
      }
    
      if (Array.isArray(val)) {
        for (var i in val) {
          this.field(name, val[i]);
        }
        return this;
      }
    
      // val should be defined now
      if (null === val || undefined === val) {
        throw new Error('.field(name, val) val can not be empty');
      }
      if ('boolean' === typeof val) {
        val = '' + val;
      }
      this._getFormData().append(name, val);
      return this;
    };
    
    /**
     * Abort the request, and clear potential timeout.
     *
     * @return {Request}
     * @api public
     */
    RequestBase.prototype.abort = function(){
      if (this._aborted) {
        return this;
      }
      this._aborted = true;
      this.xhr && this.xhr.abort(); // browser
      this.req && this.req.abort(); // node
      this.clearTimeout();
      this.emit('abort');
      return this;
    };
    
    RequestBase.prototype._auth = function(user, pass, options, base64Encoder) {
      switch (options.type) {
        case 'basic':
          this.set('Authorization', 'Basic ' + base64Encoder(user + ':' + pass));
          break;
    
        case 'auto':
          this.username = user;
          this.password = pass;
          break;
    
        case 'bearer': // usage would be .auth(accessToken, { type: 'bearer' })
          this.set('Authorization', 'Bearer ' + user);
          break;
      }
      return this;
    };
    
    /**
     * Enable transmission of cookies with x-domain requests.
     *
     * Note that for this to work the origin must not be
     * using "Access-Control-Allow-Origin" with a wildcard,
     * and also must set "Access-Control-Allow-Credentials"
     * to "true".
     *
     * @api public
     */
    
    RequestBase.prototype.withCredentials = function(on) {
      // This is browser-only functionality. Node side is no-op.
      if (on == undefined) on = true;
      this._withCredentials = on;
      return this;
    };
    
    /**
     * Set the max redirects to `n`. Does noting in browser XHR implementation.
     *
     * @param {Number} n
     * @return {Request} for chaining
     * @api public
     */
    
    RequestBase.prototype.redirects = function(n){
      this._maxRedirects = n;
      return this;
    };
    
    /**
     * Maximum size of buffered response body, in bytes. Counts uncompressed size.
     * Default 200MB.
     *
     * @param {Number} n
     * @return {Request} for chaining
     */
    RequestBase.prototype.maxResponseSize = function(n){
      if ('number' !== typeof n) {
        throw TypeError("Invalid argument");
      }
      this._maxResponseSize = n;
      return this;
    };
    
    /**
     * Convert to a plain javascript object (not JSON string) of scalar properties.
     * Note as this method is designed to return a useful non-this value,
     * it cannot be chained.
     *
     * @return {Object} describing method, url, and data of this request
     * @api public
     */
    
    RequestBase.prototype.toJSON = function() {
      return {
        method: this.method,
        url: this.url,
        data: this._data,
        headers: this._header,
      };
    };
    
    /**
     * Send `data` as the request body, defaulting the `.type()` to "json" when
     * an object is given.
     *
     * Examples:
     *
     *       // manual json
     *       request.post('/user')
     *         .type('json')
     *         .send('{"name":"tj"}')
     *         .end(callback)
     *
     *       // auto json
     *       request.post('/user')
     *         .send({ name: 'tj' })
     *         .end(callback)
     *
     *       // manual x-www-form-urlencoded
     *       request.post('/user')
     *         .type('form')
     *         .send('name=tj')
     *         .end(callback)
     *
     *       // auto x-www-form-urlencoded
     *       request.post('/user')
     *         .type('form')
     *         .send({ name: 'tj' })
     *         .end(callback)
     *
     *       // defaults to x-www-form-urlencoded
     *      request.post('/user')
     *        .send('name=tobi')
     *        .send('species=ferret')
     *        .end(callback)
     *
     * @param {String|Object} data
     * @return {Request} for chaining
     * @api public
     */
    
    RequestBase.prototype.send = function(data){
      var isObj = isObject(data);
      var type = this._header['content-type'];
    
      if (this._formData) {
        console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
      }
    
      if (isObj && !this._data) {
        if (Array.isArray(data)) {
          this._data = [];
        } else if (!this._isHost(data)) {
          this._data = {};
        }
      } else if (data && this._data && this._isHost(this._data)) {
        throw Error("Can't merge these send calls");
      }
    
      // merge
      if (isObj && isObject(this._data)) {
        for (var key in data) {
          this._data[key] = data[key];
        }
      } else if ('string' == typeof data) {
        // default to x-www-form-urlencoded
        if (!type) this.type('form');
        type = this._header['content-type'];
        if ('application/x-www-form-urlencoded' == type) {
          this._data = this._data
            ? this._data + '&' + data
            : data;
        } else {
          this._data = (this._data || '') + data;
        }
      } else {
        this._data = data;
      }
    
      if (!isObj || this._isHost(data)) {
        return this;
      }
    
      // default to json
      if (!type) this.type('json');
      return this;
    };
    
    /**
     * Sort `querystring` by the sort function
     *
     *
     * Examples:
     *
     *       // default order
     *       request.get('/user')
     *         .query('name=Nick')
     *         .query('search=Manny')
     *         .sortQuery()
     *         .end(callback)
     *
     *       // customized sort function
     *       request.get('/user')
     *         .query('name=Nick')
     *         .query('search=Manny')
     *         .sortQuery(function(a, b){
     *           return a.length - b.length;
     *         })
     *         .end(callback)
     *
     *
     * @param {Function} sort
     * @return {Request} for chaining
     * @api public
     */
    
    RequestBase.prototype.sortQuery = function(sort) {
      // _sort default to true but otherwise can be a function or boolean
      this._sort = typeof sort === 'undefined' ? true : sort;
      return this;
    };
    
    /**
     * Compose querystring to append to req.url
     *
     * @api private
     */
    RequestBase.prototype._finalizeQueryString = function(){
      var query = this._query.join('&');
      if (query) {
        this.url += (this.url.indexOf('?') >= 0 ? '&' : '?') + query;
      }
      this._query.length = 0; // Makes the call idempotent
    
      if (this._sort) {
        var index = this.url.indexOf('?');
        if (index >= 0) {
          var queryArr = this.url.substring(index + 1).split('&');
          if ('function' === typeof this._sort) {
            queryArr.sort(this._sort);
          } else {
            queryArr.sort();
          }
          this.url = this.url.substring(0, index) + '?' + queryArr.join('&');
        }
      }
    };
    
    // For backwards compat only
    RequestBase.prototype._appendQueryString = function() {console.trace("Unsupported");}
    
    /**
     * Invoke callback with timeout error.
     *
     * @api private
     */
    
    RequestBase.prototype._timeoutError = function(reason, timeout, errno){
      if (this._aborted) {
        return;
      }
      var err = new Error(reason + timeout + 'ms exceeded');
      err.timeout = timeout;
      err.code = 'ECONNABORTED';
      err.errno = errno;
      this.timedout = true;
      this.abort();
      this.callback(err);
    };
    
    RequestBase.prototype._setTimeouts = function() {
      var self = this;
    
      // deadline
      if (this._timeout && !this._timer) {
        this._timer = setTimeout(function(){
          self._timeoutError('Timeout of ', self._timeout, 'ETIME');
        }, this._timeout);
      }
      // response timeout
      if (this._responseTimeout && !this._responseTimeoutTimer) {
        this._responseTimeoutTimer = setTimeout(function(){
          self._timeoutError('Response timeout of ', self._responseTimeout, 'ETIMEDOUT');
        }, this._responseTimeout);
      }
    };
    
    },{"./is-object":46}],48:[function(require,module,exports){
    'use strict';
    
    /**
     * Module dependencies.
     */
    
    var utils = require('./utils');
    
    /**
     * Expose `ResponseBase`.
     */
    
    module.exports = ResponseBase;
    
    /**
     * Initialize a new `ResponseBase`.
     *
     * @api public
     */
    
    function ResponseBase(obj) {
      if (obj) return mixin(obj);
    }
    
    /**
     * Mixin the prototype properties.
     *
     * @param {Object} obj
     * @return {Object}
     * @api private
     */
    
    function mixin(obj) {
      for (var key in ResponseBase.prototype) {
        obj[key] = ResponseBase.prototype[key];
      }
      return obj;
    }
    
    /**
     * Get case-insensitive `field` value.
     *
     * @param {String} field
     * @return {String}
     * @api public
     */
    
    ResponseBase.prototype.get = function(field) {
      return this.header[field.toLowerCase()];
    };
    
    /**
     * Set header related properties:
     *
     *   - `.type` the content type without params
     *
     * A response of "Content-Type: text/plain; charset=utf-8"
     * will provide you with a `.type` of "text/plain".
     *
     * @param {Object} header
     * @api private
     */
    
    ResponseBase.prototype._setHeaderProperties = function(header){
        // TODO: moar!
        // TODO: make this a util
    
        // content-type
        var ct = header['content-type'] || '';
        this.type = utils.type(ct);
    
        // params
        var params = utils.params(ct);
        for (var key in params) this[key] = params[key];
    
        this.links = {};
    
        // links
        try {
            if (header.link) {
                this.links = utils.parseLinks(header.link);
            }
        } catch (err) {
            // ignore
        }
    };
    
    /**
     * Set flags such as `.ok` based on `status`.
     *
     * For example a 2xx response will give you a `.ok` of __true__
     * whereas 5xx will be __false__ and `.error` will be __true__. The
     * `.clientError` and `.serverError` are also available to be more
     * specific, and `.statusType` is the class of error ranging from 1..5
     * sometimes useful for mapping respond colors etc.
     *
     * "sugar" properties are also defined for common cases. Currently providing:
     *
     *   - .noContent
     *   - .badRequest
     *   - .unauthorized
     *   - .notAcceptable
     *   - .notFound
     *
     * @param {Number} status
     * @api private
     */
    
    ResponseBase.prototype._setStatusProperties = function(status){
        var type = status / 100 | 0;
    
        // status / class
        this.status = this.statusCode = status;
        this.statusType = type;
    
        // basics
        this.info = 1 == type;
        this.ok = 2 == type;
        this.redirect = 3 == type;
        this.clientError = 4 == type;
        this.serverError = 5 == type;
        this.error = (4 == type || 5 == type)
            ? this.toError()
            : false;
    
        // sugar
        this.created = 201 == status;
        this.accepted = 202 == status;
        this.noContent = 204 == status;
        this.badRequest = 400 == status;
        this.unauthorized = 401 == status;
        this.notAcceptable = 406 == status;
        this.forbidden = 403 == status;
        this.notFound = 404 == status;
        this.unprocessableEntity = 422 == status;
    };
    
    },{"./utils":49}],49:[function(require,module,exports){
    'use strict';
    
    /**
     * Return the mime type for the given `str`.
     *
     * @param {String} str
     * @return {String}
     * @api private
     */
    
    exports.type = function(str){
      return str.split(/ *; */).shift();
    };
    
    /**
     * Return header field parameters.
     *
     * @param {String} str
     * @return {Object}
     * @api private
     */
    
    exports.params = function(str){
      return str.split(/ *; */).reduce(function(obj, str){
        var parts = str.split(/ *= */);
        var key = parts.shift();
        var val = parts.shift();
    
        if (key && val) obj[key] = val;
        return obj;
      }, {});
    };
    
    /**
     * Parse Link header fields.
     *
     * @param {String} str
     * @return {Object}
     * @api private
     */
    
    exports.parseLinks = function(str){
      return str.split(/ *, */).reduce(function(obj, str){
        var parts = str.split(/ *; */);
        var url = parts[0].slice(1, -1);
        var rel = parts[1].split(/ *= */)[1].slice(1, -1);
        obj[rel] = url;
        return obj;
      }, {});
    };
    
    /**
     * Strip content related fields from `header`.
     *
     * @param {Object} header
     * @return {Object} header
     * @api private
     */
    
    exports.cleanHeader = function(header, changesOrigin){
      delete header['content-type'];
      delete header['content-length'];
      delete header['transfer-encoding'];
      delete header['host'];
      // secuirty
      if (changesOrigin) {
        delete header['authorization'];
        delete header['cookie'];
      }
      return header;
    };
    
    },{}]},{},[26])(26)
    });
    