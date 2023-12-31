// Selecting DOM elements
const creator = document.querySelector(".creator");
const media = document.querySelector("#audio");
const stopStart = document.querySelector("#play");
const nextTrack = document.querySelector("#next");
const prevTrack = document.querySelector("#prev");
const image = document.querySelector("img");
const seekSlider = document.querySelector(".track-seek");
const currentSecond = document.querySelector("#currentTime");
const totalTime = document.querySelector("#totalTime");
const openTrackList = document.querySelector(".open");
const closeTrackList = document.querySelector(".close-playlist");
const playlistContainer = document.getElementById("playlist");
const mainDivContainer = document.querySelector(".mainDiv");
const shuffleIcon = document.querySelector("#shuffleIcon");
const repeatSong = document.querySelector("#repeatSong");
const showLikedTracks = document.querySelector(".btn-liked");
const showAllTracks = document.querySelector(".btn-all");
// volume
const volumeSlider = document.querySelector(".volume-input");
const volumeSliderİcon = document.querySelector(".volume-icon");

// Variables to control volume and playlist display
let isValumeMuted = false;
let isFavoritedShowing = false;
let playListItem = [];
let waveBars = [];
let currentIcon;
let likedTracks = [];

// Variables to keep track of the current playing index and playlists
let trackIndex = 0;
let allIndexes = [];
let trackCopy = JSON.parse(JSON.stringify(tracks));
let playListItemCopy = [];

// Event listener for shuffle button
shuffleIcon.addEventListener("click", () => {
  shuffleIcon.classList.toggle("shuffling");
});

// Event listener for volume slider
volumeSlider.addEventListener("input", () => {
  media.volume = volumeSlider.value;
  // Change volume icon based on the volume level
  if (media.volume == 0)
    volumeSliderİcon.classList.replace(
      `${volumeSliderİcon.classList[2]}`,
      "fa-volume-off"
    );
  if (media.volume > 0 && media.volume < 0.6)
    volumeSliderİcon.classList.replace(
      `${volumeSliderİcon.classList[2]}`,
      "fa-volume-low"
    );
  if (media.volume >= 0.6)
    volumeSliderİcon.classList.replace(
      `${volumeSliderİcon.classList[2]}`,
      "fa-volume-high"
    );
});

// Event listener for volume icon click (mute/unmute)
volumeSliderİcon.addEventListener("click", () => {
  if (isValumeMuted) {
    // Unmute
    volumeSliderİcon.classList.replace("fa-volume-slash", `${currentIcon}`);
    media.volume = volumeSlider.value;
    isValumeMuted = false;
  } else {
    // Mute
    currentIcon = volumeSliderİcon.classList[2];
    volumeSliderİcon.classList.replace(
      `${volumeSliderİcon.classList[2]}`,
      "fa-volume-slash"
    );
    media.volume = 0;
    isValumeMuted = true;
  }
});

// Event listener for media time update
media.addEventListener("timeupdate", seekUpdate);

// Event listeners for seek slider
seekSlider.addEventListener("input", seek);
seekSlider.addEventListener("mouseover", () => {
  seekSlider.classList.add("hovered");
});
seekSlider.addEventListener("mouseout", () => {
  seekSlider.classList.remove("hovered");
});

// Event listener for play/pause button
stopStart.addEventListener("click", playTrack);

// Event listeners for next and previous track buttons
nextTrack.addEventListener("click", () => {
  indexArrangmentForward();
});
prevTrack.addEventListener("click", () => {
  indexArrangmentBack();
});

// Event listener for opening track list
openTrackList.addEventListener("click", () => {
  mainDivContainer.classList.add("active");
});

// Event listener for repeat button
repeatSong.addEventListener("click", () => {
  repeatSong.classList.toggle("repeat");
});

// Event listener for space key to play/pause
document.addEventListener("keydown", (e) => {
  if (e.key == " ") {
    stopStart.click();
  }
});

// Event listener for the end of the media playback
media.addEventListener("ended", () => {
  // Repeat the track if repeat mode is active, otherwise move to the next track
  if (repeatSong.classList.contains("repeat")) {
    playTrack();
  } else {
    indexArrangmentForward();
  }
});

// Event listener for closing track list
closeTrackList.addEventListener("click", () => {
  mainDivContainer.classList.remove("active");
});

// Function to display beat animation when a track is selected
let currentTrack = null;
function showBeatAnimation(selectedTrack) {
  const selectedTrackChildren = selectedTrack.children[2].children;

  if (currentTrack) {
    for (let i = 0; i < currentTrack.length; i++) {
      currentTrack[i].classList.remove("animationActive");
      currentListItem.classList.remove("trackSelected");
    }
  }
  for (let i = 0; i < selectedTrackChildren.length; i++) {
    selectedTrackChildren[i].classList.add("animationActive");
    selectedTrack.classList.add("trackSelected");
  }
  currentTrack = selectedTrackChildren;
  currentListItem = selectedTrack;
}

// Function to play/pause the track
function playTrack() {
  if (media.paused) {
    stopStart.classList.replace("fa-play", "fa-pause");
    media.play();
    showBeatAnimation(playListItem[trackIndex]);
  } else {
    stopStart.classList.replace("fa-pause", "fa-play");
    media.pause();
    hideBeatAnimation(playListItem[trackIndex]);
  }
}

// Function to load a track
function loadTrack() {
  image.src = `${tracks[trackIndex].trackImg}`;
  media.src = `${tracks[trackIndex].trackUrl}`;
  creator.textContent = tracks[trackIndex].artist;
  media.load();
}

// Function to handle seek slider input
function seek() {
  const seekValue = (seekSlider.value / 100) * media.duration;
  media.currentTime = seekValue;
}

