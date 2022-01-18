/* exported data */

let data = {
  playlistID: 0,
  playlist: [
    { id: 0, song: 'go your own way', artist: 'fleetwood mac' },
    { id: 1, song: 'landslide', artist: 'fleetwood mac' }
  ],
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
  data = JSON.parse(previousPlaylist);
}

window.addEventListener('beforeunload', beforeUnload);

function beforeUnload(event) {
  localStorage.setItem('javascript-local-storage', JSON.stringify(data));
}
