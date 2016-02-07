/**
 * Created by jadk157 on 2/6/16.
 */
(function(){
    var app = angular.module('timeline', ['inputyear', 'ngAnimate']);

    app.controller('TimelineController', ['$http', function($http){
        var timeline = this;

        timeline.year;
        timeline.world = {
            Europe: ["Germany", 'France', 'Britain', 'Italy', 'Spain', 'Russia', 'Turkey', 'Austria', 'Hungary', 'Norway', 'Sweden', 'Finland', 'Denmark', 'Estonia', 'Latvia', 'Lithuania', 'Serbia', 'Greece'],
            "East Asia": ['China', 'Japan', 'Korea', 'North Korea', 'South Korea', 'Taiwan', 'Mongolia'],
            "Southeast Asia": ['Thailand', 'Indonesia', 'Singapore', 'Vietnam', 'Laos', 'Cambodia', 'Malaysia', 'Burma', 'Brunei', 'East Timor'],
            "Indian Subcontinent": ['India', 'Nepal', 'Bhutan', 'Maldives', 'Sri Lanka', 'Bangladesh', 'Pakistan'],
            Americas: ['Brazil', 'Argentina', 'Mexico', 'Venezuela', 'Peru', 'Colombia', 'Bolivia', 'El Salvador', 'Guatemala', 'Costa Rica', 'Ecuador', 'Chile'],
            Carribean: ['Cuba', 'Haiti', 'Dominican Republic', 'Jamaica', 'Bahamas', 'Curacao', 'Kitts', 'Barbados', 'Antigua', 'Bermuda'],
            "North Africa": ['Egypt', 'Morocco', 'Tunisia', 'Libya', 'Western Sahara', 'Sudan'],
            "Sub Saharan Africa": ['Liberia', 'Ethiopia', 'Egypt', 'Ghana', 'Somalia', 'Burundi', 'Botswana', 'Rwanda', 'Zimbabwe', 'South Africa', 'Chad', 'Nigeria', 'Benin', 'Togo', 'Equatorial Guinea', 'Senegal', 'Gambia', 'Zambia', 'Mozambique', 'Kenya', 'Tanzania'],
            "Middle East": ['Israel', 'Palestine', 'Jordan', 'Lebanon', 'Syria', 'Iran', 'Iraq', 'Kuwait', 'Saudia Arabia', 'Yemen', 'Oman', 'United Arab Emirates', 'Qatar', 'Bahrain'],
            Oceania: ['Australia', 'New Zealand', 'Papua New Guinea', 'Fiji', 'New Caledonia', 'Vanuatu', 'Tuvalu']
        };

        timeline.region = "";

        timeline.articleList = [];

        timeline.showFind = true;

        timeline.showSearch = function() {
            timeline.showFind = true;
            return true;
        };
        timeline.hideSearch = function() {
            timeline.showFind = false;
            return true;
        };

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
        };

        // Adds to articleList the first article given back by the API query result that has
        // the country's name either in its snippet or its headline
        timeline.selectArticle = function(query, country){
            var quota_fulfill = false;
            for(j = 0; j < query.length; j++){
                var snippet = query[j].snippet;
                var main = query[j].headline.main;
                if(snippet != null && main != null){
                    if((snippet.toUpperCase().includes(country) || main.toUpperCase().includes(country)) //making sure that the country is in the snippet or headline
                    && quota_fulfill === false){
                        var newArticle = {
                            headline: "",
                            snippet: "",
                            country: country
                        };

                        newArticle.headline = query[j].headline.main;
                        newArticle.snippet = query[j].snippet;                        

                        if(!timeline.isDuplicate(newArticle)){
                            timeline.articleList.push(newArticle);
                            quota_fulfill = true; 
                        }
                    }
                }
            }
            console.log(timeline.articleList);
        };

        timeline.isDuplicate = function(newArticle){
            var isDuplicate = false;
            for(i = 0; i < timeline.articleList.length; i++){
                if(newArticle.headline != "" && newArticle.headline === timeline.articleList[i].headline){
                    isDuplicate = true;
                }
            }

            return isDuplicate;
        };

        timeline.submit = function(){
            timeline.articleList = [];
            timeline.hideSearch();

            var countryList = timeline.randomizeCountries(timeline.world[timeline.region]);

            for(i = 0; i < countryList.length; i++){
                $http.get('http://api.nytimes.com/svc/search/v2/articlesearch.json?q='
                    + countryList[i] 
                    + '&begin_date=' 
                    + timeline.year
                    + '0101&end_date='
                    + (timeline.year + 1)
                    + '0101&sort=oldest&fl=snippet%2Cheadline&api-key=db6c22023a90449345e4d9e999dabb02:2:74312658')
                .success((function(i, countryList){ //solution 2 from http://stackoverflow.com/questions/19116815/how-to-pass-a-value-to-an-angularjs-http-success-callback accepted answer
                    return function(data){
                        var query = data.response.docs;
                        timeline.selectArticle(query, countryList[i].toUpperCase());
                    }
                })(i, countryList));
            };


        };
    }]);
})();


//ng-model='timeline.headline' ng-click='update(timeline.headline, timeline.startYear, timeline.endYear)'

