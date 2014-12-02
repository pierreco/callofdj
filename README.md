# CallofDJ

Call of DJ est une table de mixage online composé de 2 tournes-disques dans lequel des morceaux de musique sont chargés par drag & drop depuis la liste de résultats d'une recherche.

<img src="http://gouezou-yannvai.fr/images/bg_call_of_dj.png" width="100%">

 <ul>          <li>HTML5</li>
                <li>CSS - Framework <a target="_blank" href="http://getbootstrap.com/">Bootstrap</a></li>
                <li>Icône <a target="_blank" href="http://fortawesome.github.io/Font-Awesome/icons/">Font-Awesome</a></li>
                <li>JavaScript - Framework Angularjs -JQuery</li>
                <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API">Web audio API</a></li>
            </ul>
#Installation
Signup on https://developers.soundcloud.com/
and copy your clientID in templates/mix/mixCtrl.js
````js
.controller('mixCtrl', function ($location, $sce, SoundcloudService, $scope) {
        vm.API = '' //Your clientID;
````
