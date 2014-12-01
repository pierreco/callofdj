# CallofDJ

Battle of DJ est une table de mixage online composé de 2 tournes-disques dans lequel des morceaux de musique sont chargés par drag & drop depuis la liste de résultats d'une recherche.

#Installation
Signup on https://developers.soundcloud.com/
and copy your clientID in templates/mix/mixCtrl.js
````js
.controller('mixCtrl', function ($location, $sce, SoundcloudService, $scope) {
        vm.API = '' //Your clientID;
````
