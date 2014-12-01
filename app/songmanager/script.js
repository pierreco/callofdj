var mX;
var mY;
$(document).ready(function() {
    console.log("doc ready");
    // Audio context creation
    context = new webkitAudioContext();
    analyser = context.createAnalyser();
	$(document).mousemove(function(e){
		mX = e.pageX 
		mY = e.pageY;
	});
});

var disc1 = {ref:"#disc1", center:"#center1", url:"empty", duration:-1, loop:0, offset:0, buffer:0, bufferR:0, source:0, gain_node:0, filter:0, analyser:0, speed:0, curAngle:0,
			 prevAngle:0, speeds:[], scratching:false, seeking:false, ready:false, reversed:false, stopped:true,
			 prevmX:0, turns:0, scrachStart:0}; 
var disc2 = {ref:"#disc2", center:"#center2", url:"empty", duration:-1, loop:0, offset:0, buffer:0, bufferR:0, source:0, gain_node:0, filter:0, analyser:0, speed:0, curAngle:0, 
			 prevAngle:0, speeds:[], scratching:false, seeking:false, ready:false, reversed:false, stopped:true,
			 prevmX:0, turns:0, scrachStart:0}; 
var disc = {1:disc1, 2:disc2};

function loadBuffer(url, player) {
	var request1 = new XMLHttpRequest();
	var request2 = new XMLHttpRequest();
	request1.open("GET", url, true);
	request1.responseType = "arraybuffer";
	request2.open("GET", url, true);
	request2.responseType = "arraybuffer";

	request1.onload = function() {
		context.decodeAudioData(
			request1.response,
			function(buffer) {
				if (!buffer) {
					console.log('error decoding file data: ' + url);
					return;
				}
				disc[player].buffer = buffer;
			}
		);
	}
	
	request2.onload = function() {
		context.decodeAudioData(
			request2.response,
			function(buffer) {
				if (!buffer) {
					console.log('error decoding file data: ' + url);
					return;
				}
				disc[player].bufferR = buffer;
				Array.prototype.reverse.call(disc[player].bufferR.getChannelData(0));
				Array.prototype.reverse.call(disc[player].bufferR.getChannelData(1));
				launchDisc(player);
			}
		);
	}

	request1.onerror = function() {
		console.log('error loading file data: ' + url);
	}
	request2.onerror = function() {
		console.log('error loading file data: ' + url);
	}
	request1.send();
	request2.send();
}

function prepareDisc(url, player, duration){
	if(disc[player].url != "empty"){
		stop(player);
		clearInterval(disc[player].loop);
		disc[player].offset = 0;
		disc[player].buffer = 0;
		disc[player].bufferR = 0;
		disc[player].source = 0;
		disc[player].speed = 0;
		disc[player].curAngle = 0;
		disc[player].prevAngle = 0;
		disc[player].speeds = [];
		disc[player].scratching = false;
		disc[player].seeking = false; 
		disc[player].ready = false;
		disc[player].stopped = true;
	}
	disc[player].url = url;
	disc[player].duration = duration;
	loadBuffer(url, player);
}

function launchDisc(player){
	disc[player].ready = true;
	disc[player].loop = setInterval(function() { loop(player); }, 1);
	play(player);
	visualize(player);
}

function loop(player){
	if(disc[player].stopped == false && disc[player].scratching == false){
		$(disc[player].ref).rotate({angle: 1.35 + disc[player].curAngle});	
		newAngle = $(disc[player].ref).getRotateAngle()[0];
		disc[player].speed = Math.round((newAngle - disc[player].curAngle) * 200);
		updatePlaySpeed(player);
		disc[player].curAngle = $(disc[player].ref).getRotateAngle()[0];
	}
	else if (disc[player].scratching == true){
		scratch(player);
		scratchSpeed(player);
	}
	//console.log(disc[player].curAngle);
	if (disc[player].seeking == false){
		$("#seek" + player).val(disc[player].curAngle/270 * 1000 / disc[player].duration * 100);
	}
}

function scratch(player){
	disc[player].prevAngle = $(disc[player].ref).getRotateAngle()[0];
	var offset = $(disc[player].center).offset();
	var center_x = (offset.left) + ($(disc[player].center).width()/2);
	var center_y = (offset.top) + ($(disc[player].center).height()/2);
	var radians = Math.atan2(mX - center_x, mY - center_y) * -1;
	if (mY - center_y < 0){
		if (disc[player].prevmX - center_x <= 0 && mX - center_x > 0)
			disc[player].turns++;
		else if (disc[player].prevmX - center_x >= 0 && mX - center_x < 0)
			disc[player].turns--;
	}
	radians += (disc[player].scrachStart + (360*disc[player].turns)) * (Math.PI / 180);
	var degree = radians * (180 / Math.PI);
	disc[player].prevmX = mX;
	if(degree < 0)
		$(disc[player].ref).rotate(0);
	else
		$(disc[player].ref).rotate(degree);
}

function scratchSpeed(player){
	disc[player].curAngle = $(disc[player].ref).getRotateAngle()[0];
	disc[player].speeds.push((disc[player].curAngle - disc[player].prevAngle) * 40);
	if (disc[player].speeds.length  >= 5){
		var sum = 0;
		for( var i = 0; i < disc[player].speeds.length; i++ ){
			sum += parseInt(disc[player].speeds[i]);
		}
		if (sum)
			disc[player].speed = sum;
		else
			disc[player].speed = 0;
		disc[player].speeds = [];
		updatePlaySpeed(player);
		//console.log(disc[player].speed);
	}
}

