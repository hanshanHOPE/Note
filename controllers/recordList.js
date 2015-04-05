/**
 * Created by c on 2015/3/31.
 */

angular.module("note")
  .controller("recordListCtrl", function($scope, $filter) {
    $scope.currentPage = 1;

    $scope.forward = function () {
      if ($scope.currentPage >= $scope.pageNum) {
          return;
      }
      else{
        $scope.currentPage++;
      }
    };

    $scope.backward = function () {
      if($scope.currentPage <= 1) {
        return;
      }
      else{
        $scope.currentPage--;
      }
    };
  });