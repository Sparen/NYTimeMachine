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

        // Shows the list of articles to be pushed onto the screen
        timeline.showArticles = function(){
        	console.log(timeline.articleList);
        };

        // Randomly selects countries from a region 
        timeline.randomizeCountries = function(region){
            var countryList = region;
            for(i = 0; i < countryList.length; i++){
                var random = Math.floor((Math.random() * 10) + 1);
                if(random > 7){
                    countryList.splice(i, 1);
                }
            }
            return countryList;
        }

        // Adds to articleList the first article given back by the API query result that has
        // the country's name either in its snippet or its headline
        timeline.selectArticle = function(query, country){
            var quota_fulfill = false;

            for(j = 0; j < query.length; j++){
                var snippet = query[j].snippet;
                var main = query[j].headline.main;
                if((snippet.includes(country) || main.includes(country))
                    && quota_fulfill === false){
                        timeline.articleList.push(query[j]);
                        quota_fulfill = true;
                }
            }
        }

        timeline.submit = function(){

            var countryList = randomizeCountries(timeline.world.timeline.region);

            for(i = 0; i < countryList.length; i++){
                $http.get('http://api.nytimes.com/svc/search/v2/articlesearch.json?q='
                    + countryList[i] 
                    + '&begin_date=' 
                    + timeline.year
                    + '0101&end_date='
                    + (timeline.year + 1)
                    + '0101&sort=oldest&fl=snippet%2Cheadline&api-key=sample-key=db6c22023a90449345e4d9e999dabb02:2:74312658')
                .success(function(data){
                    var query = data.response.docs;
                    timeline.selectArticle(query, countryList[i]);
                });
            }

            console.log(timeline.articleList);
        };
    }]);
})();


//ng-model='timeline.headline' ng-click='update(timeline.headline, timeline.startYear, timeline.endYear)'

