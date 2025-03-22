// Array of video data
const videoData = [
    {
        title: "Robot Navigation Demo",
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with your actual YouTube URL
        prompt: "Navigate through the obstacle course and reach the target zone."
    },
    {
        title: "Object Recognition",
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with your actual YouTube URL
        prompt: "Identify and sort the different colored blocks on the table."
    },
    {
        title: "Voice Command Response",
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with your actual YouTube URL
        prompt: "Respond to voice commands for basic movement: forward, backward, turn left, turn right."
    },
    {
        title: "Autonomous Path Finding",
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with your actual YouTube URL
        prompt: "Find the shortest path through the maze without prior mapping."
    },
    {
        title: "Human Interaction",
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with your actual YouTube URL
        prompt: "Follow a person while maintaining a safe distance and avoiding obstacles."
    }
];

// YouTube player
let player;
let currentVideoIndex = 0;

// Initialize the YouTube player when API is ready
function onYouTubeIframeAPIReady() {
    loadVideo(currentVideoIndex);
}

// Extract YouTube video ID from URL
function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Load a specific video
function loadVideo(index) {
    const videoId = getYouTubeId(videoData[index].youtube_url);
    
    if (!player) {
        player = new YT.Player('player', {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: {
                'playsinline': 1,
                'rel': 0,
                'modestbranding': 1
            }
        });
    } else {
        player.loadVideoById(videoId);
    }
    
    // Update video info
    document.getElementById('video-title').textContent = videoData[index].title;
    document.getElementById('video-prompt').textContent = videoData[index].prompt;
    
    // Update active thumbnail
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, i) => {
        if (i === index) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
    
    // Scroll the active thumbnail into view
    const activeThumb = document.querySelector('.thumbnail.active');
    if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

// Navigate to the next video
function nextVideo() {
    currentVideoIndex = (currentVideoIndex + 1) % videoData.length;
    loadVideo(currentVideoIndex);
}

// Navigate to the previous video
function prevVideo() {
    currentVideoIndex = (currentVideoIndex - 1 + videoData.length) % videoData.length;
    loadVideo(currentVideoIndex);
}

// Create thumbnails for all videos
function createThumbnails() {
    const container = document.getElementById('thumbnails-container');
    
    videoData.forEach((video, index) => {
        const videoId = getYouTubeId(video.youtube_url);
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail';
        if (index === currentVideoIndex) {
            thumbnail.classList.add('active');
        }
        
        thumbnail.innerHTML = `
            <img src="https://img.youtube.com/vi/${videoId}/mqdefault.jpg" alt="${video.title}">
            <div class="thumbnail-title">${video.title}</div>
        `;
        
        thumbnail.addEventListener('click', () => {
            currentVideoIndex = index;
            loadVideo(index);
        });
        
        container.appendChild(thumbnail);
    });
}

// Set up event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Create thumbnails
    createThumbnails();
    
    // Set up navigation buttons
    document.getElementById('next-btn').addEventListener('click', nextVideo);
    document.getElementById('prev-btn').addEventListener('click', prevVideo);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextVideo();
        } else if (e.key === 'ArrowLeft') {
            prevVideo();
        }
    });
}); 