document.addEventListener('DOMContentLoaded', function () {
    const transcriptionButton = document.getElementById('transcriptionButton');
    const videoUrlInput = document.getElementById('videoUrl');
    const transcriptionResult = document.getElementById('transcriptionResult');
  
    transcriptionButton.addEventListener('click', function () {
      const videoId = extractVideoId(videoUrlInput.value);
      if (videoId) {
        getTranscription(videoId);
      } else {
        transcriptionResult.textContent = 'Invalid YouTube video URL';
      }
    });
  
    function extractVideoId(url) {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v\/|.*u\/\w\/|embed\/|.*v=))([^#\&\?]*).*/);
      return match ? match[1] : null;
    }
  
    function getTranscription(videoId) {
      const xhr = new XMLHttpRequest();
      const apiKey = '54316e4d62msh819b1cf66fe3125p11ffd8jsn35171722b1fb';
      const apiUrl = `https://youtube-transcriptor.p.rapidapi.com/transcript?video_id=${videoId}&lang=en`;
  
      xhr.withCredentials = true;
      xhr.addEventListener('readystatechange', function () {
        if (this.readyState === this.DONE) {
          transcriptionResult.textContent = this.responseText;
        }
      });
  
      xhr.open('GET', apiUrl);
      xhr.setRequestHeader('X-RapidAPI-Key', apiKey);
      xhr.setRequestHeader('X-RapidAPI-Host', 'youtube-transcriptor.p.rapidapi.com');
      xhr.send();
    }
  });
  