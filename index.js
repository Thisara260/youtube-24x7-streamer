require('dotenv').config();
const { spawn } = require('child_process');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('YouTube 24/7 Streamer is Running! ✅');
});

app.get('/status', (req, res) => {
  res.json({ 
    status: 'running',
    stream: process.env.STREAM_KEY ? 'configured' : 'missing stream key',
    video: process.env.VIDEO_URL ? 'configured' : 'missing video url'
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  startStream();
});

function startStream() {
  const streamKey = process.env.STREAM_KEY;
  const videoUrl = process.env.VIDEO_URL;
  
  if (!streamKey || !videoUrl) {
    console.error('ERROR: STREAM_KEY or VIDEO_URL not set!');
    return;
  }

  console.log('🎥 Starting 24/7 YouTube Stream...');
  console.log(`📹 Video URL: ${videoUrl}`);
  
const ffmpeg = spawn('ffmpeg', [
  '-re',
  '-stream_loop', '-1',
  '-i', videoUrl,

  '-c:v', 'libx264',
  '-preset', 'veryfast',
  '-b:v', '3000k',
  '-maxrate', '3000k',
  '-bufsize', '6000k',

  '-pix_fmt', 'yuv420p',
  '-g', '50',

  '-c:a', 'aac',
  '-b:a', '160k',
  '-ar', '44100',

  '-f', 'flv',
  `rtmp://a.rtmp.youtube.com/live2/${streamKey}`
]);

  ffmpeg.stderr.on('data', (data) => {
    console.log(`ffmpeg: ${data}`);
  });

  ffmpeg.on('close', (code) => {
    console.log(`ffmpeg exited with code ${code}`);
    console.log('🔄 Restarting in 5 seconds...');
    setTimeout(startStream, 5000);
  });

  ffmpeg.on('error', (err) => {
    console.error('Failed to start ffmpeg:', err);
  });
}
