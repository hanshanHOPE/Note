/**
 * Created by c on 2015/3/29.
 */

angular.module("backend", [])
  .factory("backend", function ($q) {
    var hasOpenDB = false;
    var db;

    const DB_NAME = 'hanshanNote';
    const DB_VERSION = 1;
    const DB_STORE_NAME = 'hanshanNote';

    function isSupport () {
      if(!window.indexedDB) {
        return false;
      }
      return true;
    }

    function dbStatus() {
      return hasOpenDB;
    }

    function openDB() {
      var deferred = $q.defer();

      if(hasOpenDB) {
        deferred.resolve(true);
        return deferred.promise;
      }

      //make a request to open IndexedDB
      //return an IDBOpenRequest object
      var DBOpenRequest = window.indexedDB.open(DB_NAME, DB_VERSION);

      DBOpenRequest.onsuccess = function (event) {
        //db is an instance of IDBDatabase
        db = event.target.result;
        hasOpenDB = true;
        consoleLog('database initialized.');
        deferred.resolve(true);
      };

      DBOpenRequest.onerror = function (event) {
        consoleLog('error loading database: '+ event.toString());
        deferred.reject('error loading database: '+ event.toString());
      };

      DBOpenRequest.onupgradeneeded = function (event) {
        var db = event.target.result;

        db.onerror = function (event) {
          consoleLog('error loading database.');
        };

        var objectStore = db.createObjectStore(DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });
        //param: indexedName, keyPath, optionalParameters
        objectStore.createIndex('title', 'title', { unique : false });
        objectStore.createIndex('time', 'time', { unique : false } );
        objectStore.createIndex('content', 'content', { unique : false });

      };

      return deferred.promise;
    }

    function saveRecord(record) {
      var deferred = $q.defer();

      if(record.title == '' || record.time == '' || record.content == ''){
        consoleLog('empty record not supported!');
        deferred.reject('empty record not supported!');
        return deferred.promise;
      }

      //used to add new record
      var newItem = {};

      if(!record.id) {
        record.id = '';
        newItem = {
          title:    record.title,
          time:     record.time,
          content:    record.content
        };
      }

      var transaction = db.transaction(DB_STORE_NAME, 'readwrite');

      transaction.oncomplete = function (event) {
        deferred.resolve();
      };

      transaction.onerror = function (event) {
        deferred.reject();
      };

      if (record.id === '') {
        transaction.objectStore(DB_STORE_NAME).add(newItem);
      }
      else {
        transaction.objectStore(DB_STORE_NAME).put(record);
      }

      return deferred.promise;
    }

    function getRecord(key) {
      var deferred = $q.defer();

      var transaction = db.transaction(DB_STORE_NAME);
      var objectStore = transaction.objectStore(DB_STORE_NAME);
      var request = objectStore.get(key);

      request.onsuccess = function (event) {
        deferred.resolve(event.target.result);
      };

      return deferred.promise;
    }

    function deleteRecord (key) {
      var deferred = $q.defer();

      var transaction = db.transaction(DB_STORE_NAME, 'readwrite');
      transaction.objectStore(DB_STORE_NAME).delete(key);

      transaction.oncomplete = function (event) {
        deferred.resolve();
      };

      return deferred.promise;
    }

    function getRecords () {
      var deferred = $q.defer();

      openDB().then(function () {
        var results = [];

        var transaction = db.transaction(DB_STORE_NAME);
        var objectStore = transaction.objectStore(DB_STORE_NAME);
        objectStore.openCursor().onsuccess = function (event) {
          var cursor = event.target.result;

          if(cursor) {
            //results.push(cursor);
            //results.push({id:cursor.key, title:cursor.value.title,
                          //time:cursor.value.time, content:cursor.value.content});
            results.push({id:cursor.key, title:cursor.value.title, content:cursor.value.content,
              time:cursor.value.time});
            cursor.continue();
          }
        };

        transaction.oncomplete = function (event) {
          deferred.resolve(results);
        };

      });

      return deferred.promise;
    }

    function consoleLog(msg) {
      console.log(msg);
    }

    return {
      isSupport:    isSupport,
      dbStatus:     dbStatus,
      saveRecord:   saveRecord,
      deleteRecord: deleteRecord,
      getRecord:    getRecord,
      getRecords:   getRecords
    };

  });
