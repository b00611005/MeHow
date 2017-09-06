'use strict';
//Used for audio
var recording = false;
var audioRecord ="";

var noImageURL = "/images/no-image.jpg";

var current_data = {
    "memo": "",
    "date": {"month": "", "day": "", "year": ""},
    "time": {"hour": "", "minute": ""},
    "imageURL": "",
    "emoji": "",
    "emojiImageURL": "",
    "audioURL": ""
};

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
    initializePage();
})

function initializePage() {
    console.log("entry connected!");
    $("#edit-text").height( $("#edit-text")[0].scrollHeight );
    $("#edit-button").click( edit );

    $("#delete-button").hide();
    $("#no-delete-button").click( function() {
        $("#warning-modal").modal("hide");
    } );
    $("#yes-delete-button").click( delete_entry );

    $("#cancel-button").hide();
    $("#cancel-button").click( close_edit );

    $("#save-button").hide();
    $("#save-button").click( save );

    $(".emojis").click( choose_emoji );
    $("#emoji-modal").modal("hide");

    // $("#entry-image").attr("data-target", "#image-modal");
    $("#gallery").click( readImageFile );
    $("#snap").click( snapImage );

    $('#datetime24').hide();

    $('.rm-element-button').hide();
    $('.edit-audio-control').hide();
    $('#playButton').click(audioToggle);
    $('#askForRecordButton').click(overwrite_warning);
    $('#audio-ok-button').hide();

    $(".rm-element-button").click(removeElement);
    var player = document.getElementById('player');
    player.onended = function(){
        // console.log("Music ended");
        $('#playButton').removeClass("on");
        $('#playButton').attr("src", "../images/play.png");
    }


    console.log($("#entry-container").data("entryid"));

    // save initial data
    current_data.memo = $("#edit-text").val();
    current_data.time.hour = parseInt($("#entry-time").text().substr(0, 2));
    current_data.time.minute = parseInt($("#entry-time").text().substr(3, 2));
    current_data.date.month = parseInt($("#entry-time").data("month"));
    current_data.date.day = parseInt($("#entry-time").text().substr(15, 2));
    current_data.date.year = parseInt($("#entry-time").text().substr(19, 4));
    current_data.imageURL = $("#entry-image").attr("src");
    current_data.emoji = $("#entry-emoji").data("emojiid");
    current_data.emojiImageURL = $("#entry-emoji").attr("src");
    current_data.audioURL = $('#player').attr("src");
    console.log(current_data.memo);
    console.log(current_data.time);
    console.log(current_data.date);
    console.log(current_data.imageURL);
    console.log(current_data.emoji);
    console.log(current_data.audioURL);

    if(!current_data.audioURL){
        $(".audioButton").hide()
    }
}

function audioToggle(e){
    if($(this).hasClass("on")){
        $(this).removeClass("on");
        document.getElementById('player').pause()
        $(this).attr("src", "../images/play.png")        
    }else{
        $(this).addClass("on");
        document.getElementById('player').play()
        $(this).attr("src", "../images/pause.png")
    }
}

function edit(e) {
    e.preventDefault();
    console.log("edit!!");
    $("#edit-text").attr("disabled", false);
    $("#edit-text").addClass("inputShadow");
    $("#entry-time").addClass("inputShadow");
    $("#entry-emoji").addClass("inputShadow");
    $("#entry-image").addClass("inputShadow");

    $("#entry-emoji").attr("data-target", "#emoji-modal");
    $("#entry-image").attr("data-target", "#camera-modal");


    $("#edit-button").hide();
    $("#delete-button").show();
    $("#cancel-button").show();
    $("#save-button").show();
    $("#back-button").hide();

    $('#datetime24').show();
    $('#datetime24').combodate();
    $('#entry-time').hide();

    $("#playButton").hide();
    $("#stopButton").hide();
    $("#askForRecordButton").show();

    $(".rm-element-button").show();
    $(".edit-audio-control").show();
    if(current_data.audioURL==""){
        $("#audio-rm-button").hide();
        $("#audio-record-icon").hide();
    }else{
        $("#audio-rm-button").show();
        $("#audio-record-icon").show();
    }

    if(current_data.imageURL == noImageURL){
        $("#img-rm-button").hide();
        // $('#entry-image').attr('src','/images/add-image.jpg');
    }else{
    }

    previewCamera();
}

