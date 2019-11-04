$(document).ready(function(){
  let localStorage = window.localStorage;
 $("#admin-btn").click(function(){
    $("#main-content .container").load("admin.html");
 });   

//  $("#uploadPis").change(function(e){

//   document.getElementById("bannerImg").style.display = "none";
// let input = e.target;
//     if (input.files && input.files[0]) {
//         var reader = new FileReader();

//         reader.onload = function (e) {
//             document.getElementById('bannerImg').src =  e.target.result;
//             document.getElementById('bannerImg').onload = function () {
//               bannerImage = document.getElementById('bannerImg');
//               imgaData = getBase64Image(bannerImage);

//               console.log('writing to local storage:\n' + imgaData);
//               localStorage.setItem('ses_image', imgaData);
//               console.log('image stored');
//           }
//             bannerImage = document.getElementById('bannerImg');
//             let imgData = getBase64Image(bannerImage);
//             console.log({imgData});
//             localStorage.setItem("imgData", imgData);
//             console.log(localStorage.getItem("imgData"));
//         }

//         reader.readAsDataURL(input.files[0]);
//     }

  

//     function getBase64Image(img) {
//       var canva = document.createElement("canvas");
//       canva.id = "baseToImage";
//       // canva.width = img.width;
//       // canva.height = img.height;
  
//       var ctx = canva.getContext("2d");
//       ctx.drawImage(img, 320, 240);
  
//       var dataURL = canva.toDataURL("image/jpeg", 1.0);
  
//       return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
//   }
//  });
 
 $("#registerBtn").click(function (event) {

  //stop submit the form, we will post it manually.
  event.preventDefault();

  
  // Get form
  var form = $('#fileUploadForm')[0];

  if (form.password2.value !== form.password1.value) {
    alert("passowrds don't match !");
    return false;
  }

  if (!form.termCheck.checked) {
    alert("Please accept terms of use");
    return false;
  }

  var registerData = {
    username: form.name.value,
    emailID: form.emailID.value,
    dob: form.dob.value,
    gender: form.genderSelect.value,
    filePath: form.uploadPic.value
  }

//   $.ajax({
//     type: "POST",
//     enctype: 'multipart/form-data',
//     url: "http://localhost:3000/register",
//     data: JSON.stringify({"formDetails": form, "fileReadImage": fileReadImage}),
//     //processData: false,
//    // contentType: false,
//     contentType : 'application/json',
//     cache: false,
//     timeout: 600000,
//     success: function (data) {
// console.log(data);
//         // $("#result").text(data);
//         // console.log("SUCCESS : ", data);
//         // $("#btnSubmit").prop("disabled", false);

//     },
//     error: function (e) {
// console.log(e);
//         // $("#result").text(e.responseText);
//         // console.log("ERROR : ", e);
//         // $("#btnSubmit").prop("disabled", false);

//     }
// });
     

 localStorage.setItem('registerDetails', JSON.stringify(registerData));

// // Create an FormData object 
//   var data = new FormData(form);

// // If you want to add an extra field for the FormData
//   data.append("CustomField", "This is some extra data, testing");

  $("#main-content .container").load("gameSelection.html", function(){
    $("#camera-section").toggle();
    $(".auth-result").hide();
    $(".loader").hide();

    $("#playGame, #playGames").click(function(){
      $("#main-content .container").load("gamePage.html");
    });
    var regFormDetails = JSON.parse(localStorage.getItem('registerDetails'));
    bannerImg = document.getElementById('tableBanner');
    bannerImg.src = "images/" + regFormDetails.filePath.split("\\")[2];
    $(".welcomeBadge > h3").text(`Hi ${regFormDetails.username}!`);
    
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 320;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;

  function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    startbutton = document.getElementById('startbutton');
    stopbutton = document.getElementById('stopbutton');

    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(function(stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(function(err) {
      console.log("An error occurred: " + err);
    });

    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);
      
        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.
      
        if (isNaN(height)) {
          height = width / (4/3);
        }
      
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    startbutton.addEventListener('click', function(ev){
      takepicture();
      ev.preventDefault();
    }, false);

    stopbutton.addEventListener('click', function(ev){
      video.srcObject.getTracks().forEach(function(track) {
        track.stop();
      });
      
      $("#camera-section").hide();
      ev.preventDefault();
    }, false);
    
    clearphoto();
  }

  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }
  
  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

   function takepicture() {
    $(".loader").show();
    $(".auth-result").hide();
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
    
      var data = canvas.toDataURL('image/jpeg', 1.0);
      photo.setAttribute('src', data);
      const blobData = makeblob(data);
     // console.log(blobData);
      processImage();
      
    } else {
      clearphoto();
    }
  }

  async function processImage() {
    // Replace <Subscription Key> with your valid subscription key.
    const MODEL_URL = '/models'

    Promise.all([
 faceapi.loadSsdMobilenetv1Model(MODEL_URL),
 faceapi.loadFaceLandmarkModel(MODEL_URL),
 faceapi.loadFaceRecognitionModel(MODEL_URL),
 faceapi.loadFaceExpressionModel(MODEL_URL),
 faceapi.loadAgeGenderModel(MODEL_URL)
 

]).then(start)

async function start() {
  const input = document.getElementById('photo');

  
let fullFaceDescriptions = await faceapi.detectAllFaces(input).withFaceLandmarks().withFaceDescriptors().withAgeAndGender().withFaceExpressions()
console.log(fullFaceDescriptions, "befre resize======")
fullFaceDescriptions = faceapi.resizeResults(fullFaceDescriptions, {width : input.width, height: input.height})


  var labels = [regFormDetails.username];

var labeledFaceDescriptors = await Promise.all(
  labels.map(async label => {
    // fetch image data from urls and convert blob to HTMLImage element
    // const imgUrl = `${label}.png`
    const img = document.getElementById("tableBanner");
    
    // detect the face with the highest score in the image and compute it's landmarks and face descriptor
    let fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
    fullFaceDescription = faceapi.resizeResults(fullFaceDescription, {width : input.width, height: input.height})
    
    if (!fullFaceDescription) {
      throw new Error(`no faces detected for ${label}`)
    }
    
    const faceDescriptors = [fullFaceDescription.descriptor]
    return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
  })
);

const maxDescriptorDistance = 0.6;
const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance);

const results = fullFaceDescriptions.map(fd => faceMatcher.findBestMatch(fd.descriptor));
console.log(results[0].toString());



$(".auth-result").show();
  $(".age-valid").hide();
  $(".age-invalid").hide();
  $(".age-valid-unhappy").hide();
  $(".response-invalid").hide();
  $(".loader").hide();
  console.log(fullFaceDescriptions, "=====resize");

  if (fullFaceDescriptions.length === 0) {
    $(".response-invalid").show();
    return false;
  }
  const data = fullFaceDescriptions[0];
  const age = data.age;
  const gender = data.gender;
  let negativeEmotions = data.expressions;
  negatives = ["sad", "angry", "fearful", "disgusted"];

  negativeEmotions = Object.keys(negativeEmotions)
  .filter(key => negatives.includes(key))
  .reduce((obj, key) => {
    obj[key] = negativeEmotions[key];
    return obj;
  }, {});

  isEmotional = Object.values(negativeEmotions).some(x=> x > 0.65);
const matchResults = results[0];

$(".playInvalid").show();

  if (matchResults._label === "unknown") {
    $(".face-match > i").removeClass(); 
    $(".face-match > i").addClass("icon-invalid fa-times-circle fa fa-1x");
    $(".playInvalid").hide();
  } else if (matchResults._label === "" && matchResults._distance > 0.6) {
    $(".face-match > i").removeClass();
    $(".face-match > i").addClass("icon-invalid fa-times-circle fa fa-1x");
    $(".playInvalid").hide();
  } else {
    $(".face-match > i").removeClass();
    $(".face-match > i").addClass("icon-valid fa-check-circle fa fa-1x");
  }

  if (age >= 18 && !isEmotional) {
    $(".age-valid").show();
  }

  if (age >= 18 && isEmotional) {
    $(".age-valid-unhappy").show();
  }

  if (age < 18) {
    $(".age-invalid").show();
  }

  console.log({negativeEmotions});

  console.log(data.age, "==age");
  
}
};

  function makeblob(dataURL) {
    const BASE64_MARKER = ';base64,';
    const parts = dataURL.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
  
  $("#playLucky, #playFalls, #playRainbow").click(function(){
    $(".auth-result").hide();
    $("#camera-section").toggle();
    startup();
 });    
  //window.addEventListener('load', startup, false);

  });

  // $.ajax({
  //     type: "POST",
  //     enctype: 'multipart/form-data',
  //     url: "",
  //     data: data,
  //     processData: false,
  //     contentType: false,
  //     cache: false,
  //     timeout: 600000,
  //     success: function (data) {

  //         // $("#result").text(data);
  //         // console.log("SUCCESS : ", data);
  //         // $("#btnSubmit").prop("disabled", false);

  //     },
  //     error: function (e) {

  //         // $("#result").text(e.responseText);
  //         // console.log("ERROR : ", e);
  //         // $("#btnSubmit").prop("disabled", false);

  //     }
  // });

});


    // var subscriptionKey = "6ffffff40cf646b293e972cc1688b41c";

    // var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

    // // Request parameters.
    // var params = {
    //     "returnFaceId": "true",
    //     "returnFaceLandmarks": "false",
    //     "returnFaceAttributes":
    //         "age,gender,headPose,smile,facialHair,glasses,emotion," +
    //         "hair,makeup,occlusion,accessories,blur,exposure,noise"
    // };

    // Display the image.
    // var sourceImageUrl = document.getElementById("inputImage").value;
    // document.querySelector("#sourceImage").src = sourceImageUrl;

    // Perform the REST API call.
    // $.ajax({
    //     url: uriBase + "?" + $.param(params),

    //     // Request headers.
    //     beforeSend: function(xhrObj){
    //         xhrObj.setRequestHeader("Content-Type","application/octet-stream");
    //         xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
    //     },

    //     type: "POST",
    //     processData: false,
    //     contentType: false,

    //     // Request body.
    //     data: {blob},
    // })

    // .done(function(data) {
    //     // Show formatted JSON on webpage.
    //     console.log(JSON.stringify(data, null, 2), "========api result")
        
    // })

    // .fail(function(jqXHR, textStatus, errorThrown) {
    //     // Display error message.
    //     var errorString = (errorThrown === "") ?
    //         "Error. " : errorThrown + " (" + jqXHR.status + "): ";
    //     errorString += (jqXHR.responseText === "") ?
    //         "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
    //             jQuery.parseJSON(jqXHR.responseText).message :
    //                 jQuery.parseJSON(jqXHR.responseText).error.message;
    //     alert(errorString);
    // });

});