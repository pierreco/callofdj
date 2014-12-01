angular.module('app.mix', ['ngSanitize','angulike'])
    .controller('mixCtrl', function ($location, $sce, SoundcloudService, $scope) {
        var vm = this;
        vm.list = [];
        vm.API = 'cf4f1bc99f89feaa4b43b6604739f06e';
        vm.index = -1;
        vm.loading = false;
        $scope.statusclasssound1 = 'pause';
        $scope.statusclasssound2 = 'pause';


        $scope.explorecat = function(cat){
            vm.loading = true;
            SoundcloudService.explorecat(vm.API,cat )
                .success(function(data, status) {
                    vm.loading = false;
                    vm.index = -1;
                    $scope.textsearch = "Catégorie : #" + cat;
                    $scope.nbresult = null;
                    vm.list = data;
                }).error(function(data, status, headers, config, statusText) {
                    vm.loading = false;
                    console.log('Search Error:', status, data, headers, config, statusText);
                });
        };

        vm.explore = function(){

            vm.loading = true;
            SoundcloudService.explore(vm.API )
                .success(function(data, status) {
                    vm.loading = false;
                    vm.index = -1;
                    $scope.textsearch = "Dernières musiques";
                    vm.list = data;
                    $scope.nbresult = null;
                }).error(function(data, status, headers, config, statusText) {
                    vm.loading = false;
                    console.log('Search Error:', status, data, headers, config, statusText);
                });
        };
		
        vm.explore();

        vm.search = function(){
            vm.loading = true;
            SoundcloudService.search( vm.ui, vm.API )
                .success(function(data, status) {
                    vm.loading = false;
                    vm.index = -1;
                    $scope.textsearch = "Recherche pour: " + vm.ui;
                    $scope.nbresult = data.length + " resulats";
                    vm.list = data;
                }).error(function(data, status, headers, config, statusText) {
                    vm.loading = false;
                    console.log('Search Error:', status, data, headers, config, statusText);
                });
        };

        $scope.onDropComplete = function(disc,data,evt){
            console.log("drop success player, data:", data);
            console.log("url récupérée" + data.uri);
            var uri = data.uri + "/stream?consumer_key=" + vm.API;
			if(disc == 1){
                $scope.showinfosong1 = true;
				$scope.titlesound1 = data.title;
                $scope.urlsound1 = data.permalink_url;
				$scope.descriptionsound1 = data.description;
				if(data.artwork_url == "null") {
					$scope.imgsound1 = " ";
          $('#base1').css("visibility", "block");
				}
				else{
					$scope.imgsound1 = data.artwork_url;
          $('#base1').css("visibility", "hidden");
				}
			}
			else
			{
                $scope.showinfosong2 = true;
				$scope.titlesound2 = data.title;
                $scope.urlsound2 = data.permalink_url;
				$scope.descriptionsound2 = data.description;
				if(data.artwork_url == "null") {
					$scope.imgsound2 = " ";
          $('#base2').css("visibility", "block");
				}
				else{
					$scope.imgsound2 = data.artwork_url;
          $('#base2').css("visibility", "hidden");
				}
			}
            $scope.props = {
                target: '_blank',
                otherProp: 'otherProperty'
            };
            console.log("On disc : " + disc);
            prepareDisc(uri, disc, data.duration);
        }

       $scope.playsound = function(player)
       {
           if(player == 1){
               if($scope.statusclasssound1 == 'play') {
                   $scope.statusclasssound1 = 'pause';
                   play(player);
               }
               else {
                   $scope.statusclasssound1 = 'play';
                   pause(player);
               }
           }
           else{
               if($scope.statusclasssound2 == 'play') {
                   $scope.statusclasssound2 = 'pause';
                   play(player);

               }
              else{
                   $scope.statusclasssound2 = 'play';
                   pause(player);
               }
           }
       }
	   
       $scope.stopsound = function(player)
       {
			stop(player);
			if(player == 1)
			   $scope.statusclasssound1 = 'play';
			else
               $scope.statusclasssound2 = 'play';
       }

	   $scope.stopseek = function(player)
       {
			stopseek(player);
       }
	   
	   $scope.moveto = function(player)
       {
			moveto(player);
       }
	   
	   $scope.startscratch = function(player)
       {
			startScratch(player);
       }
	   
		$scope.stopscratch = function(player)
       {
			stopScratch(player);
       }
})
.filter('parseUrlFilter', function () {
    var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi;
    return function (text, target, otherProp) {
        return text.replace(urlPattern, '<a target="' + target + '" href="$&">$&</a>') + " | " + otherProp;
    };
});

var volume_display_1 = false;
var volume_display_2 = false;
function show_vol(disc){
  if (disc == 1){
    if (volume_display_1 == false){
        $("#vol" + disc).fadeIn("fast");
        volume_display_1 = true;
    }
    else{
        $("#vol" + disc).fadeOut("fast");
        volume_display_1 = false;
    }
  }
  else{
    if (volume_display_2 == false){
        $("#vol" + disc).fadeIn("fast");
        volume_display_2 = true;
    }
    else{
        $("#vol" + disc).fadeOut("fast");
        volume_display_2 = false;
    }
  }
}

function change_volume(disc){
    $value = $("#vol" + disc).val() / 100;
    volume_mngt(disc, $value);
}

function change_crossfade(){
    $value = $("#crossfader").val() / 100;
    console.log($value);
    crossfade_mngt($value);    
}

function change_frequence(disc){
    $value = $("#frequence" + disc).val() / 100;
    console.log($value);
    frequence_mngt(disc, $value);    
}

function change_quality(disc){
    $value = $("#Qlevel" + disc).val() / 100;
    console.log($value);
    quality_mngt(disc, $value);    
}


