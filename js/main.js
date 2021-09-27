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
var $lyricsInput = document.querySelector('#lyrics-input');
var $nextBtn = document.querySelector('#next-btn');
var $cardIndicator = document.querySelector('h5');

$searchBtn.addEventListener('click', handleSearch);
$homeIcon.addEventListener('click', handleClickHome);
$arrowUp.addEventListener('click', handleArrowUp);
$arrowDown.addEventListener('click', handleArrowDown);
$nextBtn.addEventListener('click', handleSubmit);

function handleSearch(event) {
  event.preventDefault();
  var $songValue = $song.value;
  var $artistValue = $artist.value;
  getLyrics($songValue, $artistValue);
  $form.reset();
  $songHeading.textContent = '"' + capitalizeWords($songValue) + '"';
  $artistHeading.textContent = 'by ' + capitalizeWords($artistValue);
  $cardIndicator.textContent = data.lyricCard + '/' + data.totalLyricCards;
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
  $cardIndicator.textContent = data.lyricCard + '/' + (data.totalLyricCards - 1);
  lyricsSwap(data.lyricCard);
}

function handleArrowDown(event) {
  $arrowUp.className = 'pos-abs fas fa-angle-up';
  if (data.lyricCard === data.totalLyricCards - 2) {
    data.lyricCard++;
    $arrowDown.className = 'hidden pos-abs fas fa-angle-down';
  } else {
    data.lyricCard++;
  }
  $cardIndicator.textContent = data.lyricCard + '/' + (data.totalLyricCards - 1);
  lyricsSwap(data.lyricCard);
}

function handleClickHome(event) {
  while ($divCardLyrics.firstChild) {
    $divCardLyrics.removeChild($divCardLyrics.firstChild);
  }
  $songHeading.textContent = '';
  $artistHeading.textContent = '';
  $arrowDown.className = 'pos-abs fas fa-angle-down';
  data.lyricCard = 0;
  data.missingWords = [];
  data.submittedWords = [];
  data.totalLyricCards = 0;
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
  for (var i = 0; i < lyricsArray.length - 4; i += 3) {
    var indexEmptyLine = lyricsArray.indexOf('');
    if (indexEmptyLine > -1) {
      lyricsArray.splice(indexEmptyLine, 1);
    }
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
    data.lyrics.push([lyricsArray[i], lyricsArray[i + 1], lyricsArray[i + 2]]);
    $divCardLyrics.append(lyricLi);
    data.totalLyricCards++;
  }
  for (var j = 0; j < cardCount; j++) {
    randomizeMissingLyrics(j.toString());
  }
  $cardIndicator.textContent = data.lyricCard + '/' + (data.totalLyricCards - 1);
}

function randomizeMissingLyrics(lyricCardNumber) {
  var $cardLyrics = document.querySelectorAll('.lyrics');
  var $p = $cardLyrics[lyricCardNumber].querySelectorAll('p');
  var randomLine = Math.floor(Math.random() * $p.length);
  data.randomLyricLine.push(randomLine);
  var wordsOfRandomLine = $p[randomLine].textContent.split(' ');
  var randomIndex = Math.floor(Math.random() * (wordsOfRandomLine.length - 1));
  var randomActualWords = '';
  randomActualWords = [wordsOfRandomLine[randomIndex], wordsOfRandomLine[randomIndex + 1]];
  var splitted = $p[randomLine].textContent.split(randomActualWords[0] + ' ' + randomActualWords[1]);
  data.missingWords.push(randomActualWords);
  var $span1 = document.createElement('span');
  var $span2 = document.createElement('span');
  $span1.textContent = '___';
  $span1.className = 'span1';
  $span2.textContent = '___';
  $span2.className = 'span2';
  $p[randomLine].textContent = '';
  $p[randomLine].append(splitted[0], $span1, $span2, splitted[1]);
}

function handleSubmit(event) {
  var $cardLyrics = document.querySelectorAll('.lyrics');
  var $p = $cardLyrics[data.lyricCard].querySelectorAll('p');
  var $span = $p[data.randomLyricLine[data.lyricCard]].querySelectorAll('span');

  data.submittedWords.push($lyricsInput.value);
  var $wordsOfInput = $lyricsInput.value.split(' ');
  if ($wordsOfInput[0] === data.missingWords[data.lyricCard][0]) {
    $span[0].className = 'correct';
    $span[0].textContent = data.missingWords[data.lyricCard][0] + ' ';
  } else {
    $span[0].className = 'incorrect';
    $span[0].textContent = data.missingWords[data.lyricCard][0] + ' ';
  }
  if ($wordsOfInput[1] === data.missingWords[data.lyricCard][1]) {
    $span[1].className = 'correct';
    $span[1].textContent = data.missingWords[data.lyricCard][1];
  } else {
    $span[1].className = 'incorrect';
    $span[1].textContent = data.missingWords[data.lyricCard][1];
  }
  $lyricsInput.value = '';
  data.lyricCard++;
  $arrowUp.className = 'pos-abs fas fa-angle-up';
  $cardIndicator.textContent = data.lyricCard + '/' + data.totalLyricCards;
  lyricsSwap(data.lyricCard);
}
