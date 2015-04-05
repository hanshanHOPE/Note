/**
 * Created by c on 2015/3/29.
 */

angular.module("note")
  .constant("recordListPageCount", 3)
  .controller("noteCtrl", function ($scope, backend, recordListPageCount) {
    $scope.data = {};
    $scope.editedRecord = {};
    $scope.pageNum = 1;
    $scope.pageSize = recordListPageCount;

    function getRecords() {
      backend.getRecords().then(function (result) {
        $scope.data.records = result;
        setPageNum();
      });
    }

    function setPageNum() {
      var total = $scope.data.records.length;
      if (total % $scope.pageSize == 0) {
        if(total>0) {
          $scope.pageNum = total / $scope.pageSize;
        }
        else{
          $scope.pageNum = 1;
        }
      }
      else {
        $scope.pageNum = (total - total % $scope.pageSize) / $scope.pageSize +1;
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

      backend.saveRecord(record).then(function () {
        $scope.editedRecord = null;
        getRecords();
      });

    };

    $scope.deleteRecord = function (key) {
      backend.deleteRecord(key).then(function () {
        //further more, delete item from $scope.data.records directly
        getRecords();
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
