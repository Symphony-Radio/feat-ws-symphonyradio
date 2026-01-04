// Symphony Radio APIs and Streams Links
// Stream: https://stream.symphonyradio.co.uk/
// API Stats: https://panel.symphradio.live/api/stats
// API Last Played: https://panel.symphradio.live/api/recentlyplayed
// Coded and Added by: Braiden Hill, Station Director of Symphony Radio

export {};

// Try to use Media Session API first for better integration
Connector.useMediaSessionApi();

// API endpoint for current track information
const API_URL = 'https://panel.symphradio.live/api/stats';

interface SymphonyApiResponse {
	current_song?: {
		artist?: string;
		title?: string;
		album?: string;
		art?: string;
	};
}

let currentTrack: { artist: string; track: string; album: string; art: string } | null = null;
let hasAudio = false;

// Fetch current track from API
async function fetchCurrentTrack() {
	try {
		const response = await fetch(API_URL);
		const data: SymphonyApiResponse = await response.json();
		
		if (data.current_song) {
			currentTrack = {
				artist: data.current_song.artist || '',
				track: data.current_song.title || '',
				album: data.current_song.album || '',
				art: data.current_song.art || '',
			};
		}
	} catch (error) {
		console.error('Symphony Radio: Failed to fetch current track', error);
	}
}

// Check for audio element periodically
function checkForAudio() {
	const audio = document.querySelector('audio');
	hasAudio = audio !== null;
}

// Update track info every 5 seconds
setInterval(() => {
	fetchCurrentTrack();
	checkForAudio();
}, 5000);

// Initial fetch
fetchCurrentTrack();
checkForAudio();

// Use body as player selector - common for radio sites
Connector.playerSelector = 'body';

Connector.getArtist = () => {
	return currentTrack?.artist || null;
};

Connector.getTrack = () => {
	return currentTrack?.track || null;
};

Connector.getAlbum = () => {
	return currentTrack?.album || null;
};

Connector.getTrackArt = () => {
	return currentTrack?.art || null;
};

Connector.isPlaying = () => {
	// Check if audio element exists and is playing
	const audio = document.querySelector('audio');
	if (audio) {
		return !audio.paused;
	}
	
	// Fallback: if we have track data and audio element exists somewhere, assume playing
	return hasAudio && currentTrack !== null;
};

Connector.scrobblingDisallowedReason = () => {
	// Don't allow scrobbling if there's no audio element
	if (!hasAudio) {
		return 'IsPlayingElsewhere';
	}
	
	// Don't allow scrobbling if we don't have valid track data
	if (!currentTrack || !currentTrack.artist || !currentTrack.track) {
		return 'FilteredTag';
	}
	
	return null;
};
