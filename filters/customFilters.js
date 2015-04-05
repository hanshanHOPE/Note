/**
 * Created by c on 2015/3/31.
 */

angular.module("note")
.filter("range", function ($filter) {
    return function (data, page, size) {
      if(angular.isArray(data) && angular.isNumber(page) && angular.isNumber(size)) {
        var startIndex = (page - 1)*size;
        if(startIndex > data.length) {
          return [];
        }
        else {
          //return $filter("limitTo")(data.splice(startIndex), size);
          return $filter("limitTo")(data.slice(startIndex), size);
          //return res;
        }
      }
      else {
        return data;
      }
    };
  })
  .filter("getDate", function () {
    return function (data) {
      if(angular.isNumber(data)){
        var date = new Date(data);
        return date;
      }
      else {
        return data;
      }
    };
  });
