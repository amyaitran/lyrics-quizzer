/* exported data */

let data = {
  playlistID: 0,
  playlist: [],
  playlistIndexOfCurrentSong: null,
  playingFromPlaylist: false,
  artist: null,
  song: null,
  lyricCard: 0,
  totalLyricCards: 0,
  lyrics: null,
  randomLyricLine: [],
  missingWords: [],
  submittedWords: [],
  submittedCard: 0,
  score: 0,
  runningScore: 0,
  completed: false
};

const previousPlaylist = localStorage.getItem('javascript-local-storage');
if (previousPlaylist !== null) {
  data.playlist = JSON.parse(previousPlaylist);
}

window.addEventListener('beforeunload', beforeUnload);
function beforeUnload(event) {
  localStorage.setItem('javascript-local-storage', JSON.stringify(data.playlist));
}
