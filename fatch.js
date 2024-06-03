document.addEventListener('contextmenu',event=>event.preventDefault());document.addEventListener('keydown', event => {if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'J' || event.key === 'C')) || (event.ctrlKey && event.key === 'U')){event.preventDefault();}});


//…………………………Variable………………………………
let media = (window.matchMedia("(max-width: 600px)").matches);
const gaaneList = document.querySelector('#gaane');
const searchGaaneList = document.querySelector('#searchGaane');
let songList = [];
let fullSongList = [];
let currentSong;
let pause = document.querySelector('.pause');
let play = document.querySelector('.play');
let index;
let songName = document.querySelector('.songName');
let card_img1 = document.querySelector('#card_img1');
let card_img2 = document.querySelector('#card_img2');
let seeker = document.querySelector(".seeker");

//………………………fatching data……………………
const accessToken = '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';
const owner = 'yash632';
//…………………fatching data END……………………
//……………………Variable END…………………………


//……………………IMP Functions………………………
//…………………………Left height…………………………
document.addEventListener("DOMContentLoaded", function() {
  let homeHeight = document.querySelector('.home').clientHeight;
  let homeStyles = window.getComputedStyle(document.querySelector('.home'));
  let homeMarginTop = parseInt(homeStyles.getPropertyValue('margin-top'));
  let homeMarginBottom = parseInt(homeStyles.getPropertyValue('margin-bottom'));
  let homePaddingTop = parseInt(homeStyles.getPropertyValue('padding-top'));
  let homePaddingBottom = parseInt(homeStyles.getPropertyValue('padding-bottom'));

  let homeTotalVerticalSpace = homeHeight + homeMarginTop + homeMarginBottom + homePaddingTop + homePaddingBottom;
  let windowHeight = window.innerHeight;
  let libraryContent = document.querySelector('.library');
  let libraryContentHeight = windowHeight - homeTotalVerticalSpace - homePaddingTop - homePaddingBottom;
  libraryContent.style.marginTop = '10px';

  libraryContent.style.minHeight = libraryContentHeight + 'px';
});
//……………………Left height END………………………

