var $form = document.querySelector('#input-song');
var $song = document.querySelector('#song');
var $artist = document.querySelector('#artist');
var $playBtn = document.querySelector('#play-btn');
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
var $inputDiv = document.querySelector('#input-div');
var $overlay = document.querySelector('.overlay');
var $modalScore = document.querySelector('#modal-score');
var $modalFinalScore = document.querySelector('#modal-final-score');
var $awesomeBtn = document.querySelectorAll('.awesome-btn');
var $modalText = document.querySelector('#modal-text');
var $playAgainBtn = document.querySelector('#play-again');
// var $playlistBtn = document.querySelector('#playlist-btn');
var $ul = document.querySelector('ul');
var $scoreText = document.querySelector('.score-text');
var $scoreCard = document.querySelector('.card-score');
var $totalScore = document.querySelector('.total-score');
var $finalTotalScore = document.querySelector('.final-total-score');
var $modalSong = document.querySelector('.modal-song');

$form.addEventListener('submit', handlePlaylist);
$playBtn.addEventListener('click', handlePlay);
$homeIcon.addEventListener('click', handleClickHome);
$arrowUp.addEventListener('click', handleArrowUp);
$arrowDown.addEventListener('click', handleArrowDown);
$nextBtn.addEventListener('click', handleSubmitLyrics);
$playAgainBtn.addEventListener('click', handlePlayAgain);
// $playlistBtn.addEventListener('click', handlePlaylist);
for (var i of $awesomeBtn) {
  i.addEventListener('click', handleAwesomeBtn);
}

var song = null;
var artist = null;

function handlePlay(event) {
  event.preventDefault();
  var $songValue = $song.value;
  var $artistValue = $artist.value;
  getLyrics($songValue, $artistValue);
  song = '"' + capitalizeWords($songValue) + '"';
  artist = 'by ' + capitalizeWords($artistValue);
  $songHeading.textContent = song;
  $artistHeading.textContent = artist;
  $cardIndicator.textContent = (data.lyricCard + 1) + '/' + data.totalLyricCards;
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
  $inputDiv.className = 'hidden center margin-0';
  $arrowDown.className = 'pos-abs fas fa-angle-down';
  if (data.lyricCard === 1) {
    data.lyricCard--;
    $arrowUp.className = 'hidden pos-abs fas fa-angle-up';
  } else {
    data.lyricCard--;
  }
  $cardIndicator.textContent = (data.lyricCard + 1) + '/' + data.totalLyricCards;
  lyricsSwap(data.lyricCard);
}

function handleArrowDown(event) {
  $arrowUp.className = 'pos-abs fas fa-angle-up';
  if (data.lyricCard === data.submittedCard - 1 || data.lyricCard === data.totalLyricCards - 2) {
    data.lyricCard++;
    $arrowDown.className = 'hidden pos-abs fas fa-angle-down';
    $inputDiv.className = 'center margin-0';
  } else {
    data.lyricCard++;
  }
  $cardIndicator.textContent = (data.lyricCard + 1) + '/' + data.totalLyricCards;
  lyricsSwap(data.lyricCard);
}

function handleClickHome(event) {
  while ($divCardLyrics.firstChild) {
    $divCardLyrics.removeChild($divCardLyrics.firstChild);
  }
  $songHeading.textContent = '';
  $artistHeading.textContent = '';
  $arrowDown.className = 'pos-abs fas fa-angle-down';
  $inputDiv.className = 'center margin-0';
  data.lyricCard = 0;
  data.totalLyricCards = 0;
  data.lyrics = [];
  data.randomLyricLine = [];
  data.missingWords = [];
  data.submittedWords = [];
  data.submittedCard = 0;
  data.runningScore = 0;
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
    data.lyrics = $lyrics;
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
    $divCardLyrics.append(lyricLi);
    data.totalLyricCards++;
  }
  for (var j = 0; j < cardCount; j++) {
    randomizeMissingLyrics(j.toString());
  }
  $cardIndicator.textContent = '1/' + data.totalLyricCards;
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

