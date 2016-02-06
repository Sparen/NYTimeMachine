(function(){
    var app = angular.module('inputyear', [ ]);

    var INTEGER_REGEXP = /^\-?\d+$/;

    app.directive('inputYear', function() {
    	return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
              ctrl.$validators.inputYear = function(modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                  // consider empty models to be valid
                  return true;
                }

                if (INTEGER_REGEXP.test(viewValue)) {
                  // it is valid
                  return true;
                }

                // it is invalid
                return false;
              };
            }
    	};
    });
})();

