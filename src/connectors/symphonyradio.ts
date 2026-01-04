// Symphony Radio APIs and Streams Links
// Stream: https://stream.symphonyradio.co.uk/
// API Stats: https://panel.symphradio.live/api/stats
// API Last Played: https://panel.symphradio.live/api/recentlyplayed
// Coded and Added by: Braiden Hill, Station Director of Symphony Radio

export {};

// Try to use Media Session API for better integration
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
let playerExists = false;

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

// Check if the player exists on the page
function checkForPlayer() {
	// Look for the player element (no audio element on this site)
	const player = document.querySelector('[class*="player"]');
	playerExists = player !== null;
}

// Update track info every 5 seconds
setInterval(() => {
	fetchCurrentTrack();
	checkForPlayer();
}, 5000);
fetchCurrentTrack();
checkForPlayer();

// Look for player container - Symphony Radio has a .minimized-player element
Connector.playerSelector = '[class*="player"]';

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
	// Symphony Radio doesn't use a standard audio element
	// If we have valid track data and the player exists, assume it's playing
	return playerExists && currentTrack !== null;
};

Connector.scrobblingDisallowedReason = () => {
	// Don't allow scrobbling if there's no player on the page
	if (!playerExists) {
		return 'IsPlayingElsewhere';
	}
	
	// Don't allow scrobbling if we don't have valid track data
	if (!currentTrack || !currentTrack.artist || !currentTrack.track) {
		return 'FilteredTag';
	}
	
	return null;
};
