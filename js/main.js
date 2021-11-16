const $form = document.querySelector('#input-song');
const $song = document.querySelector('#song');
const $artist = document.querySelector('#artist');
const $playBtn = document.querySelector('#play-btn');
const $cards = document.querySelectorAll('.card');
const $homeIcon = document.querySelector('i');
const $divCardLyrics = document.querySelector('#card-lyrics');
const $arrowUp = document.querySelector('#arrowUp');
const $arrowDown = document.querySelector('#arrowDown');
const $songHeading = document.querySelector('#songHeading');
const $artistHeading = document.querySelector('#artistHeading');
const $lyricsInput = document.querySelector('#lyrics-input');
const $nextBtn = document.querySelector('#next-btn');
const $cardIndicator = document.querySelector('h5');
const $inputDiv = document.querySelector('#input-div');
const $overlay = document.querySelector('.overlay');
const $modalScore = document.querySelector('#modal-score');
const $modalFinalScore = document.querySelector('#modal-final-score');
const $awesomeBtn = document.querySelectorAll('.awesome-btn');
const $modalText = document.querySelector('#modal-text');
const $playAgainBtn = document.querySelector('#play-again');
const $ul = document.querySelector('ul');
const $scoreText = document.querySelector('.score-text');
const $scoreCard = document.querySelector('.card-score');
const $totalScore = document.querySelector('.total-score');
const $finalTotalScore = document.querySelector('.final-total-score');
const $modalSong = document.querySelector('.modal-song');
const $emptyPlaylistText = document.querySelector('#empty-playlist');
const $playNextBtn = document.querySelector('#play-next');
const $playRandomBtn = document.querySelector('#play-random');
const $lyricsHeader = document.querySelector('#lyrics-header');
const $body = document.querySelector('body');

$form.addEventListener('submit', handlePlaylist);
$playBtn.addEventListener('click', handlePlay);
$homeIcon.addEventListener('click', handleClickHome);
$arrowUp.addEventListener('click', handleArrowUp);
$arrowDown.addEventListener('click', handleArrowDown);
$nextBtn.addEventListener('click', handleSubmitLyrics);
$playAgainBtn.addEventListener('click', handlePlayAgain);
$ul.addEventListener('click', handleDelete);
$ul.addEventListener('click', handlePlayFromPlaylist);
$playNextBtn.addEventListener('click', handlePlayNext);
$playRandomBtn.addEventListener('click', handlePlayRandom);
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('DOMContentLoaded', contentLoaded);

for (const i of $awesomeBtn) {
  i.addEventListener('click', handleAwesomeBtn);
}

function contentLoaded(event) {
  if (data.playlist.length !== 0) {
    $emptyPlaylistText.className = 'hidden center';
  }
  for (let i = 0; i < data.playlist.length; i++) {
    $ul.appendChild(renderPlaylist(data.playlist[i].song, data.playlist[i].artist, data.playlist[i].id));
  }
}

function handleKeyDown(event) {
  if (event.key === 'ArrowDown' && $arrowDown.className === 'pos-abs fas fa-angle-down') {
    handleArrowDown();
  } else if (event.key === 'ArrowUp' && $arrowUp.className === 'pos-abs fas fa-angle-up') {
    handleArrowUp();
  } else if (event.key === 'Enter') {
    if ($modalScore.className === 'modal' || $modalFinalScore.className === 'modal') {
      handleAwesomeBtn();
    } else if ($inputDiv.className === 'center margin-0') {
      handleSubmitLyrics();
    }
  }
}

function handlePlayNext(event) {
  if (data.playlistIndexOfCurrentSong !== data.playlist.length - 1) {
    data.playlistIndexOfCurrentSong++;
  } else {
    data.playlistIndexOfCurrentSong = 0;
  }
  clearData();
  getLyrics(data.playlist[data.playlistIndexOfCurrentSong].song, data.playlist[data.playlistIndexOfCurrentSong].artist);
  data.song = `"${capitalizeWords(data.playlist[data.playlistIndexOfCurrentSong].song)}"`;
  data.artist = `by ${capitalizeWords(data.playlist[data.playlistIndexOfCurrentSong].artist)}`;
  $songHeading.textContent = data.song;
  $artistHeading.textContent = data.artist;
  $inputDiv.className = 'center margin-0';
  $arrowDown.className = 'hidden pos-abs fas fa-angle-down';
  $arrowUp.className = 'hidden pos-abs fas fa-angle-up';
  lyricsSwap(data.lyricCard);
}

