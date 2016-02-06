/**
 * Created by jadk157 on 2/6/16.
 */
(function(){
    var app = angular.module('timeline', ['inputyear']);

    app.controller('TimelineController', ['$http', function($http){
        var timeline = this;

        timeline.headline = "";
        timeline.startYear = 0;
        timeline.endYear = 0;

        timeline.span = timeline.endYear - timeline.startYear;
        timeline.hits = 0;
        timeline.avgHits = 0;

        timeline.hitsPerYear = [timeline.endYear - timeline.startYear];
        for(i = 0; i < timeline.hitsPerYear.length; i++){
        	timeline.hitsPerYear[i] = 0;
        }

        timeline.articleList = [];

        /*timeline.update = function(headline, startYear, endYear){
        	timeline.headline = headline;
        	timeline.startYear = startYear;
        	timeline.endYear = endYear;
        };*/

        timeline.showResults = function(){
        	console.log(timeline.articleList);
        };

        timeline.submit = function(){
        	$http.get('http://api.nytimes.com/svc/search/v2/articlesearch.json?q='
        			+ timeline.headline 
        			+ '&begin_date=' 
        			+ timeline.startYear
        			+ '0101&end_date='
        			+ timeline.endYear
        			+ '0101&sort=oldest&fl=abstract%2Clead_paragraph%2Cheadline%2Cpub_date&api-key=db6c22023a90449345e4d9e999dabb02:2:74312658')
            .success(function(data){
	            timeline.articleList = data.response.docs;
        	});

	        timeline.hits = timeline.articleList.length;
	        timeline.avgHits = timeline.hits / timeline.span;

	        for(i = 0; i < articleList.length; i++){
	        	var date = articleList[i].pub_date;
	        	var year = parseInt(date.substring(0,4));
	        	timeline.hitsPerYear[year] += 1;
	        }

	        //
        };


		//	http://api.nytimes.com/svc/search/v2/articlesearch.json?q=Indonesia&begin_date=19970101&end_date=20150101&fl=abstract%2Clead_paragraph%2Cheadline%2Cpub_date&api-key=sample-key
    
    }]);
})();


//ng-model='timeline.headline' ng-click='update(timeline.headline, timeline.startYear, timeline.endYear)'

