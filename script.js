const body = document.body;

const div = document.querySelector('.subtitles');
var video = document.querySelector('#background');
var source = document.querySelector('source');

/********** Audio Capture Stuff **********/

// var micCapture = document.querySelector('#micCapture');

// var constraints = { audio: true };

// navigator.mediaDevices
//   .getUserMedia(constraints)
//   .then((mediaStream) => {
//     micCapture.srcObject = mediaStream;
//     micCapture.play();
//   })
//   .catch(function (err) {
//     console.log('yikes, and err!' + err.message);
//   });

/********** Subtitle Stuff **********/
const exampleText = 'example';

setInterval(() => {
  if (div.innerText === '...') {
    div.innerText = `${exampleText} `;
  } else if (div.innerText.split(' ').length < 4) {
    div.append(`${exampleText} `);
  } else if (div.innerText.split(' ').length == 4) {
    div.append(`${exampleText}`);
  } else {
    div.innerText = '...';
  }
}, 750);

/********** Background Stuff **********/

let prevBackgrounds = ['http://127.0.0.1:5500/defaultBackgrounds/1.mp4'];

let topic = 'nature';

let fetchUrl = 'https://api.pexels.com/videos/search?query=';

let fetchBackgroundVideo = (url) => {
  fetch(url, {
    method: 'get',
    headers: {
      Authorization: '563492ad6f91700001000001e6dc0d922c664b3b995eedd2333b7b68',
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('BAD HTTP stuff');
      }
    })
    .then((json) => displayBackgroundVideo(json))
    .catch((err) => {
      console.log(`Something went wrong: ${err.message}`);
    });
};

let findBestVideoQuality = (i, responseJson) => {
  for (let n = 0; n < responseJson.videos[i].video_files.length; n++) {
    if (
      responseJson.videos[i].video_files[n].height ===
      responseJson.videos[i].height
    ) {
      return n;
    }
  }
  for (let n = 0; n < responseJson.videos[i].video_files.length; n++) {
    if (responseJson.videos[i].video_files[n].height === 2160) {
      return n;
    } else if (responseJson.videos[i].video_files[n].height === 1440) {
      return n;
    } else if (responseJson.videos[i].video_files[n].height === 1080) {
      return n;
    } else if (responseJson.videos[i].video_files[n].height === 720) {
      return n;
    }
  }
  return 1;
};

function displayBackgroundVideo(responseJson) {
  if (responseJson.videos.length === 0) {
    source.src = '/defaultBackgrounds/1.mp4';
    video.load();
    console.log(prevBackgrounds);
    console.log('No videos for this topic...');
  } else {
    let currentBackground = 0;
    setInterval(() => {
      let newBackgroundIndex = findBestVideoQuality(
        currentBackground,
        responseJson
      );
      if (prevBackgrounds.includes(source.src)) {
        source.src =
          responseJson.videos[currentBackground].video_files[
            newBackgroundIndex
          ].link;
        prevBackgrounds.push(
          responseJson.videos[currentBackground].video_files[newBackgroundIndex]
            .link
        );
        currentBackground += 1;
        video.load();
        console.log(prevBackgrounds);
      }
    }, 20000);
  }
}

fetchBackgroundVideo(fetchUrl + topic);