//time converter code
function formatTime(seconds) {
  if (isNaN(seconds) || seconds === Infinity) {
    return '--:--';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  return `${formattedMinutes}:${formattedSeconds}`;
}
//time converter code END
//…………………IMP Functions END…………………


//……………………List of Function……………………
function funSongList(fdata) {
  data = fdata;
  while (songList.length > 0) {
    songList.pop();
  }
  data.forEach(item => {
    if (item.name.endsWith('.mp3')) {
      // console.log(item.name);
      songList.push(item);
    }
  });
}

function funCurrentSong(dmp3File) {
  mp3File = dmp3File;
  const audio = new Audio(mp3File.download_url);
  audio.play();
  currentSong = audio; // Update the currentSong variable 
}
//code of time and duration 
function funTime() {
  currentSong.addEventListener("timeupdate", function() {

    document.querySelector('.t1').innerText = formatTime(currentSong.currentTime);

    document.querySelector('.t2').innerText = formatTime(currentSong.duration);
  });
}

//seekbar move code
function funSeeker() {
  currentSong.addEventListener("timeupdate", () => {
    seeker.style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });
}

//seekbar click song time sync code
function funSeek_bar() {
  document.querySelector(".seek_bar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    seeker.style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
}

// when song will end this code will play next one
function funNextSong() {
  currentSong.addEventListener("timeupdate", () => {
    if (currentSong.currentTime === currentSong.duration) {
      if (index === songList.length - 1) {
        index = 0;
      } else {
        index++;
      }
      currentSong.pause();
      playMp3(songList[index]);

    }
  });
}

//show song name above crt dtls
function funSongName() {
  songName.textContent = mp3File.name.replaceAll('_', ' ').replaceAll('%', '').replaceAll('.mp3', '');
}

//display song list
function funListItem() {
  gaaneList.innerHTML = ''; // Clear the list before adding new items
  songList.forEach(item => {
    const listItem = document.createElement('li');

    listItem.classList.add('flex');
    listItem.classList.add('align');

    listItem.innerHTML = `<div><img src="music.svg"></div><div class="ellips">${item.name.replace(/%/g, '').charAt(0).toUpperCase() + item.name.slice(1).toLowerCase().replaceAll('_', ' ').replace('.mp3', '')}</div><div><img src="pause.svg" width="40"></div>`;

    function playByCall() {
      playMp3(item);
      pause.classList.add('none');
      play.classList.remove('none');
      const fileNameToFind = currentSong.src;
      index = songList.findIndex(song => song.download_url === fileNameToFind);
      if (index !== -1) {
        console.log(`Index of ${fileNameToFind}: ${index}`);
      } else {
        console.log(`${fileNameToFind} not found in the song list.`);
      }
    }
    listItem.addEventListener('click', () => {
      playByCall()
    });

    // Create a copy of listItem for searchGaaneList
    const searchListItem = listItem.cloneNode(true);
    gaaneList.appendChild(listItem);
    const searchListCont = document.querySelector('.searchListCont');
    if (!searchListCont.classList.contains('searchNone') && searchListCont.style.display !== 'none') {
      searchGaaneList.appendChild(searchListItem); // Append the copied listItem to searchGaaneList
    }

    searchListItem.addEventListener('click', () => {
      playByCall()
    });
  });
}

//……………List of Function END…………………

//…………1……………Fetching API…………………………
async function fetchFileList() {
  const repo = 'BeatBlast_library';

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
      headers: {
        Authorization: `token ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    //console.log(data);
    funSongList(data);

    if (songList.length === 0) {
      console.error('Songs not found in the repository.');
    }

  } catch (error) {
    console.error('Error fetching file list:', error);
  }
}
//END of API …1… fetching function 

//…………2………………Fetching API……………………………
async function fetchFileList2() {
  const repo = 'BeatBlast_library_2';

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
      headers: {
        Authorization: `token ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    funSongList(data);

    if (songList.length === 0) {
      console.error('Songs not found in the repository.');
    }

  } catch (error) {
    console.error('Error fetching file list:', error);
  }
}
//END of API …2… fetching function 

//…………3……………Fetching API…………………………
async function fetchFileList3() {
  const repo = 'BeatBlast_library_warrior';

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
      headers: {
        Authorization: `token ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    funSongList(data);

    if (songList.length === 0) {
      console.error('Songs not found in the repository.');
    }

  } catch (error) {
    console.error('Error fetching file list:', error);
  }
}
//END of API …3… fetching function 

//…………4……………Fetching API…………………………
async function fetchFileList4() {
  const repo = 'BeatBlast_library_trending';

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
      headers: {
        Authorization: `token ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    funSongList(data);

    if (songList.length === 0) {
      console.error('Songs not found in the repository.');
    }

  } catch (error) {
    console.error('Error fetching file list:', error);
  }
}
//END of API …4… fetching function 

//…………5……………Fetching API…………………………
async function fetchFileList5() {
  const repo = 'BeatBlast_library_old';

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
      headers: {
        Authorization: `token ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    funSongList(data);

    if (songList.length === 0) {
      console.error('Songs not found in the repository.');
    }

  } catch (error) {
    console.error('Error fetching file list:', error);
  }
}
//END of API …5… fetching function 

//…………………………PlayMp3……………………………
function playMp3(mp3File) {
  if (currentSong) {
    currentSong.pause();

    let previousPlaying = document.querySelector('.darkPlay');
    if (previousPlaying) {
      previousPlaying.classList.remove('darkPlay');
      previousPlaying.lastElementChild.querySelector('img').src = "pause.svg";
    }
  }

  funCurrentSong(mp3File);
  funTime();
  funSeeker();
  funSeek_bar();
  funNextSong();
  funSongName();

  const fileNameToFind = mp3File.download_url;
  index = songList.findIndex(song => song.download_url === fileNameToFind);
  if (index !== -1) {
    let newPlaying = gaaneList.querySelectorAll('li')[index];
    if (newPlaying) {
      newPlaying.classList.add('darkPlay');
      newPlaying.lastElementChild.querySelector('img').src = "play.svg"; // Change to play icon
    }
  }
}
//…………………………PlayMp3 END……………………………



//………………1…………Play API……………………………
async function playFirstSong() {
  try {
    await fetchFileList();

    funListItem();

  }
  catch (error) {
    console.error('Error playing first song:', error);
  }
}
//………………1………Play API END……………………………

//………………2…………Play API……………………………
async function playFirstSong2() {
  try {
    await fetchFileList2();

    funListItem();

  }
  catch (error) {
    console.error('Error playing first song:', error);
  }
}
//………………2………Play API END……………………………

//………………3…………Play API……………………………
async function playFirstSong3() {
  try {
    await fetchFileList3();

    funListItem();

  }
  catch (error) {
    console.error('Error playing first song:', error);
  }
}
//………………3………Play API END……………………………

//………………4…………Play API……………………………
async function playFirstSong4() {
  try {
    await fetchFileList4();

    funListItem();

  }
  catch (error) {
    console.error('Error playing first song:', error);
  }
}
//………………4………Play API END……………………………

//………………5…………Play API……………………………
async function playFirstSong5() {
  try {
    await fetchFileList5();

    funListItem();

  }
  catch (error) {
    console.error('Error playing first song:', error);
  }
}
//………………5………Play API END……………………………

//………………………controlers…………………………
//………………………play pause key………………………
play.addEventListener('click', () => {
  currentSong.pause();
  pause.classList.remove('none');
  play.classList.add('none');
})

pause.addEventListener('click', () => {
  //.....................
  if (!currentSong) {
    songName.textContent = "Play a Song from Library";
    if (media) {
      let left = document.querySelector('.left')
      left.classList.add('leftactive');
      left.classList.remove('left')
    }
  }
  else {
    currentSong.play();
    pause.classList.add('none');
    play.classList.remove('none');
  }
});
//…………………play pause key END…………………

document.querySelector('.next').addEventListener("click", () => {
  if (index === songList.length - 1) {
    index = 0;
  }
  else {
    index++;
  }
  playMp3(songList[index]);
  pause.classList.add('none');
  play.classList.remove('none');
});

document.querySelector('.pre').addEventListener("click", () => {
  if (index === 0) {
    index = songList.length - 1;
  }
  else {
    index--;
  }
  playMp3(songList[index]);
  pause.classList.add('none');
  play.classList.remove('none');
});
//…………………controlers END…………………………

//……………………………………………………………………………………
function funPlayfun(dfun) {
  fp = dfun;
  let gaane = document.querySelector('#gaane');
  if (gaane.firstElementChild) {
    while (gaane.firstElement) {
      gaane.firstElement.remove();
    }
  }
  let liElements = gaane.querySelectorAll('li');

  liElements.forEach(li => {
    li.remove();
  });
  //playFirstSong();
  fp();
  if (media) {
    let left = document.querySelector('.left');
    left.classList.add('leftactive');
    left.classList.remove('left');
  }
}
//…………………………………………………………………………………
//display all track in library 
function cardplay(playplay) {
  let firstChild = document.querySelector('.scontainer').firstElementChild;

  if (!firstChild.classList.contains('leftactive')) {
    funPlayfun(playplay);

  }
}
//library tracklist function end

//…………………Play Fun Call……………………………
card_img1.addEventListener('click', () => {
  cardplay(playFirstSong);
});
//-----------------------------
card_img2.addEventListener('click', () => {
  cardplay(playFirstSong2);
});
//-----------------------------
card_img3.addEventListener('click', () => {
  cardplay(playFirstSong3);
});
//-----------------------------
card_img4.addEventListener('click', () => {
  cardplay(playFirstSong4);
});
//-----------------------------
card_img5.addEventListener('click', () => {
  cardplay(playFirstSong5);
});
//………………Play Fun Call END………………………
//……………………………………………………………………………………

//…………………………Search………………………………………
function funFullSongList(fdata) {
  data = fdata;
  data.forEach(item => {
    if (item.name.endsWith('.mp3')) {
      fullSongList.push(item);
    }
  });
}

async function fetchAllFileList() {
  const repositories = ['BeatBlast_library', 'BeatBlast_library_2', 'BeatBlast_library_warrior', 'BeatBlast_library_trending', 'BeatBlast_library_old'];

  for (const repo of repositories) {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
        headers: {
          Authorization: `token ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      funFullSongList(data);

      if (fullSongList.length === 0) {
        console.error('Songs not found in the repository.');
      }

    } catch (error) {
      console.error('Error fetching file list:', error);
    }
  }
}

fetchAllFileList();
const searchInput = document.getElementById('searchInput');
let searchbtn = document.querySelector('#searchButton');

searchInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent form submission if inside a form
    searchButton.click(); // Simulate a click on searchButton
  }
});

searchbtn.addEventListener("click", function() {

  let query = document.querySelector('#searchInput').value.trim(); // Trim to remove extra spaces
  if (query.length > 0) {

    if (gaaneList.firstElementChild) {
      while (gaaneList.firstElementChild) {
        gaaneList.firstElementChild.remove();
      }
    }
    if (searchGaaneList.firstElementChild) {
      while (searchGaaneList.firstElementChild) {
        searchGaaneList.firstElementChild.remove();
      }
    }
    songSearch(query);
  } else {
    searchGaaneList.innerHTML = "<li>Please enter a valid song name.</li>";
  }
});



async function songSearch(query) {

  if (songList.length > 0) {
    songList = [];
  }

  if (query) {
    query = query.toLowerCase().replace(/%|_/g, ' ');

    let matchingSongs = fullSongList.filter(song => {
      let formattedSong = song.name.toLowerCase().replace(/%|_/g, ' ');
      return formattedSong.includes(query);
    });

    songList.push(...matchingSongs);
  } else {
    console.log('Invalid input. Please enter a valid song name.');
  }
  if (songList.length > 0) {
    funListItem();
  } else {
    searchGaaneList.innerHTML = "<li>No song found.</li>";
  }
}
//………………………Search END………………………………