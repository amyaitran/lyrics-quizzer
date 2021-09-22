var $form = document.querySelector('#input-form');
var $song = document.querySelector('#song');
var $artist = document.querySelector('#artist');
var $searchBtn = document.querySelector('#search-btn');
var $cards = document.querySelectorAll('.card');
var $homeIcon = document.querySelector('i');
var $divCardLyrics = document.querySelector('#card-lyrics');
var $arrowUp = document.querySelector('#arrowUp');
var $arrowDown = document.querySelector('#arrowDown');

$searchBtn.addEventListener('click', handleSearch);
$homeIcon.addEventListener('click', handleClickHome);
$arrowUp.addEventListener('click', handleArrowUp);
$arrowDown.addEventListener('click', handleArrowDown);

function handleSearch(event) {
  event.preventDefault();
  var $songValue = $song.value;
  var $artistValue = $artist.value;
  getLyrics($songValue, $artistValue);
  $form.reset();
  cardSwap('lyrics');
}

function handleArrowUp(event) {
  if (data.lyricCard !== 0) {
    data.lyricCard--;
  }
  lyricsSwap(data.lyricCard);
}
function handleArrowDown(event) {
  data.lyricCard++;
  lyricsSwap(data.lyricCard);
}

function handleClickHome(event) {
  while ($divCardLyrics.firstChild) {
    $divCardLyrics.removeChild($divCardLyrics.firstChild);
  }
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
    // console.log(xhr.status);
    // console.log(xhr.response);
    var $lyrics = xhr.response.message.body.lyrics.lyrics_body;
    // console.log($lyrics);
    putLyrics($lyrics);
    lyricsSwap(data.lyricCard);
  });
  xhr.send();
}

/* <div class="card hidden" data-view="lyrics">
    <h2 class="center">Fill in the lyrics!</h2>
    <ul lyric-card="1">
      <p lyric-line="0">Lately I've been hard to reach</p>
      <p lyric-line="1">I've been too long on my own</p>
      <p lyric-line="2">Everybody has a private world where they can be alone</p>
    </ul>
    <ul lyric-card="2">
      <p lyric-line="3">Lately I've been hard to reach</p>
      <p lyric-line="4">I've been too long on my own</p>
      <p lyric-line="5">Everybody has a private world where they can be alone</p>
    </ul>
    <ul lyric-card="3">
      <p lyric-line="6">Lately I've been hard to reach</p>
      <p lyric-line="7">I've been too long on my own</p>
      <p lyric-line="8">Everybody has a private world where they can be alone</p>
    </ul>
   </div> */

function putLyrics(lyrics) {
  var lyricsArray = [];
  lyricsArray = lyrics.split('\n');
  var count = 0;
  var cardCount = 0;
  for (var i = 0; i < lyricsArray.length; i += 3) {
    if (lyricsArray[i] === '...') {
      break;
    } else if (lyricsArray[i] !== '') {
      var lyricLi = document.createElement('li');
      var lyricP1 = document.createElement('p');
      var lyricP2 = document.createElement('p');
      var lyricP3 = document.createElement('p');
      lyricLi.setAttribute('lyric-card', cardCount);
      lyricLi.setAttribute('class', 'lyrics');
      lyricLi.append(lyricP1, lyricP2, lyricP3);
      lyricP1.setAttribute('lyric-line', count);
      lyricP1.textContent = lyricsArray[count];
      count++;
      lyricP2.setAttribute('lyric-line', count);
      lyricP2.textContent = lyricsArray[count];
      count++;
      lyricP3.setAttribute('lyric-line', count);
      lyricP3.textContent = lyricsArray[count];
      count++;
      cardCount++;
      $divCardLyrics.append(lyricLi);
    } else {
      count++;
    }
  }
  randomizeMissingLyrics('0');
}

function lyricsSwap(lyricCard) {
  var $cardLyrics = document.querySelectorAll('.lyrics');
  // console.log('swapping lyric cards');
  // console.log('$cardlyrics', $cardLyrics);
  for (var i = 0; i < $cardLyrics.length; i++) {
    if (parseInt($cardLyrics[i].getAttribute('lyric-card')) === lyricCard) {
      // console.log('matched: show');
      $cardLyrics[i].className = 'lyrics';
    } else {
      // console.log('not a match: hide');
      $cardLyrics[i].className = 'lyrics hidden';
    }
  }
}

function randomizeMissingLyrics(lyricCardNumber) {
  var $cardLyrics = document.querySelectorAll('.lyrics');
  for (var i = 0; i < $cardLyrics.length; i++) {
    if (lyricCardNumber === $cardLyrics[i].getAttribute('lyric-card')) {
      var $p = $cardLyrics[i].querySelectorAll('p');
      var randomLine = Math.floor(Math.random() * $p.length);
      for (var j = 0; j < $p.length; j++) {
        if ($p[j].getAttribute('lyric-line') === randomLine.toString()) {
          var wordsRandomLine = $p[j].textContent.split(' ');
          var randomWord = Math.floor(Math.random() * wordsRandomLine.length);
          var randomActualWords = '';
          randomActualWords = wordsRandomLine[randomWord] + ' ' + wordsRandomLine[randomWord + 1];
          data.missingWords.push(randomActualWords);
          wordsRandomLine.splice(randomWord, 2, '_______');
          $p[j].textContent = wordsRandomLine.join(' ');
        }
      }
    }
  }
}

// function putLyrics(lyrics) {
//   var lyricsArray = [];
//   lyricsArray = lyrics.split('\n');
//   // console.log('lyricsArray', lyricsArray);
//   var count = 0;
//   var cardCount = 1;
//   for (var i = 0; i < lyricsArray.length - 3; i++) {
//     var lyricUl = document.createElement('ul');
//     var lyricDiv = document.createElement('div');
//     var lyricP = document.createElement('p');
//     lyricUl.append(lyricDiv);
//     lyricUl.setAttribute('lyric-card', cardCount);
//     lyricDiv.append(lyricP);
//     lyricDiv.setAttribute('lyric-line', count);
//     lyricP.textContent = lyricsArray[count];
//     count++;
//     // $ul.append(lyricDiv);
//     // $ul.setAttribute('lyric-card', cardCount);
//     cardCount++;
//     $divCardLyrics.append(lyricUl);
//   }
// }

// $ul.append(lyricsArray[0], lyricsArray[1], lyricsArray[2]);
// $p.textContent = $lyrics;
// var count = 0;
// for (var i = count; i < count + 3;) {
//   $ul.append(lyricsArray[count]);
//   count++;
// }

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