function delete_entry(e) {
    e.preventDefault();
    console.log("delete!!" + $("#entry-container").data("entryid"));
    $.post("/deleteMemory", {"id": $("#entry-container").data("entryid")})
    .done(function( data ) {
        window.location.href = "/index";
    })
    .fail(function() {
        alert( "error" );
    });
}

function close_edit(e) {
    e.preventDefault();
    $("#edit-text").attr("disabled", true);
    $("#edit-text").removeClass("inputShadow");
    $("#entry-time").removeClass("inputShadow");
    $("#entry-emoji").removeClass("inputShadow");
    $("#entry-image").removeClass("inputShadow");

    $("#edit-text").height( "auto" );
    $("#edit-text").height( $("#edit-text")[0].scrollHeight );

    $("#entry-emoji").attr("data-target", "");
    $("#entry-image").attr("data-target", "#image-modal");


    $("#edit-button").show();
    $("#delete-button").hide();
    $("#cancel-button").hide();
    $("#save-button").hide();
    $("#back-button").show();

    $('#datetime24').combodate('destroy');
    $('#datetime24').hide();
    $('#entry-time').show();

    // $("#askForRecordButton").hide();
    $(".rm-element-button").hide();
    $(".edit-audio-control").hide();

    show_content();
    //The code should be placed below show_contect;
    if( $('#player').attr("src")!=""){
        $("#playButton").show();
        $("#stopButton").show();
    }
}

function save(e) {
    e.preventDefault();
    console.log("save!!");
    var data = {"id": "", "time": {"hour": "", "minute": ""}, "date": {"day": "", "month": "", "year": ""}, "emoji": "", "imageData": "", "audioData": ""};

    data.id = $("#entry-container").data("entryid");

    current_data.memo = $("#edit-text").val();
    data.memo = $("#edit-text").val();

    current_data.time.hour = $('#datetime24').val().substr(0, 2);
    current_data.time.minute = $('#datetime24').val().substr(3, 2);
    current_data.date.month = $('#datetime24').val().substr(6, 2);
    current_data.date.day = $('#datetime24').val().substr(9, 2);
    current_data.date.year = $('#datetime24').val().substr(12, 4);

    data.time.hour = $('#datetime24').val().substr(0, 2);
    data.time.minute = $('#datetime24').val().substr(3, 2);
    data.date.month = $('#datetime24').val().substr(6, 2);
    data.date.day = $('#datetime24').val().substr(9, 2);
    data.date.year = $('#datetime24').val().substr(12, 4);

    current_data.emoji = $("#entry-emoji").data("emojiid");
    current_data.emojiImageURL = $("#entry-emoji").attr("src");
    data.emoji = $("#entry-emoji").data("emojiid");

    current_data.imageURL = $("#entry-image").attr("src");
    if ($("#entry-image").attr("src") == noImageURL)
        data.imageData = "";
    else
        data.imageData = $("#entry-image").attr("src");

    if ($('#player').attr("src") == current_data.audioURL)
        data.audioData = current_data.audioURL;
    else
        data.audioData = audioRecord;
    current_data.audioURL = $('#player').attr("src");

    console.log(current_data.memo);
    console.log(current_data.time);
    console.log(current_data.date);
    console.log(current_data.imageURL);
    console.log(current_data.emoji);
    console.log(current_data.emojiImageURL);
    console.log(current_data.audioURL);
    close_edit(e);

    $.post('/updateMemory', data);
}

function choose_emoji(e) {
    e.preventDefault();
    $("#emoji-modal").modal("toggle");
    $("#entry-emoji").data("emojiid", $(this).attr("id"));
    $("#entry-emoji").attr("src", $(this).attr("src"));
}

