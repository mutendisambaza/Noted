const data = null;

const xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener('readystatechange', function () {
	if (this.readyState === this.DONE) {
		console.log(this.responseText);
	}
});

xhr.open('GET', 'https://youtube-transcriptor.p.rapidapi.com/transcript?video_id=ZbZSe6N_BXs&lang=en');
xhr.setRequestHeader('X-RapidAPI-Key', '54316e4d62msh819b1cf66fe3125p11ffd8jsn35171722b1fb');
xhr.setRequestHeader('X-RapidAPI-Host', 'youtube-transcriptor.p.rapidapi.com');

xhr.send(data);