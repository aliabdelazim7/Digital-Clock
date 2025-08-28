// Enhanced Digital Clock with Multiple Features
class SmartClock {
    constructor() {
        this.initializeElements();
        this.initializeEventListeners();
        this.initializeState();
        this.startClock();
        this.initializeStopwatch();
        this.initializeTimer();
        this.initializeWorldClock();
    }

    initializeElements() {
        // Main clock elements
        this.timeElement = document.getElementById('time');
        this.dateElement = document.getElementById('date');
        this.amPmElement = document.getElementById('am-pm');
        this.timezoneElement = document.getElementById('timezone');
        this.dayOfYearElement = document.getElementById('day-of-year');
        
        // Controls
        this.timezoneSelect = document.getElementById('timezone-select');
        this.format12hr = document.getElementById('12hr');
        this.format24hr = document.getElementById('24hr');
        this.themeToggle = document.querySelector('.theme-toggle');
        
        // Tab elements
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabPanes = document.querySelectorAll('.tab-pane');
        
        // Stopwatch elements
        this.swHours = document.getElementById('sw-hours');
        this.swMinutes = document.getElementById('sw-minutes');
        this.swSeconds = document.getElementById('sw-seconds');
        this.swMilliseconds = document.getElementById('sw-milliseconds');
        this.swStart = document.getElementById('sw-start');
        this.swPause = document.getElementById('sw-pause');
        this.swReset = document.getElementById('sw-reset');
        this.swLap = document.getElementById('sw-lap');
        this.lapList = document.getElementById('lap-list');
        
        // Timer elements
        this.timerHours = document.getElementById('timer-hours');
        this.timerMinutes = document.getElementById('timer-minutes');
        this.timerSeconds = document.getElementById('timer-seconds');
        this.timerDisplay = document.getElementById('timer-display');
        this.timerStart = document.getElementById('timer-start');
        this.timerPause = document.getElementById('timer-pause');
        this.timerReset = document.getElementById('timer-reset');
        
        // World clock elements
        this.nyTime = document.getElementById('ny-time');
        this.nyDate = document.getElementById('ny-date');
        this.londonTime = document.getElementById('london-time');
        this.londonDate = document.getElementById('london-date');
        this.tokyoTime = document.getElementById('tokyo-time');
        this.tokyoDate = document.getElementById('tokyo-date');
        this.sydneyTime = document.getElementById('sydney-time');
        this.sydneyDate = document.getElementById('sydney-date');
    }

    initializeEventListeners() {
        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Format toggle
        this.format12hr.addEventListener('click', () => this.setTimeFormat('12'));
        this.format24hr.addEventListener('click', () => this.setTimeFormat('24'));
        
        // Timezone selector
        this.timezoneSelect.addEventListener('change', (e) => this.changeTimezone(e.target.value));
        
        // Tab switching
        this.tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        
        // Stopwatch controls
        this.swStart.addEventListener('click', () => this.startStopwatch());
        this.swPause.addEventListener('click', () => this.pauseStopwatch());
        this.swReset.addEventListener('click', () => this.resetStopwatch());
        this.swLap.addEventListener('click', () => this.recordLap());
        
        // Timer controls
        this.timerStart.addEventListener('click', () => this.startTimer());
        this.timerPause.addEventListener('click', () => this.pauseTimer());
        this.timerReset.addEventListener('click', () => this.resetTimer());
        
        // Timer input validation
        [this.timerHours, this.timerMinutes, this.timerSeconds].forEach(input => {
            input.addEventListener('input', () => this.updateTimerDisplay());
        });
    }

    initializeState() {
        this.currentTimezone = 'local';
        this.timeFormat = '12';
        this.isDarkTheme = false;
        this.stopwatchRunning = false;
        this.timerRunning = false;
        this.stopwatchStartTime = 0;
        this.stopwatchElapsed = 0;
        this.stopwatchInterval = null;
        this.timerInterval = null;
        this.timerEndTime = 0;
        this.lapTimes = [];
    }

    startClock() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        const now = new Date();
        const timezone = this.currentTimezone === 'local' ? undefined : this.currentTimezone;
        
        // Update main time
        const timeOptions = { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: this.timeFormat === '12',
            timeZone: timezone
        };
        
        const timeString = now.toLocaleTimeString(undefined, timeOptions);
        this.timeElement.textContent = timeString;
        
        // Update AM/PM if 12-hour format
        if (this.timeFormat === '12') {
            const hour = now.getHours();
            const ampm = hour >= 12 ? 'PM' : 'AM';
            this.amPmElement.textContent = ampm;
            this.amPmElement.style.display = 'inline';
        } else {
            this.amPmElement.style.display = 'none';
        }
        
