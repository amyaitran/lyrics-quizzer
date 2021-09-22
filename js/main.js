var $p = document.querySelector('p');
var $form = document.querySelector('#input-form');
var $song = document.querySelector('#song');
var $artist = document.querySelector('#artist');
var $searchBtn = document.querySelector('#search-btn');
var $cards = document.querySelectorAll('.card');
var $homeIcon = document.querySelector('i');

$searchBtn.addEventListener('click', handleSearch);
$homeIcon.addEventListener('click', handleClick);

function handleSearch(event) {
  event.preventDefault();
  var $songValue = $song.value;
  var $artistValue = $artist.value;
  getLyrics($songValue, $artistValue);
  $form.reset();
  cardSwap('lyrics');
}

function handleClick(event) {
  $p.textContent = '';
  cardSwap('choose');
}

function cardSwap(card) {
  for (var i = 0; i < $cards.length; i++) {
    if (card === $cards[i].getAttribute('data-view')) {
      $cards[i].className = 'card';
    } else {
      $cards[i].className = 'card hidden';
    }
  }
}

function getLyrics(song, artist) {
  var xhr = new XMLHttpRequest();
  var url = 'http://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=' + song + '&q_artist=' + artist + '&apikey=ede8285d3054993fe551720e102aa1a6';
  var sanitizedURL = encodeURIComponent(url);
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + sanitizedURL);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var $lyrics = xhr.response.message.body.lyrics.lyrics_body;
    $p.textContent = $lyrics;
  });
  xhr.send();
}

// getSampleData()

// function getSampleData() {
//   var xhr = new XMLHttpRequest();
//   var url = 'http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=15953433&apikey=ede8285d3054993fe551720e102aa1a6';
//   var sanitizedURL = encodeURIComponent(url)
//   xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + sanitizedURL);
//   xhr.responseType = 'json';
//   xhr.addEventListener('load', function () {
//     console.log(xhr.status);
//     console.log(xhr.response);
//   });
//   xhr.send();
// }
// getSampleData()

// key
// ede8285d3054993fe551720e102aa1a6
