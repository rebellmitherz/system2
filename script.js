function startCountdown() {
    let time = 900; // 15 Min
    const display = document.getElementById('timer');

    const countdown = setInterval(() => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        if (display) {
            display.textContent = `${minutes}:${seconds}`;
        }

        if (time <= 0) {
            clearInterval(countdown);
        } else {
            time--;
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', startCountdown);