        // Update date
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: timezone
        };
        this.dateElement.textContent = now.toLocaleDateString(undefined, dateOptions);
        
        // Update timezone info
        this.timezoneElement.textContent = timezone === 'local' ? 'Local Time' : timezone;
        
        // Update day of year
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        const isLeapYear = (now.getFullYear() % 4 === 0 && now.getFullYear() % 100 !== 0) || 
                           (now.getFullYear() % 400 === 0);
        const daysInYear = isLeapYear ? 366 : 365;
        this.dayOfYearElement.textContent = `Day ${dayOfYear} of ${daysInYear}`;
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        document.body.classList.toggle('dark-theme', this.isDarkTheme);
        
        const icon = this.themeToggle.querySelector('i');
        if (this.isDarkTheme) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
        
        // Add animation
        this.themeToggle.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            this.themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    }

    setTimeFormat(format) {
        this.timeFormat = format;
        
        // Update button states
        this.format12hr.classList.toggle('active', format === '12');
        this.format24hr.classList.toggle('active', format === '24');
        
        // Update clock immediately
        this.updateClock();
    }

    changeTimezone(timezone) {
        this.currentTimezone = timezone;
        this.updateClock();
        this.updateWorldClock();
    }

    switchTab(tabName) {
        // Update tab buttons
        this.tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Update tab panes
        this.tabPanes.forEach(pane => {
            pane.classList.toggle('active', pane.id === tabName);
        });
        
        // Add animation
        const activePane = document.getElementById(tabName);
        activePane.style.animation = 'none';
        setTimeout(() => {
            activePane.style.animation = 'fadeIn 0.5s ease-out';
        }, 10);
    }

    // Stopwatch functionality
    initializeStopwatch() {
        this.updateStopwatchDisplay();
    }

    startStopwatch() {
        if (!this.stopwatchRunning) {
            this.stopwatchRunning = true;
            this.stopwatchStartTime = Date.now() - this.stopwatchElapsed;
            this.stopwatchInterval = setInterval(() => this.updateStopwatch(), 10);
            
            this.swStart.disabled = true;
            this.swPause.disabled = false;
            this.swLap.disabled = false;
            
            // Add animation
            this.swStart.style.transform = 'scale(0.95)';
            setTimeout(() => this.swStart.style.transform = '', 150);
        }
    }

    pauseStopwatch() {
        if (this.stopwatchRunning) {
            this.stopwatchRunning = false;
            this.stopwatchElapsed = Date.now() - this.stopwatchStartTime;
            clearInterval(this.stopwatchInterval);
            
            this.swStart.disabled = false;
            this.swPause.disabled = true;
            this.swLap.disabled = true;
            
            // Add animation
            this.swPause.style.transform = 'scale(0.95)';
            setTimeout(() => this.swPause.style.transform = '', 150);
        }
    }

    resetStopwatch() {
        this.stopwatchRunning = false;
        this.stopwatchElapsed = 0;
        clearInterval(this.stopwatchInterval);
        
        this.swStart.disabled = false;
        this.swPause.disabled = true;
        this.swLap.disabled = true;
        
        this.updateStopwatchDisplay();
        this.lapTimes = [];
        this.lapList.innerHTML = '';
        
        // Add animation
        this.swReset.style.transform = 'scale(0.95)';
        setTimeout(() => this.swReset.style.transform = '', 150);
    }

    recordLap() {
        if (this.stopwatchRunning) {
            const lapTime = Date.now() - this.stopwatchStartTime;
            this.lapTimes.push(lapTime);
            
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';
            lapItem.textContent = this.formatTime(lapTime);
            
            this.lapList.insertBefore(lapItem, this.lapList.firstChild);
            
            // Add animation
            lapItem.style.animation = 'slideInRight 0.3s ease-out';
        }
    }

    updateStopwatch() {
        const elapsed = Date.now() - this.stopwatchStartTime;
        this.stopwatchElapsed = elapsed;
        this.updateStopwatchDisplay();
    }

    updateStopwatchDisplay() {
        const time = this.stopwatchElapsed;
        const hours = Math.floor(time / (1000 * 60 * 60));
        const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((time % (1000 * 60)) / 1000);
        const milliseconds = Math.floor((time % 1000) / 10);
        
        this.swHours.textContent = hours.toString().padStart(2, '0');
        this.swMinutes.textContent = minutes.toString().padStart(2, '0');
        this.swSeconds.textContent = seconds.toString().padStart(2, '0');
        this.swMilliseconds.textContent = milliseconds.toString().padStart(2, '0');
    }

    formatTime(time) {
        const hours = Math.floor(time / (1000 * 60 * 60));
        const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((time % (1000 * 60)) / 1000);
        const milliseconds = Math.floor((time % 1000) / 10);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }

    // Timer functionality
    initializeTimer() {
        this.updateTimerDisplay();
    }

    startTimer() {
        if (!this.timerRunning) {
            const hours = parseInt(this.timerHours.value) || 0;
            const minutes = parseInt(this.timerMinutes.value) || 0;
            const seconds = parseInt(this.timerSeconds.value) || 0;
            
            if (hours === 0 && minutes === 0 && seconds === 0) {
                alert('Please set a timer duration');
                return;
            }
            
            const totalTime = (hours * 3600 + minutes * 60 + seconds) * 1000;
            this.timerEndTime = Date.now() + totalTime;
            this.timerRunning = true;
            
            this.timerInterval = setInterval(() => this.updateTimer(), 100);
            
            this.timerStart.disabled = true;
            this.timerPause.disabled = false;
            
            // Add animation
            this.timerStart.style.transform = 'scale(0.95)';
            setTimeout(() => this.timerStart.style.transform = '', 150);
        }
    }

    pauseTimer() {
        if (this.timerRunning) {
            this.timerRunning = false;
            clearInterval(this.timerInterval);
            
            this.timerStart.disabled = false;
            this.timerPause.disabled = true;
            
            // Add animation
            this.timerPause.style.transform = 'scale(0.95)';
            setTimeout(() => this.timerPause.style.transform = '', 150);
        }
    }

    resetTimer() {
        this.timerRunning = false;
        clearInterval(this.timerInterval);
        
        this.timerHours.value = 0;
        this.timerMinutes.value = 0;
        this.timerSeconds.value = 0;
        
        this.timerStart.disabled = false;
        this.timerPause.disabled = true;
        
        this.updateTimerDisplay();
        
        // Add animation
        this.timerReset.style.transform = 'scale(0.95)';
        setTimeout(() => this.timerReset.style.transform = '', 150);
    }

    updateTimer() {
        const remaining = this.timerEndTime - Date.now();
        
        if (remaining <= 0) {
            this.timerComplete();
            return;
        }
        
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        
        this.timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateTimerDisplay() {
        const hours = parseInt(this.timerHours.value) || 0;
        const minutes = parseInt(this.timerMinutes.value) || 0;
        const seconds = parseInt(this.timerSeconds.value) || 0;
        
        this.timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    timerComplete() {
        this.timerRunning = false;
        clearInterval(this.timerInterval);
        
        this.timerStart.disabled = false;
        this.timerPause.disabled = true;
        
        // Play notification sound (if supported)
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Timer Complete!', {
                body: 'Your timer has finished',
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236366f1"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
            });
        }
        
        // Visual feedback
        this.timerDisplay.style.animation = 'pulse 1s infinite';
        setTimeout(() => {
            this.timerDisplay.style.animation = '';
        }, 3000);
        
        alert('Timer Complete!');
    }

    // World Clock functionality
    initializeWorldClock() {
        this.updateWorldClock();
        setInterval(() => this.updateWorldClock(), 1000);
    }

    updateWorldClock() {
        const cities = [
            { name: 'New York', timezone: 'America/New_York', timeElement: this.nyTime, dateElement: this.nyDate },
            { name: 'London', timezone: 'Europe/London', timeElement: this.londonTime, dateElement: this.londonDate },
            { name: 'Tokyo', timezone: 'Asia/Tokyo', timeElement: this.tokyoTime, dateElement: this.tokyoDate },
            { name: 'Sydney', timezone: 'Australia/Sydney', timeElement: this.sydneyTime, dateElement: this.sydneyDate }
        ];
        
        cities.forEach(city => {
            try {
                const now = new Date();
                const cityTime = new Date(now.toLocaleString('en-US', { timeZone: city.timezone }));
                
                const timeString = cityTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit',
                    hour12: this.timeFormat === '12'
                });
                
                const dateString = cityTime.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                });
                
                city.timeElement.textContent = timeString;
                city.dateElement.textContent = dateString;
            } catch (error) {
                city.timeElement.textContent = '--:--:--';
                city.dateElement.textContent = '--';
            }
        });
    }
}

// Initialize the clock when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SmartClock();
});

// Add pulse animation for timer completion
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);