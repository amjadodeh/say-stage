const body = document.body;

const div = document.querySelector('.subtitles');
var video = document.querySelector('video');
var source = document.querySelector('source');

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

setInterval(() => {
  if (source.src === 'http://127.0.0.1:5500/defaultBackgrounds/1.mp4') {
    source.src = '/defaultBackgrounds/2.mp4';
  } else if (source.src === 'http://127.0.0.1:5500/defaultBackgrounds/2.mp4') {
    source.src = '/defaultBackgrounds/3.mp4';
  } else if (source.src === 'http://127.0.0.1:5500/defaultBackgrounds/3.mp4') {
    source.src = '/defaultBackgrounds/4.mp4';
  } else {
    source.src = '/defaultBackgrounds/1.mp4';
  }

  video.load();
}, 20000);