function handleSubmitLyrics(event) {
  var $cardLyrics = document.querySelectorAll('.lyrics');
  var $p = $cardLyrics[data.lyricCard].querySelectorAll('p');
  var $span = $p[data.randomLyricLine[data.lyricCard]].querySelectorAll('span');
  data.submittedWords.push($lyricsInput.value);
  var $wordsOfInput = $lyricsInput.value.split(' ');
  for (var i = 0; i < $wordsOfInput.length; i++) {
    var strippedWords = data.missingWords[data.lyricCard][i].split('?').join('').split('!').join('').split(',').join('').split('.').join('').split('\'').join('').split('"').join('').split('(').join('').split(')').join('');
    var noCaps = strippedWords.toLowerCase();
    if ($wordsOfInput[i].toLowerCase() === strippedWords || $wordsOfInput[i].toLowerCase() === noCaps) {
      $span[i].className = 'correct';
      data.score++;
      data.runningScore++;
      if (i === $wordsOfInput.length - 1) {
        $span[i].textContent = data.missingWords[data.lyricCard][i];
      } else {
        $span[i].textContent = data.missingWords[data.lyricCard][i] + ' ';
      }
    } else {
      $span[i].className = 'incorrect';
      if (i === $wordsOfInput.length - 1) {
        $span[i].textContent = data.missingWords[data.lyricCard][i];
      } else {
        $span[i].textContent = data.missingWords[data.lyricCard][i] + ' ';
      }
    }
  }
  $lyricsInput.value = '';
  $overlay.className = 'overlay';
  if (data.lyricCard === data.totalLyricCards - 1) {
    $finalTotalScore.textContent = 'Your final score: ' + data.runningScore + '/' + data.totalLyricCards * 2;
    $modalSong.append(song, document.createElement('br'), artist);
    $modalFinalScore.className = 'modal';
    $inputDiv.className = 'hidden center margin-0';
  } else {
    $modalScore.className = 'modal';
    $scoreCard.textContent = 'You scored ' + data.score + '/ 2 points';
    $totalScore.textContent = 'Total score: ' + data.runningScore + '/' + data.totalLyricCards * 2;
    if (data.score === 2) {
      $scoreText.textContent = 'Good job!';
      $modalText.className = 'green text-align';
    } else if (data.score === 1) {
      $scoreText.textContent = 'Nice try!';
      $modalText.className = 'orange text-align';
    } else {
      $scoreText.textContent = 'Oops!';
      $modalText.className = 'red text-align';
    }
    data.lyricCard++;
    data.submittedCard++;
    $arrowUp.className = 'pos-abs fas fa-angle-up';
    $inputDiv.className = 'center margin-0';
  }
  data.score = 0;
  $cardIndicator.textContent = (data.lyricCard + 1) + '/' + data.totalLyricCards;
  lyricsSwap(data.lyricCard);
}

function handleAwesomeBtn(event) {
  $modalScore.className = 'modal hidden';
  $modalFinalScore.className = 'modal hidden';
  $overlay.className = 'overlay hidden';
}

function handlePlayAgain(event) {
  $inputDiv.className = 'center margin-0';
  while ($divCardLyrics.firstChild) {
    $divCardLyrics.removeChild($divCardLyrics.firstChild);
  }
  while ($modalSong.firstChild) {
    $modalSong.removeChild($modalSong.firstChild);
  }
  data.lyricCard = 0;
  data.totalLyricCards = 0;
  data.randomLyricLine = [];
  data.missingWords = [];
  data.submittedWords = [];
  data.submittedCard = 0;
  data.runningScore = 0;
  putLyrics(data.lyrics);
  lyricsSwap(data.lyricCard);
}

//              <ul>
//               <li>
//                 <div class="row">
//                   <div class="column-a center">
//                     <i id="delete" class="fas fa-times red"></i>
//                   </div>
//                   <div class="column-b">
//                     <p>"Say You Will" <br> by Fleetwood Mac</p>
//                   </div>
//                   <div class="column-c center">
//                     <button id="playlistPlay-btn" class="red-bg" type="submit">Play</button>
//                   </div>
//                 </div>
//               </li>
//             </ul>

function handlePlaylist(event) {
  event.preventDefault();
  $ul.append(renderPlaylist(event.target.song.value, event.target.artist.value));
  $form.reset();
}

function renderPlaylist(song, artist) {
  var li = document.createElement('li');
  var row = document.createElement('div');
  var columnA = document.createElement('div');
  var columnB = document.createElement('div');
  var columnC = document.createElement('div');
  var deleteIcon = document.createElement('i');
  var p = document.createElement('p');
  var br = document.createElement('br');
  var button = document.createElement('button');

  li.setAttribute('id', data.playlistID);
  row.setAttribute('class', 'row');
  columnA.setAttribute('class', 'column-a center');
  columnB.setAttribute('class', 'column-b padding-top');
  columnC.setAttribute('class', 'column-c center');
  deleteIcon.setAttribute('class', 'fas fa-times delete');
  columnB.append('"', capitalizeWords(song), '"', br, 'by ', capitalizeWords(artist));
  button.setAttribute('class', 'red-bg');
  button.textContent = 'Play';

  li.append(row);
  row.append(columnA, columnB, columnC);
  columnA.append(deleteIcon);
  columnB.append(p);
  columnC.append(button);
  return li;
}