function startScratch(player){
	if (disc[player].ready == true && disc[player].scratching == false){
		disc[player].scratching = true;
		var offset = $(disc[player].center).offset();
		var center_x = (offset.left) + ($(disc[player].center).width()/2);
		var center_y = (offset.top) + ($(disc[player].center).height()/2);
		var radians = Math.atan2(mX - center_x, mY - center_y);
		disc[player].curAngle -= (radians * (180 / Math.PI) * -1);
		disc[player].scrachStart = disc[player].curAngle;
	}
}

function stopScratch(player){
	if (disc[player].ready == true && disc[player].scratching == true ){
		disc[player].scratching = false;
		disc[player].turns = 0;
		disc[player].prevAngle = 0;
		if (disc[player].reversed == true)
			reverse(player);
		pause(player);
		play(player);
	}
}

function play(player){
	if (disc[player].stopped == true && disc[player].ready == true){
		disc[player].source = context.createBufferSource();
		disc[player].source.buffer = disc[player].reversed == true ? disc[player].bufferR : disc[player].buffer;
		disc[player].gain_node = context.createGain();
		disc[player].source.connect(disc[player].gain_node);
		disc[player].filter = context.createBiquadFilter();
		disc[player].filter.type = (typeof disc[player].filter.type === 'string') ? 'lowpass' : 0; // LOWPASS
  		disc[player].filter.frequency.value = 5000;
		disc[player].gain_node.connect(disc[player].filter);
		disc[player].analyser = context.createAnalyser();
		disc[player].analyser.minDecibels = -90;
		disc[player].analyser.maxDecibels = -10;
		disc[player].analyser.smoothingTimeConstant = 0.85;
		disc[player].filter.connect(disc[player].analyser);
		disc[player].analyser.connect(context.destination);
		disc[player].source.start(0, disc[player].offset);
		disc[player].stopped = false;
		disc[player].offset = 0;
	}
}

function stop(player){
	if (disc[player].stopped == false && disc[player].ready == true){
		disc[player].source.stop();
		$(disc[player].ref).rotate({angle:270 * disc[player].offset});
		disc[player].curAngle = 270 * disc[player].offset;
		$("#seek" + player).val(0);
		disc[player].stopped = true;
	}
}

function pause(player){
	if (disc[player].stopped == false && disc[player].ready == true){
		disc[player].offset = disc[player].curAngle/270;
		disc[player].source.stop();
		disc[player].stopped = true;
	}
}

function reverse(player){
	disc[player].offset = disc[player].reversed ? disc[player].curAngle/270 : disc[player].duration/1000 - (disc[player].curAngle/270);
	disc[player].reversed = !disc[player].reversed;
	disc[player].source.stop();
	disc[player].stopped = true;
	play(player);
}

function stopseek(player){
	if (disc[player].ready == true)
		disc[player].seeking = true;
}

function moveto(player){
	if (disc[player].stopped == false && disc[player].ready == true){
		disc[player].offset = disc[player].duration / 100 * $("#seek" + player).val() / 1000;
		console.log(disc[player].offset);
		stop(player);
		play(player);
	}
	disc[player].seeking = false;
}
//Met à jour la vitesse de lecture
function updatePlaySpeed(player){
	if (disc[player].speed > 0){
		if (disc[player].stopped == true && disc[player].scratching)
			play(player);
		if (disc[player].reversed == true && disc[player].scratching)
			reverse(player);
		disc[player].source.playbackRate.value = disc[player].speed/270;
	}
	else if (disc[player].speed < 0){
		if (disc[player].stopped == true && disc[player].scratching)
			play(player);
		if (disc[player].reversed == false && disc[player].scratching)
			reverse(player);
		disc[player].source.playbackRate.value = disc[player].speed/270 * -1;
	}
	else if (disc[player].speed == 0){
		pause(player);
	}
}

function visualize(player) {
	var canvas = document.querySelector(".visualizer" + player);
	console.log(".visualizer" + player)
	var canvasCtx = canvas.getContext("2d");
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    disc[player].analyser.fftSize = 256;
    var bufferLength = disc[player].analyser.frequencyBinCount;
    console.log(bufferLength);
    var dataArray = new Uint8Array(bufferLength);
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    function draw() {
      var drawVisual = requestAnimationFrame(draw);
      disc[player].analyser.getByteFrequencyData(dataArray);
      canvasCtx.fillStyle = 'rgb(255, 255, 255)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      var barWidth = (WIDTH / bufferLength) * 2.5;
      var barHeight;
      var x = 0;
      for(var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
        canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);
        x += barWidth + 1;
      }
    };
    draw();
}

function volume_mngt(player, volume) {
  disc[player].gain_node.gain.value = volume * volume;
}

function crossfade_mngt(value) {
  var x = value;
  var gain1 = Math.cos(x * 0.5*Math.PI);
  var gain2 = Math.cos((1.0 - x) * 0.5*Math.PI);
  disc["1"].gain_node.gain.value = gain1;
  disc["2"].gain_node.gain.value = gain2;
};

function frequence_mngt(player, value) {
  var minValue = 40;
  var maxValue = context.sampleRate / 2;
  var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
  var multiplier = Math.pow(2, numberOfOctaves * (value - 1));
  disc[player].filter.frequency.value = maxValue * multiplier;
};

function quality_mngt(player, value) {
	disc[player].filter.Q.value = value * 30;
};