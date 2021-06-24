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

document.querySelector('.topic').value = 'nature';

let prevBackgrounds = [];

const fetchUrl = 'https://api.pexels.com/videos/search?query=';

const fetchBackgroundVideo = (url) => {
  fetch(url, {
    method: 'get',
    headers: {
      Authorization: '563492ad6f91700001000001343ed614cc24450cb5d792783af9c05d',
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

const findBestVideoQuality = (i, responseJson) => {
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

const displayBackgroundVideo = (responseJson) => {
  let currentTopic = document.querySelector('.topic').value;
  let currentVideoIndex = 1;

  let bestQualityVideoIndex = findBestVideoQuality(0, responseJson);
  source.src = responseJson.videos[0].video_files[bestQualityVideoIndex].link;
  prevBackgrounds = [
    responseJson.videos[0].video_files[bestQualityVideoIndex].link,
  ];
  video.load();
  console.log(prevBackgrounds);

  var videoChanger = setInterval(() => {
    if (responseJson.videos.length === 0) {
      console.log(prevBackgrounds);
      console.log('No videos for this topic...');
    } else if (currentTopic !== document.querySelector('.topic').value) {
      console.log(
        `Topic changed from '${currentTopic}' to '${
          document.querySelector('.topic').value
        }'. Clearing interval.`
      );

      clearInterval(videoChanger);
      console.log('Cleared interval');
      prevBackgrounds = [];
      currentTopic = document.querySelector('.topic').value;
      fetchBackgroundVideo(fetchUrl + document.querySelector('.topic').value);
    } else if (currentVideoIndex < responseJson.videos.length) {
      let bestQualityVideoIndex = findBestVideoQuality(
        currentVideoIndex,
        responseJson
      );

      if (
        !prevBackgrounds.includes(
          responseJson.videos[currentVideoIndex].video_files[
            bestQualityVideoIndex
          ].link
        )
      ) {
        source.src =
          responseJson.videos[currentVideoIndex].video_files[
            bestQualityVideoIndex
          ].link;
        prevBackgrounds.push(
          responseJson.videos[currentVideoIndex].video_files[
            bestQualityVideoIndex
          ].link
        );
        currentVideoIndex += 1;
        video.load();
        console.log(prevBackgrounds);
      }
    } else {
      let bestQualityVideoIndex = findBestVideoQuality(0, responseJson);
      source.src =
        responseJson.videos[0].video_files[bestQualityVideoIndex].link;
      prevBackgrounds = [
        responseJson.videos[0].video_files[bestQualityVideoIndex].link,
      ];
      currentVideoIndex = 1;
      video.load();
      console.log(prevBackgrounds);
    }
  }, 20000);
};

fetchBackgroundVideo(fetchUrl + document.querySelector('.topic').value);
