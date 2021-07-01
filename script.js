const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {
    width: { ideal: 1280 },
                    height: { ideal: 720 }} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})

    
    function startRecording() {
        
        recordedBlobs = [];
        let options = {mimeType: 'video/webm;codecs=vp9,opus'};
        
        try {
          mediaRecorder = new MediaRecorder(window.stream, options);
        } catch (e) {
          //console.error('Exception while creating MediaRecorder:', e);
          errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
          return;
        }
      
        //console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
        mediaRecorder.onstop = (event) => {
          //console.log('Recorder stopped: ', event);
          //console.log('Recorded Blobs: ', recordedBlobs);
        };
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start();
        //console.log('MediaRecorder started', mediaRecorder.state);
        startTimerForRecording();
      }
      
      function stopRecording() {
        mediaRecorder.stop();
        $("#start-record").html(`Start`)
        
      }
    
      function cancelRecording(){
          if(mediaRecorder.state=="inactive"){
              console.log("recording already stoped")
              recordedBlobs = [];
            $("#start-record").html(`Start`)
            $("#start-record").css("display","flex")
            $("#Register-record").css("display","none")
          }
          else{
            videourl='';
            mediaRecorder.stop();
            recordedBlobs = [];
            $("#start-record").html(`Start`)
            $("#TimerForCapture").css('display', 'none')
            clearInterval(timerForRecording)
          }
      }
    
      function RegisterRecording(){
        const blob = new Blob(recordedBlobs, {type: 'video/webm'});
        videourl = window.URL.createObjectURL(blob);
        // let recordingPreview = document.getElementById("recordingPreview");
        // recordingPreview.src = videourl;
        let file = new File([blob], 'filename', { type: 'video/mp4',    lastModified: Date.now() })
        var form = new FormData();
        form.append("VideoFile", file);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = videourl;
        a.download = 'test.mp4';
        document.body.appendChild(a);
        a.click();
        // var settings = {
        //   "url": location.origin+"/account/FaceRegistration",
        //   "method": "POST",
        //   "timeout": 0,
        //   "processData": false,
        //   "mimeType": "multipart/form-data",
        //   "contentType": false,
        //   "data": form
        // };
        // abp.ui.setBusy()
        // $.ajax(settings).done(function (response) {
        //     abp.ui.clearBusy()
        //   console.log(JSON.parse(response).success);
        //   if(JSON.parse(response).success){
        //     abp.notify.success(JSON.parse(response).result)
        //   }
        //   else{
        //     abp.notify.error(JSON.parse(response).result) 
        //   }
        // });
      }
function handleDataAvailable(event) {
        //console.log('handleDataAvailable', event);
        if (event.data && event.data.size > 0) {
          recordedBlobs.push(event.data);
        }
      }
      function startTimerForRecording(){
        
        var count = 0;
          timerForRecording = setInterval(function(){
            count++
            $("#TimerForCapture").html("<span>"+count+"</span>")
            $("#TimerForCapture").css('display', 'flex')
            $("#start-record").html(`${loadingIcon}  Recording`)
            $("#stop-record").css('display', 'block')
            //console.log(count)
            if(count>=10){
            clearInterval(timerForRecording)
            stopRecording()
            $("#TimerForCapture span").css('background', '#31CE2E')
            $("#start-record").css("display","none")
            $("#Register-record").css("display","flex")
          }
          }, 1000)
          
      }