function clearData() {
  while ($divCardLyrics.firstChild) {
    $divCardLyrics.removeChild($divCardLyrics.firstChild);
  }
  while ($modalSong.firstChild) {
    $modalSong.removeChild($modalSong.firstChild);
  }
  data.lyrics = null;
  data.lyricCard = 0;
  data.totalLyricCards = 0;
  data.randomLyricLine = [];
  data.missingWords = [];
  data.submittedWords = [];
  data.submittedCard = 0;
  data.runningScore = 0;
  data.completed = false;
}

function handlePlayRandom(event) {
  data.playlistIndexOfCurrentSong = Math.floor(Math.random() * data.playlist.length);
  clearData();
  getLyrics(data.playlist[data.playlistIndexOfCurrentSong].song, data.playlist[data.playlistIndexOfCurrentSong].artist);
  data.song = `"${capitalizeWords(data.playlist[data.playlistIndexOfCurrentSong].song)}"`;
  data.artist = `by ${capitalizeWords(data.playlist[data.playlistIndexOfCurrentSong].artist)}`;
  $songHeading.textContent = data.song;
  $artistHeading.textContent = data.artist;
  $inputDiv.className = 'center margin-0';
  $arrowDown.className = 'hidden pos-abs fas fa-angle-down';
  $arrowUp.className = 'hidden pos-abs fas fa-angle-up';
  lyricsSwap(data.lyricCard);
}

function handlePlay(event) {
  event.preventDefault();
  const $songValue = $song.value;
  const $artistValue = $artist.value;
  getLyrics($songValue, $artistValue);
  data.song = `"${capitalizeWords($songValue)}"`;
  data.artist = `by ${capitalizeWords($artistValue)}`;
  $songHeading.textContent = data.song;
  $artistHeading.textContent = data.artist;
  $cardIndicator.textContent = (data.lyricCard + 1) + '/' + data.totalLyricCards;
  data.playingFromPlaylist = false;
  $playNextBtn.className = 'red-bg hidden';
  $playRandomBtn.className = 'red-bg hidden';
  $arrowDown.className = 'hidden pos-abs fas fa-angle-down';
  cardSwap('lyrics');
}

function capitalizeWords(string) {
  const lowerCased = string.toLowerCase();
  const upperCased = string.toUpperCase();
  let output = upperCased[0];
  for (let i = 1; i < string.length; i++) {
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
    if (data.completed === false) {
      $inputDiv.className = 'center margin-0';
    }
  } else {
    data.lyricCard++;
  }
  $cardIndicator.textContent = (data.lyricCard + 1) + '/' + data.totalLyricCards;
  lyricsSwap(data.lyricCard);
}

function handleClickHome(event) {
  clearData();
  $form.reset();
  $songHeading.textContent = '';
  $artistHeading.textContent = '';
  $arrowDown.className = 'pos-abs fas fa-angle-down';
  $inputDiv.className = 'center margin-0';
  cardSwap('choose');
}

function cardSwap(card) {
  for (let i = 0; i < $cards.length; i++) {
    if (card === $cards[i].getAttribute('data-view')) {
      $cards[i].className = 'card';
    } else {
      $cards[i].className = 'card hidden';
    }
  }
}

function lyricsSwap(lyricCard) {
  const $cardLyrics = document.querySelectorAll('.lyrics');
  for (let i = 0; i < $cardLyrics.length; i++) {
    if (parseInt($cardLyrics[i].getAttribute('lyric-card')) === lyricCard) {
      $cardLyrics[i].className = 'lyrics';
    } else {
      $cardLyrics[i].className = 'lyrics hidden';
    }
  }
}

