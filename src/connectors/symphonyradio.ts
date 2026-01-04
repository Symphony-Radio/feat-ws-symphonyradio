// Symphony Radio APIs and Streams Links
// Stream: https://stream.symphonyradio.co.uk/
// API Stats: https://panel.symphradio.live/api/stats
// API Last Played: https://panel.symphradio.live/api/recentlyplayed
// Coded and Added by: Braiden Hill, Station Director of Symphony Radio

export {};

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

// Update track info every 10 seconds
setInterval(fetchCurrentTrack, 10000);
fetchCurrentTrack();

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
	return audio ? !audio.paused : false;
};
