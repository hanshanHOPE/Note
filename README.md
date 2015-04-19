This is a single page application based on HTML5 IndexedDB and AngularJS
framework, which can manage a local database. User can add, edit and remove
records. I have tested it with Chrome.

This is the demo page:  http://hanshanhope.github.io/Note

![demo pic](/demo.png)

Different from the [LocalLibrary](http://hanshanhope.github.io/LocalLibrary/) I have done previously, this application uses AngularJS
framework, which follows the MVC pattern. It uses the Promises of AngularJS, which is responsible
for things that happen in the future. In this case, the thing is the response from the back-end
database. Change to $scope.data.records which is used to show in view is made only when change to 
the indexedDB is made by then method on promise object.

Also, it no longer uses third-party UI framework. I implement the modal using opacity and
transition features of CSS3.
