let watchStartTime = 0;
let watchElapsedTime = 0;
let watchTimerInterval = null;
let watchIsRunning = false;
let watchLapCount = 0;
let watchLastLapTime = 0;

const watchDisplay = document.getElementById('watchDisplay');
const watchMilliseconds = document.getElementById('watchMilliseconds');
const watchLapsList = document.getElementById('watchLapsList');
const watchStartBtn = document.getElementById('watchStartBtn');
const watchLapBtn = document.getElementById('watchLapBtn');
const watchResetBtn = document.getElementById('watchResetBtn');

// format the time for the display
function watchFormatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    const formattedMs = String(ms).padStart(2, '0');
    
    return {
        main: formattedHours + ':' + formattedMinutes + ':' + formattedSeconds,
        ms: formattedMs
    };
}

function watchUpdateDisplay() {
    const formatted = watchFormatTime(watchElapsedTime);
    watchDisplay.textContent = formatted.main;
    watchMilliseconds.textContent = formatted.ms;
}

// start the timer
function watchStart() {
    if (watchIsRunning) {
        return;
    }
    
    watchIsRunning = true;
    watchStartTime = Date.now() - watchElapsedTime;
    
    watchTimerInterval = setInterval(function() {
        watchElapsedTime = Date.now() - watchStartTime;
        watchUpdateDisplay();
    }, 10);
    
    watchStartBtn.innerHTML = '<i class="bi bi-pause-fill"></i><span>Pause</span>';
    watchStartBtn.classList.add('stop');
    watchStartBtn.classList.remove('watch-btn-primary');
    watchLapBtn.disabled = false;
    watchResetBtn.disabled = false;
}

// pause the timer but not reset it
function watchPause() {
    if (!watchIsRunning) {
        return;
    }
    
    watchIsRunning = false;
    clearInterval(watchTimerInterval);
    
    watchStartBtn.innerHTML = '<i class="bi bi-play-fill"></i><span>Start</span>';
    watchStartBtn.classList.remove('stop');
    watchStartBtn.classList.add('watch-btn-primary');
}

// reset the timer and clear the laps
function watchReset() {
    watchIsRunning = false;
    clearInterval(watchTimerInterval);
    
    watchElapsedTime = 0;
    watchLapCount = 0;
    watchLastLapTime = 0;
    watchLapsList.innerHTML = '';
    
    watchUpdateDisplay();
    
    watchStartBtn.innerHTML = '<i class="bi bi-play-fill"></i><span>Start</span>';
    watchStartBtn.classList.remove('stop');
    watchStartBtn.classList.add('watch-btn-primary');
    watchLapBtn.disabled = true;
    watchResetBtn.disabled = true;
}

// save the current time as lap time
function watchAddLap() {
    if (!watchIsRunning && watchElapsedTime === 0) {
        return;
    }
    
    watchLapCount++;
    const currentLapTime = watchElapsedTime - watchLastLapTime;
    watchLastLapTime = watchElapsedTime;
    
    const lapItem = document.createElement('div');
    lapItem.className = 'watch-lap-item';
    
    const lapNumber = document.createElement('span');
    lapNumber.className = 'watch-lap-number';
    lapNumber.textContent = 'Lap ' + watchLapCount;
    
    const lapTime = document.createElement('span');
    lapTime.className = 'watch-lap-time';
    const formattedLap = watchFormatTime(currentLapTime);
    lapTime.textContent = formattedLap.main + '.' + formattedLap.ms;
    
    const lapDifference = document.createElement('span');
    lapDifference.className = 'watch-lap-difference';
    const formattedTotal = watchFormatTime(watchElapsedTime);
    lapDifference.textContent = formattedTotal.main + '.' + formattedTotal.ms;
    
    lapItem.appendChild(lapNumber);
    lapItem.appendChild(lapTime);
    lapItem.appendChild(lapDifference);
    
    watchLapsList.insertBefore(lapItem, watchLapsList.firstChild);
}

function watchAddLoadingState(button) {
    button.classList.add('loading');
    button.disabled = true;
}

function watchRemoveLoadingState(button) {
    setTimeout(function() {
        button.classList.remove('loading');
        if (watchIsRunning || watchElapsedTime > 0) {
            if (button === watchLapBtn && watchIsRunning) {
                button.disabled = false;
            } else if (button === watchResetBtn) {
                button.disabled = false;
            } else if (button === watchStartBtn) {
                button.disabled = false;
            }
        }
    }, 300);
}

function watchHandleButtonClick(event) {
    const button = event.currentTarget;
    const action = button.getAttribute('data-action');
    
    watchAddLoadingState(button);
    
    if (action === 'start') {
        if (watchIsRunning) {
            watchPause();
        } else {
            watchStart();
        }
    } else if (action === 'lap') {
        watchAddLap();
    } else if (action === 'reset') {
        watchReset();
    }
    
    watchRemoveLoadingState(button);
}

watchStartBtn.addEventListener('click', watchHandleButtonClick);
watchLapBtn.addEventListener('click', watchHandleButtonClick);
watchResetBtn.addEventListener('click', watchHandleButtonClick);

watchUpdateDisplay();