// Function to convert seconds to minutes for display
function convertSecondToMinutes(seconds) {
  let minute = Math.floor(seconds / 60);
  let sec = (seconds % 60).toFixed(0);
  sec = sec < 10 ? "0" + sec : sec;
  return minute + ":" + sec;
}

// Function to update seek slider and display time
function seekUpdate() {
  if (media.duration) {
    const progress = (media.currentTime / media.duration) * 100;
    let mediaTime = convertSecondToMinutes(media.duration);

    seekSlider.value = progress;
    totalTime.textContent = mediaTime;

    if (progress == 100) {
      stopStart.classList.replace("fa-pause", "fa-play");
      hideBeatAnimation(playListItem[trackIndex]);
    }
  }
  currentSecond.textContent = convertSecondToMinutes(media.currentTime);
}

// Function to hide beat animation when a track is paused
function hideBeatAnimation(index) {
  const hideTrack = index.children[2].children;
  for (let i = 0; i < hideTrack.length; i++) {
    hideTrack[i].classList.remove("animationActive");
  }
}

// Variables for shuffle functionality
let initialIndex;

// Function to get a random index for shuffle
function getRandomIndex() {
  let currentIndex;
  do {
    currentIndex = Math.floor(Math.random() * tracks.length);
  } while (currentIndex === initialIndex);

  initialIndex = currentIndex;
  return currentIndex;
}

// Loop through tracks to create playlist items and add event listeners
tracks.forEach((track, index) => {
  const li = document.createElement("li");
  const animationContainer = document.createElement("div");
  animationContainer.className = "loading-wave";
  li.setAttribute("onclick", "showBeatAnimation(this)");
  li.className = "playlist-item";

  li.innerHTML = `<p ><span class="track-number">${index + 1}</span> -  ${
    track.artist
  } </p>  <i class="fa-sharp like-icon  fa-regular fa-heart"></i> `;

  li.addEventListener("click", (e) => {
    e.useCapture = true;
    if (isFavoritedShowing) {
      trackIndex = playListItem.findIndex(
        (listItem) => listItem === e.target.closest("li")
      );
    } else {
      trackIndex = index;
    }

    loadTrack();
    playTrack();
  });

  li.addEventListener("mouseover", () => {
    li.children[1].style.opacity = "1";
  });
  li.addEventListener("mouseout", () => {
    li.children[1].style.opacity = "0";
  });

  // Create loading bars for the beat animation
  for (let i = 1; i <= 4; i++) {
    const animation = document.createElement("div");
    animation.className = `loading-bar`;
    animationContainer.appendChild(animation);
  }

  waveBars.push(animationContainer);
  li.appendChild(animationContainer);
  playlistContainer.appendChild(li);
  playListItem.push(li);
  playListItemCopy = playListItem;
});

// Event listeners for like icons on playlist items
const likeIcon = document.querySelectorAll(".like-icon");
likeIcon.forEach((icon) => {
  icon.addEventListener("click", (event) => {
    event.stopPropagation();
    iconParent = icon.closest("li");
    iconParent.classList.toggle("liked");
    icon.classList.toggle("active");
  });
});

// Create an array of all track indexes
for (let index = 0; index < tracks.length; index++) {
  allIndexes.push(index);
}

// Event listener for showing liked tracks
showLikedTracks.addEventListener("click", () => {
  showLikedTracks.classList.toggle("active");

  // Remove "active" class from showAllTracks if it exists
  showAllTracks.classList.remove("active");

  // Filter liked tracks and rearrange playlist
  likedTracks = playListItem.filter((track) =>
    track.classList.contains("liked")
  );
  if (likedTracks.length > 0) {
    const likedTrackIndexes = likedTracks.map((likedTrack) => {
      return playListItem.findIndex(
        (playlistItem) => playlistItem === likedTrack
      );
    });

    let indexesToRemove = allIndexes.filter(
      (index) => !likedTrackIndexes.includes(index)
    );

    tracks = tracks.filter(
      (t, trackIndex) => !indexesToRemove.includes(trackIndex)
    );
    playListItem = playListItem.filter(
      (t, trackIndex) => !indexesToRemove.includes(trackIndex)
    );
    playListItem.forEach((item, index) => {
      item.children[0].children[0].textContent = index + 1;
    });
    playlistContainer.textContent = "";
    likedTracks.forEach((track) => playlistContainer.appendChild(track));
    isFavoritedShowing = true;
  }
});

// Event listener for showing all tracks
showAllTracks.addEventListener("click", () => {
  showAllTracks.classList.toggle("active");

  // Remove "active" class from showAllTracks if it exists
  showLikedTracks.classList.remove("active");

  // Reset tracks and playlist to the original state
  tracks = trackCopy;
  playListItem = [...playListItemCopy];
  playListItem.forEach((item, index) => {
    item.children[0].children[0].textContent = index + 1;
  });
  playlistContainer.textContent = "";
  playListItem.forEach((track) => playlistContainer.appendChild(track));
  isFavoritedShowing = false;
  playTrack();
});

// Function to move to the previous track
function indexArrangmentBack() {
  trackIndex = shuffleIcon.classList.contains("shuffling")
    ? getRandomIndex()
    : (trackIndex - 1 + tracks.length) % tracks.length;
  showBeatAnimation(playListItem[trackIndex]);
  loadTrack();
  playTrack();
}

// Function to move to the next track
function indexArrangmentForward() {
  trackIndex = shuffleIcon.classList.contains("shuffling")
    ? getRandomIndex()
    : (trackIndex + 1 + tracks.length) % tracks.length;
  showBeatAnimation(playListItem[trackIndex]);
  loadTrack();
  playTrack();
}

// Load the initial track
loadTrack();