function show_content() {
    $("#edit-text").val(current_data.memo);
    $("#edit-text").height( $("#edit-text")[0].scrollHeight );
    $("#datetime24").val(numToString(current_data.time.hour) + ":" + numToString(current_data.time.minute) + " " + numToString(current_data.date.month) + "-" + numToString(current_data.date.day) + "-" + current_data.date.year);
    $("#entry-time").text(numToString(current_data.time.hour) + ":" + numToString(current_data.time.minute) + " " + getWeekday(current_data.date) + " " + monthToString(current_data.date.month) + " " + numToString(current_data.date.day) + ", " + current_data.date.year);
    $("#entry-image").attr("src", current_data.imageURL);
    $("#entry-emoji").attr("src", current_data.emojiImageURL);
    $("#player").attr("src", current_data.audioURL);
}

function previewCamera() {
    var video = document.getElementById('video');
    // Get access to the camera!
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Not adding `{ audio: true }` since we only want video now
        navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
            video.src = window.URL.createObjectURL(stream);
        });
    }
    video.play();
}

function snapImage() {
    console.log("snap clicked");
    $('#camera-modal').modal('toggle');
    var canvas = document.createElement('canvas');
    canvas.setAttribute("width", $("#entry-image").width);
    var context = canvas.getContext('2d');
    var video = document.getElementById('video');
    canvas.setAttribute("height", canvas.width / video.videoWidth * video.videoHeight);
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    $("#entry-image").attr("src", canvas.toDataURL(""));
    $("#img-rm-button").show();
}

function readImageFile() {
    console.log("gallery clicked");
    var x = document.createElement("INPUT");
    x.setAttribute("type", "file");
    x.setAttribute("accept", "image/*");
    x.click();
    x.onchange = function() {
        readImage(this);
    };
    $("#img-rm-button").show();
}