function getLyrics(song, artist) {
  const xhr = new XMLHttpRequest();
  const url = 'http://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=' + song + '&q_artist=' + artist + '&apikey=ede8285d3054993fe551720e102aa1a6';
  const sanitizedURL = encodeURIComponent(url);
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + sanitizedURL);
  xhr.responseType = 'json';
  if (!xhr.response) {
    $lyricsHeader.textContent = 'Finding song...';
  }
  xhr.addEventListener('load', function () {
    const $lyrics = xhr.response.message.body.lyrics.lyrics_body;
    $lyricsHeader.textContent = 'Fill in the lyrics!';
    data.lyrics = $lyrics;
    putLyrics($lyrics);
    lyricsSwap(data.lyricCard);
  });
  xhr.send();
}

function putLyrics(lyrics) {
  const lyricsArray = lyrics.split('\n');
  let count = 0;
  let cardCount = 0;
  for (let i = 0; i < lyricsArray.length - 4; i += 3) {
    const indexEmptyLine = lyricsArray.indexOf('');
    if (indexEmptyLine > -1) {
      lyricsArray.splice(indexEmptyLine, 1);
    }
    const lyricLi = document.createElement('li');
    const lyricP1 = document.createElement('p');
    const lyricP2 = document.createElement('p');
    const lyricP3 = document.createElement('p');
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
  for (let j = 0; j < cardCount; j++) {
    randomizeMissingLyrics(j.toString());
  }
  $cardIndicator.textContent = '1/' + data.totalLyricCards;
}

function randomizeMissingLyrics(lyricCardNumber) {
  const $cardLyrics = document.querySelectorAll('.lyrics');
  const $p = $cardLyrics[lyricCardNumber].querySelectorAll('p');
  const randomLine = Math.floor(Math.random() * $p.length);
  data.randomLyricLine.push(randomLine);
  const wordsOfRandomLine = $p[randomLine].textContent.split(' ');
  const randomIndex = Math.floor(Math.random() * (wordsOfRandomLine.length - 1));
  let randomActualWords = '';
  randomActualWords = [wordsOfRandomLine[randomIndex], wordsOfRandomLine[randomIndex + 1]];
  const splitted = $p[randomLine].textContent.split(randomActualWords[0] + ' ' + randomActualWords[1]);
  data.missingWords.push(randomActualWords);
  const $span1 = document.createElement('span');
  const $span2 = document.createElement('span');
  $span1.textContent = '___';
  $span1.className = 'span1';
  $span2.textContent = '___';
  $span2.className = 'span2';
  $p[randomLine].textContent = '';
  $p[randomLine].append(splitted[0], $span1, $span2, splitted[1]);
}

function handleSubmitLyrics(event) {
  const $cardLyrics = document.querySelectorAll('.lyrics');
  const $p = $cardLyrics[data.lyricCard].querySelectorAll('p');
  const $span = $p[data.randomLyricLine[data.lyricCard]].querySelectorAll('span');
  data.submittedWords.push($lyricsInput.value);
  const $wordsOfInput = $lyricsInput.value.split(' ');
  const numberOfMissingWords = 2;
  for (let i = 0; i < numberOfMissingWords; i++) {
    const strippedWords = data.missingWords[data.lyricCard][i].toLowerCase().replace(/[?!,."'\\()]/, '');
    if (!$wordsOfInput[i]) {
      $span[i].className = 'incorrect italic';
      if (i === numberOfMissingWords - 1) {
        $span[i].textContent = data.missingWords[data.lyricCard][i];
      } else {
        $span[i].textContent = data.missingWords[data.lyricCard][i] + ' ';
      }
    } else if ($wordsOfInput[i].toLowerCase() === strippedWords || $wordsOfInput[i].toLowerCase() === data.missingWords[data.lyricCard][i].toLowerCase()) {
      $span[i].className = 'correct';
      data.score++;
      data.runningScore++;
      if (i === numberOfMissingWords - 1) {
        $span[i].textContent = data.missingWords[data.lyricCard][i];
      } else {
        $span[i].textContent = data.missingWords[data.lyricCard][i] + ' ';
      }
    } else {
      $span[i].className = 'incorrect';
      if (i === numberOfMissingWords - 1) {
        $span[i].textContent = data.missingWords[data.lyricCard][i];
      } else {
        $span[i].textContent = data.missingWords[data.lyricCard][i] + ' ';
      }
    }
  }
  $lyricsInput.value = '';
  $overlay.className = 'overlay';
  $body.className = 'overflow-hidden';
  if (data.lyricCard === data.totalLyricCards - 1) {
    $finalTotalScore.textContent = 'Your final score: ' + data.runningScore + '/' + data.totalLyricCards * 2;
    $modalSong.append(data.song, document.createElement('br'), data.artist);
    $modalFinalScore.className = 'modal';
    data.completed = true;
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
  $body.className = '';
}

function handlePlayAgain(event) {
  $inputDiv.className = 'center margin-0';
  $arrowDown.className = 'hidden pos-abs fas fa-angle-down';
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
  data.completed = false;
  putLyrics(data.lyrics);
  lyricsSwap(data.lyricCard);
}

function handlePlaylist(event) {
  event.preventDefault();
  const id = data.playlistID;
  data.playlist.push({ id: data.playlistID, song: event.target.song.value, artist: event.target.artist.value });
  $emptyPlaylistText.className = 'hidden center';
  $ul.append(renderPlaylist(event.target.song.value, event.target.artist.value, id));
  data.playlistID++;
  $form.reset();
}

function renderPlaylist(song, artist, id) {
  const li = document.createElement('li');
  const row = document.createElement('div');
  const columnA = document.createElement('div');
  const columnB = document.createElement('div');
  const columnC = document.createElement('div');
  const a = document.createElement('a');
  const deleteIcon = document.createElement('i');
  const p = document.createElement('p');
  const br = document.createElement('br');
  const button = document.createElement('button');
  const playIcon = document.createElement('i');
  li.setAttribute('data-playlist-id', id);
  row.setAttribute('class', 'row');
  columnA.setAttribute('class', 'column-one-tenths center');
  columnB.setAttribute('class', 'column-seven-tenths padding-top');
  columnC.setAttribute('class', 'column-two-tenths center');
  a.setAttribute('href', '#');
  deleteIcon.setAttribute('class', 'fas fa-times delete');
  playIcon.setAttribute('class', 'fas fa-play');
  columnB.append('"', capitalizeWords(song), '"', br, 'by ', capitalizeWords(artist));
  button.setAttribute('class', 'red-bg');
  button.append('Play ', playIcon);

  li.append(row);
  row.append(columnA, columnB, columnC);
  a.append(deleteIcon);
  columnA.append(a);
  columnB.append(p);
  columnC.append(button);
  return li;
}

function handleDelete(event) {
  const $li = document.querySelectorAll('li');
  if (event.target.className === 'fas fa-times delete') {
    const listID = event.target.closest('li').getAttribute('data-playlist-id');
    for (let i = 0; i < $li.length; i++) {
      if ($li[i].getAttribute('data-playlist-id') === listID) {
        $li[i].remove();
      }
      for (let j = 0; j < data.playlist.length; j++) {
        if (parseInt(listID) === data.playlist[j].id) {
          data.playlist.splice(j, 1);
        }
      }
    }
  }
  if (data.playlist.length === 0) {
    $emptyPlaylistText.className = 'center';
  }
}

function handlePlayFromPlaylist(event) {
  if (event.target.className === 'red-bg') {
    const listID = event.target.closest('li').getAttribute('data-playlist-id');
    for (let i = 0; i < data.playlist.length; i++) {
      if (data.playlist[i].id === parseInt(listID)) {
        data.playlistIndexOfCurrentSong = data.playlist.indexOf(data.playlist[i]);
        getLyrics(data.playlist[i].song, data.playlist[i].artist);
        data.song = `"${capitalizeWords(data.playlist[i].song)}"`;
        data.artist = `by ${capitalizeWords(data.playlist[i].artist)}`;
      }
    }
    $inputDiv.className = 'center margin-0';
    $songHeading.textContent = data.song;
    $artistHeading.textContent = data.artist;
    $playNextBtn.className = 'red-bg';
    $playRandomBtn.className = 'red-bg';
    $arrowDown.className = 'hidden pos-abs fas fa-angle-down';
    $cardIndicator.textContent = (data.lyricCard + 1) + '/' + data.totalLyricCards;
    data.playingFromPlaylist = true;
    cardSwap('lyrics');
  }
}
