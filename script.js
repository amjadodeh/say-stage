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

const fetchBackgroundVideos = (url) => {
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
      } else if (url === 'https://api.pexels.com/videos/search?query=') {
        setTimeout(() => {
          fetchBackgroundVideos(
            fetchUrl + document.querySelector('.topic').value
          );
        }, 20000);
        throw new Error('No topic');
      } else {
        throw new Error('BAD HTTP stuff');
      }
    })
    .then((json) => useNewBackgroundVideos(json))
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

const changeBackgroundVideo = (responseJson, currentVideoIndex) => {
  let bestQualityVideoIndex = findBestVideoQuality(
    currentVideoIndex,
    responseJson
  );

  source.src =
    responseJson.videos[currentVideoIndex].video_files[
      bestQualityVideoIndex
    ].link;

  if (currentVideoIndex === 0) {
    prevBackgrounds = [
      responseJson.videos[currentVideoIndex].video_files[bestQualityVideoIndex]
        .link,
    ];
  } else {
    prevBackgrounds.push(
      responseJson.videos[currentVideoIndex].video_files[bestQualityVideoIndex]
        .link
    );
  }

  video.load();
  console.log(prevBackgrounds);
};

const useNewBackgroundVideos = (responseJson) => {
  let currentTopic = document.querySelector('.topic').value;
  let currentVideoIndex = 1;

  if (responseJson.videos.length === 0) {
    console.log(prevBackgrounds);
    console.log('No videos for this topic...');
  } else {
    changeBackgroundVideo(responseJson, 0);
  }

  var videosLoop = setInterval(() => {
    if (currentTopic !== document.querySelector('.topic').value) {
      console.log(
        `Topic changed from '${currentTopic}' to '${
          document.querySelector('.topic').value
        }'. Clearing interval.`
      );

      clearInterval(videosLoop);
      console.log('Cleared interval.');
      prevBackgrounds = [];
      currentTopic = document.querySelector('.topic').value;
      fetchBackgroundVideos(fetchUrl + document.querySelector('.topic').value);
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
        changeBackgroundVideo(responseJson, currentVideoIndex);
        currentVideoIndex += 1;
      }
    } else {
      changeBackgroundVideo(responseJson, 0);
      currentVideoIndex = 1;
    }
  }, 20000);
};

/********** Styling Stuff **********/

document.querySelector('.topic').addEventListener('keydown', (e) => {
  e.target.setAttribute(
    'style',
    `width: ${(e.target.value.length - 1) * 11}px`
  );
  setTimeout(() => {
    e.target.setAttribute(
      'style',
      `width: ${(e.target.value.length - 1) * 11}px`
    );
  }, 10);
});

/********** The Chosen One **********/

fetchBackgroundVideos(fetchUrl + document.querySelector('.topic').value);
