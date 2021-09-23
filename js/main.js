var $form = document.querySelector('#input-form');
var $song = document.querySelector('#song');
var $artist = document.querySelector('#artist');
var $searchBtn = document.querySelector('#search-btn');
var $cards = document.querySelectorAll('.card');
var $homeIcon = document.querySelector('i');
var $divCardLyrics = document.querySelector('#card-lyrics');
var $arrowUp = document.querySelector('#arrowUp');
var $arrowDown = document.querySelector('#arrowDown');
var $songHeading = document.querySelector('#songHeading');
var $artistHeading = document.querySelector('#artistHeading');

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
  $songHeading.textContent = '"' + capitalizeWords($songValue) + '"';
  $artistHeading.textContent = 'by ' + capitalizeWords($artistValue);
  cardSwap('lyrics');
}

function capitalizeWords(string) {
  var lowerCased = string.toLowerCase();
  var upperCased = string.toUpperCase();
  var output = upperCased[0];
  for (var i = 1; i < string.length; i++) {
    if (string[i - 1] === ' ') {
      output += upperCased[i];
    } else {
      output += lowerCased[i];
    }
  }
  return output;
}

function handleArrowUp(event) {
  $arrowDown.className = 'pos-abs fas fa-angle-down';
  if (data.lyricCard === 1) {
    data.lyricCard--;
    $arrowUp.className = 'hidden pos-abs fas fa-angle-up';
  } else {
    data.lyricCard--;
  }
  lyricsSwap(data.lyricCard);
}

function handleArrowDown(event) {
  $arrowUp.className = 'pos-abs fas fa-angle-up';
  if (data.lyricCard === data.totalLyricCards - 1) {
    $arrowDown.className = 'hidden pos-abs fas fa-angle-down';
  } else {
    data.lyricCard++;
  }
  lyricsSwap(data.lyricCard);
}

function handleClickHome(event) {
  while ($divCardLyrics.firstChild) {
    $divCardLyrics.removeChild($divCardLyrics.firstChild);
  }
  $songHeading.textContent = '';
  $artistHeading.textContent = '';
  data.lyricCard = 0;
  data.missingWords = [];
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

function lyricsSwap(lyricCard) {
  var $cardLyrics = document.querySelectorAll('.lyrics');
  for (var i = 0; i < $cardLyrics.length; i++) {
    if (parseInt($cardLyrics[i].getAttribute('lyric-card')) === lyricCard) {
      $cardLyrics[i].className = 'lyrics';
    } else {
      $cardLyrics[i].className = 'lyrics hidden';
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
    putLyrics($lyrics);
    lyricsSwap(data.lyricCard);
  });
  xhr.send();
}

function putLyrics(lyrics) {
  var lyricsArray = lyrics.split('\n');
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
    data.totalLyricCards++;
  }
  for (var j = 0; j < cardCount; j++) {
    randomizeMissingLyrics(j.toString());
  }
}

function randomizeMissingLyrics(lyricCardNumber) {
  var $cardLyrics = document.querySelectorAll('.lyrics');
  var $p = $cardLyrics[lyricCardNumber].querySelectorAll('p');
  var randomLine = Math.floor(Math.random() * $p.length);
  var wordsOfRandomLine = $p[randomLine].textContent.split(' ');
  var randomIndex = Math.floor(Math.random() * wordsOfRandomLine.length);
  var randomActualWords = '';
  randomActualWords = wordsOfRandomLine[randomIndex] + ' ' + wordsOfRandomLine[randomIndex + 1];
  data.missingWords.push(randomActualWords);
  wordsOfRandomLine.splice(randomIndex, 2, '_______');
  $p[randomLine].textContent = wordsOfRandomLine.join(' ');
}
