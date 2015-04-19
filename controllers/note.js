/**
 * Created by c on 2015/3/29.
 */

angular.module("note")
  .constant("recordListPageCount", 3)
  .controller("noteCtrl", function ($scope, backend, recordListPageCount) {
    $scope.data = {};             //object to store records
    $scope.editedRecord = {};     //for editing
    $scope.pageNum = 0;
    $scope.pageSize = recordListPageCount;

    function getRecords() {
      backend.getRecords().then(function (result) {
        $scope.data.records = result;
        setPageNum();
      });
    }

    function setPageNum() {
      var recordNum = $scope.data.records.length;
      var ps = $scope.pageSize;
      if (recordNum == 0) {
        $scope.pageNum = 1;
      }
      else if (recordNum % ps == 0) {
        $scope.pageNum = recordNum / ps;
      }
      else {
        $scope.pageNum = ((recordNum - recordNum%ps)/ps + 1);
      }
    }

    $scope.loadRecord = function (key) {
      backend.getRecord(key).then(function (result) {
        $scope.editedRecord = result;
      });
    };

    $scope.saveRecord = function () {
      var record = {};
      if($scope.editedRecord.id !== ''){
        record.id = $scope.editedRecord.id;
      }
      record.title = $scope.editedRecord.title;
      //record.time = new Date().toLocaleString();
      record.time = new Date().getTime();
      record.content = $scope.editedRecord.content;

      backend.saveRecord(record).then(function (newRecord) {
        if (!record.id) {
          $scope.data.records.push(newRecord);
        }
        else {
          var dataLength = $scope.data.records.length;
          for (var i = 0; i < dataLength ; i++) {
            if ($scope.data.records[i].id == newRecord.id ) {
              $scope.data.records[i] = newRecord;
              break;
            }
          }
        }
        setPageNum();
      });
      $scope.editedRecord = null;
    };

    $scope.deleteRecord = function (key) {
      backend.deleteRecord(key).then(function (deletedKey) {
        var dataLength = $scope.data.records.length;
        for (var i = 0; i < dataLength ; i++) {
          if ($scope.data.records[i].id == deletedKey ) {
            $scope.data.records.splice(i,1);
            break;
          }
        }
        setPageNum();
      });
    };

    $scope.clearBinding = function () {
      $scope.editedRecord = null;
    };

    (function () {
      if(backend.isSupport) {
        getRecords();
      }
      else {
        alert('Your browser doesn\'t support IndexedDB!' );
      }
    })();

  });
