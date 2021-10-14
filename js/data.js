/* exported data */

const previousPlaylist = localStorage.getItem('javascript-local-storage');

let data = {
  playlistID: 0,
  playlist: JSON.parse(previousPlaylist),
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

window.addEventListener('beforeunload', beforeUnload);

function beforeUnload(event) {
  localStorage.setItem('javascript-local-storage', JSON.stringify(data.playlist));
}
