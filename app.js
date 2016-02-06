/**
 * Created by jadk157 on 2/6/16.
 */
(function(){
    var app = angular.module('timeline', [ ]);

    app.controller('TimelineController', ['$http', function($http){
        var timeline = this;

        $http.get('http://api.nytimes.com/svc/search/v2/articlesearch.json?q=Indonesia&fq=news_desk:("Business")&api-key=sample-key')
            .success(function(data){
            timeline.testData = data.response.docs[0].abstract;
        });
    }]);
})();