function readImage(input) {
    console.log("change image!!");
    if (input.files && input.files[0]) {
        console.log("draw image!!");
        var reader = new FileReader();
        reader.onload = function (e) {
            var img = document.getElementById('entry-image');
            img.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }

    $('#camera-modal').modal('toggle');
}

function monthToString(month) {
    month = parseInt(month);
    switch(month) {
        case 1:
            return "Mon";
        case 2:
            return "Feb";
        case 3:
            return "Mar";
        case 4:
            return "Apr";
        case 5:
            return "May";
        case 6:
            return "Jun";
        case 7:
            return "Jul";
        case 8:
            return "Aug";
        case 9:
            return "Sep";
        case 10:
            return "Oct";
        case 11:
            return "Nov";
        case 12:
            return "Dec";
    }
}

function getWeekday(date) {
    console.log(date);
    var day = new Date(date.year, date.month - 1, date.day);
    console.log(day.getDay());
    switch(day.getDay()) {
        case 1:
            return "Mon.";
        case 2:
            return "Tue.";
        case 3:
            return "Wed.";
        case 4:
            return "Thu.";
        case 5:
            return "Fri.";
        case 6:
            return "Sat.";
        case 0:
            return "Sun.";
    }
}

function removeElement(e){

    if(e.target.id == "audio-rm-button"){
        console.log("remove audio");
        $('#playButton').hide();
        $('#stopButton').hide();
        $('#audio-record-icon').hide();
        $('#audio-rm-button').hide();
        var player = document.getElementById('player');
        player.src = '';
        audioRecord = "";
        //TO-DO: Change the audioURL of the entry to "";

    }else if(e.target.id == "img-rm-button"){
        console.log("remove image");        
        var img = document.getElementById('entry-image');
        $('#img-rm-button').hide();
        img.src = noImageURL;
        //TO-DO: Change the imgURL of the entry to "";

    }else if(e.target.id == "text-rm-button"){
        console.log("remove text");
        $('#edit-text').val('');
        //TO-DO: Change the text of the entry to "";

    }
}


function overwrite_warning(e){
    if(!audioRecord && !$('#player').attr('src')){
        $('#audio-ok-button').hide();
        recordAudio(e);    
    }else{
        $("#audio-warning-modal").modal("show");
    }
    var  okButton = document.getElementById('ok-overwrite-button');
    okButton.onclick = function(e){
        $("#audio-warning-modal").modal("hide");   
        recordAudio(e);
    }

}



function recordAudio(e){

    // if(!audioRecord){
    //     $('#audio-ok-button').hide();    
    // }else{
    //     $("#warning-modal").modal("show");
    // }

    $("#recorder-modal").modal("toggle");


    navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

    if (navigator.getUserMedia){
        console.log('getUserMedia supported.');
        var chunks = []; // The container for the audio             
        var soundClips = document.querySelector('.sound-clips');
        var record = document.getElementById('recordButton');
        var okButton = document.getElementById('audio-ok-button');
        var onSuccess = function(stream) {
        var mediaRecorder = new MediaRecorder(stream);
        visualize(stream);

        record.onclick = function() {
            console.log("clicked");
            if(soundClips.childElementCount != 0){
                soundClips.removeChild(soundClips.childNodes[0]);
            }
            if(recording==false){
                mediaRecorder.start();
                console.log(mediaRecorder.state);
                console.log("recorder started");
                record.style.background = "red";
                record.textContent = "Stop"
            }else{
                mediaRecorder.stop();
                console.log(mediaRecorder.state);
                console.log("recorder stopped");
                record.style.background = "";
                record.style.color = "";
                record.textContent = "Record"    
            }
            recording =!recording;
        }

        mediaRecorder.onstop = function(e) {
            console.log("data available after MediaRecorder.stop() called.");
            $('#audio-ok-button').show();

            var clipContainer = document.createElement('article');
            var clipLabel = document.createElement('p');
            var audio = document.createElement('audio');
            var deleteButton = document.createElement('button');
            var modelExit = document.getElementById('recorder-modal-exit-button');
            clipContainer.classList.add('clip');
            audio.setAttribute('controls', '');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete';

            clipContainer.appendChild(audio);
            // clipContainer.appendChild(clipLabel);
            clipContainer.appendChild(deleteButton);
            soundClips.appendChild(clipContainer);

            audio.controls = true;
            var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
            chunks = [];
            var audioURL = window.URL.createObjectURL(blob); 
            audio.src = audioURL;
            
            //Save to global var.
            // audioRecord = blob;
            

            modelExit.onclick = function(e){
                deleteButton.click();
            }

            deleteButton.onclick = function(e) {
                audioRecord = "";
                $('#audio-ok-button').hide();
                if(e.target.parentNode.parentNode!=null){
                    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
                }
            }

            okButton.onclick = function(e){
                deleteButton.click();
                var player= document.getElementById('player');
                player.src = audioURL;
                var reader = new window.FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function() {
                    audioRecord = reader.result;         
                };
                $('#audio-rm-button').show();
                $('#audio-record-icon').show();
                $("#recorder-modal").modal("toggle");

            }
        }

        mediaRecorder.ondataavailable = function(e) {
            chunks.push(e.data);
        }
    }

        var onError = function(err) {
            console.log('The following error occured: ' + err);
        }

        navigator.getUserMedia({ audio: true }, onSuccess, onError);   
    
    } else {
        console.log('getUserMedia not supported!');
        alert('getUserMedia not supported!');
    }
}

function visualize(stream) {

    var canvas = document.querySelector('.visualizer');
    var audioCtx = new (window.AudioContext || webkitAudioContext)();
    var canvasCtx = canvas.getContext("2d");
    var source = audioCtx.createMediaStreamSource(stream);
    var analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    
    source.connect(analyser);
    draw()

    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);
        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
        canvasCtx.beginPath();
        var sliceWidth = canvas.width * 1.0 / bufferLength;
        var x = 0;
        for(var i = 0; i < bufferLength; i++) {
     
            var v = dataArray[i] / 128.0;
            var y = v * canvas.height/2;
            if(i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        canvasCtx.lineTo(canvas.width, canvas.height/2);
        canvasCtx.stroke();
    }
}

function numToString(num) {
    if (num / 10 < 1)
        num = ("0" + num).slice(-2);
    return num;
}