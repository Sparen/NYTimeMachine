/**
 * Created by jadk157 on 2/6/16.
 */
(function(){
    var app = angular.module('timeline', ['inputyear']);

    app.controller('TimelineController', ['$http', function($http){
        var timeline = this;

        timeline.year = 0;
        timeline.world = {
            europe: ["Germany", 'France', 'Britain', 'Italy', 'Spain', 'Russia', 'Turkey'],
            asia: ['Thailand', 'Indonesia', 'Singapore', 'China', 'Japan', 'India'],
            americas: ['Brazil', 'Argentina', 'Mexico', 'Venezuela', 'Cuba'],
            africa: ['Liberia', 'Ethiopia', 'Egypt', 'Ghana']
        }

        timeline.region = "";

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

            var countryList = timeline.world.timeline.region;
            for(i = 0; i < countryList.length; i++){
                var random = Math.floor((Math.random() * 10) + 1);
                if(random > 7){
                    countryList.splice(i, 1);
                }
            }

            console.log(countryList);

        	$http.get('http://api.nytimes.com/svc/search/v2/articlesearch.json?q='
        			+ timeline.headline 
        			+ '&begin_date=' 
        			+ timeline.startYear
        			+ '0101&end_date='
        			+ timeline.endYear
        			+ '0101&sort=oldest&fl=abstract%2Clead_paragraph%2Cheadline%2Cpub_date&api-key=db6c22023a90449345e4d9e999dabb02:2:74312658')
            .success(function(data){
                console.log(data);
	            timeline.articleList = data.response.docs;
        	});

	        timeline.hits = timeline.articleList.length;
	        timeline.avgHits = timeline.hits / timeline.span;

	        for(i = 0; i < timeline.articleList.length; i++){
	        	var date = timeline.articleList[i].pub_date;
	        	var year = parseInt(date.substring(0,4));
	        	timeline.hitsPerYear[year] += 1;
	        }

	        //
        };


		//	http://api.nytimes.com/svc/search/v2/articlesearch.json?q=Indonesia&begin_date=19970101&end_date=20150101&fl=abstract%2Clead_paragraph%2Cheadline%2Cpub_date&api-key=sample-key
    
    }]);
})();


//ng-model='timeline.headline' ng-click='update(timeline.headline, timeline.startYear, timeline.endYear)'

