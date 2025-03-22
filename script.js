// Array of video data
const videoData = [
    {
        title: "Overview",
        youtube_url: "https://www.youtube.com/watch?v=Wo06M7FGnmE",
        prompt: "",
        is_overview: true
    },
    {
        title: "Chess Knight Move",
        youtube_url: "https://www.youtube.com/watch?v=YzMdkn_229I",
        prompt: "You are a knight chess piece located on B1. Take the pawn on C3."
    },
    {
        title: "\"M\" Letter Movement",
        youtube_url: "https://www.youtube.com/watch?v=omPwNulGbBA",
        prompt: "Move in the shape of the letter M."
    },
    {
        title: "Exploration and Escape",
        youtube_url: "https://www.youtube.com/watch?v=ERLedJGS7rA",
        prompt: "Explore the area. Then, run away when you find something scary."
    }
];

// YouTube player
let player;
let currentVideoIndex = 0;

// Initialize the YouTube player when API is ready
function onYouTubeIframeAPIReady() {
    console.log('YouTube API ready, initializing player...');
    
    // Create player with event handlers right from the start
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: getYouTubeId(videoData[currentVideoIndex].youtube_url),
        playerVars: {
            'playsinline': 1,
            'rel': 0,
            'modestbranding': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
    
    console.log('Player object created:', player);
    
    // Update video info
    document.getElementById('video-title').textContent = videoData[currentVideoIndex].title;
    document.getElementById('video-prompt').textContent = videoData[currentVideoIndex].prompt;
    console.log('Video info updated for:', videoData[currentVideoIndex].title);
}

// Extract YouTube video ID from URL
function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Load a specific video
function loadVideo(index) {
    console.log('Loading video index:', index, 'Title:', videoData[index].title);
    const videoId = getYouTubeId(videoData[index].youtube_url);
    const videoInfo = videoData[index];
    
    // Show loading indicator
    document.getElementById('player').classList.add('loading');
    
    if (player) {
        console.log('Calling loadVideoById with ID:', videoId);
        player.loadVideoById(videoId);
    } else {
        console.warn('Player not initialized yet when trying to load video');
    }
    
    // Update video info
    document.getElementById('video-title').textContent = videoInfo.title;
    document.getElementById('video-prompt').textContent = videoInfo.prompt;
    
    // Update YouTube link
    document.getElementById('youtube-link').href = videoInfo.youtube_url;
    
    // Hide or show prompt section based on is_overview flag
    // const promptSection = document.getElementById('prompt-container'); // by id
    const promptSection = document.querySelector('.prompt-container'); // by class
    if (videoInfo.is_overview && videoInfo.is_overview === true) {
        promptSection.style.display = 'none';
    } else {
        promptSection.style.display = 'block';
    }
    
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
        // Check if we're in mobile or desktop layout
        const isVerticalLayout = window.innerWidth > 992;
        activeThumb.scrollIntoView({ 
            behavior: 'smooth', 
            block: isVerticalLayout ? 'nearest' : 'nearest', 
            inline: isVerticalLayout ? 'nearest' : 'center' 
        });
    }
}

// Handle player ready event
function onPlayerReady(event) {
    console.log('Player ready event fired');
    // Hide loading indicator when player is ready
    document.getElementById('player').classList.remove('loading');
}

// Handle player state changes
function onPlayerStateChange(event) {
    console.log('Player state changed to:', event.data);
    
    // Hide loading indicator when video starts playing or is paused
    if (event.data === YT.PlayerState.PLAYING || event.data === YT.PlayerState.PAUSED) {
        document.getElementById('player').classList.remove('loading');
        console.log('Loading indicator removed - video playing or paused');
    }
    
    // Show loading indicator when video is buffering
    if (event.data === YT.PlayerState.BUFFERING) {
        document.getElementById('player').classList.add('loading');
        console.log('Loading indicator shown - video buffering');
    }
}

// Handle player error
function onPlayerError(event) {
    console.error("YouTube player error:", event.data);
    console.log("Error code explanation:", getYouTubeErrorMessage(event.data));
    // Remove loading indicator even if there's an error
    document.getElementById('player').classList.remove('loading');
}

// Helper function to translate YouTube error codes to messages
function getYouTubeErrorMessage(errorCode) {
    const errorMessages = {
        2: "Invalid parameter value (check your video URL)",
        5: "HTML5 player error",
        100: "Video not found or removed",
        101: "Video embedding not allowed",
        150: "Video embedding not allowed (same as 101)"
    };
    return errorMessages[errorCode] || "Unknown error";
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
    
    // Create thumbnails
    createThumbnails();
    loadVideo(currentVideoIndex);
    
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