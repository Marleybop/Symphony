# Symphony 🎵

Symphony is a **self-hosted Discord music bot** that doesn't suck. It's designed for small to medium-sized Discord servers with powerful features and great performance.

## Features

- 🎥 **Livestreams** - Play live YouTube streams
- 🎭 **Mood-based playback** - `/mood` command with 20 curated moods (chill, energetic, focus, etc.)
- 🎲 **Random mode** - `/random` command picks a random mood for you
- ⏩ **Seeking** - Jump to any point in a song/video
- 💾 **Local caching** - Better performance with smart caching
- 📋 **No vote-to-skip** - Skip songs instantly
- ↔️ **Spotify integration** - Autoconverts playlists/artists/albums/songs from Spotify to YouTube
- ↗️ **Custom shortcuts** - Save favorite queries with `/favorites`
- 1️⃣ **Multi-guild support** - One bot instance supports multiple servers
- 🔊 **Volume normalization** - Consistent volume across tracks
- 🎯 **Auto-ducking** - Reduce volume when people speak (optional)
- ✍️ **TypeScript** - Modern, maintainable, and easily extendable

## Quick Start

Symphony requires the following API keys (passed as environment variables):

- **`DISCORD_TOKEN`** (Required) - Get it [here](https://discordapp.com/developers/applications) by creating a 'New Application', then going to 'Bot'
- **`YOUTUBE_API_KEY`** (Required) - Create a project in [Google's Developer Console](https://console.developers.google.com), enable YouTube Data API v3, and create an API key
- **`SPOTIFY_CLIENT_ID`** and **`SPOTIFY_CLIENT_SECRET`** (Optional) - Get them [here](https://developer.spotify.com/dashboard/applications) by creating a new app

**Important**: A 64-bit OS is required to run Symphony.

After starting Symphony, it will log an invite URL. Open this URL in your browser to add Symphony to your Discord server.

## Installation Methods

### 🐧 LXC Container (Recommended for Linux servers)

This method is ideal for running Symphony in a lightweight Linux container on Proxmox or other LXC-compatible systems.

#### Prerequisites
- LXC container with Ubuntu 22.04 or Debian 12
- At least 1GB RAM and 10GB storage
- Internet connectivity

#### Installation Steps

1. **Update system packages**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install Node.js 22.x**
   ```bash
   # Install Node.js from NodeSource
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt install -y nodejs

   # Verify installation
   node --version  # Should show v22.x.x
   npm --version
   ```

3. **Install ffmpeg**
   ```bash
   sudo apt install -y ffmpeg

   # Verify installation
   ffmpeg -version
   ```

4. **Install build essentials** (required for native dependencies)
   ```bash
   sudo apt install -y build-essential python3 git
   ```

5. **Create a dedicated user for Symphony** (optional but recommended)
   ```bash
   sudo adduser --system --group --home /opt/symphony symphony
   sudo su - symphony
   ```

6. **Clone Symphony repository**
   ```bash
   cd /opt/symphony
   git clone https://github.com/Marleybop/Symphony.git
   cd Symphony
   ```

7. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

8. **Configure environment variables**
   ```bash
   cp .env.example .env
   nano .env
   ```

   Update the following variables:
   ```
   DISCORD_TOKEN=your_discord_bot_token
   YOUTUBE_API_KEY=your_youtube_api_key
   SPOTIFY_CLIENT_ID=your_spotify_client_id  # Optional
   SPOTIFY_CLIENT_SECRET=your_spotify_secret  # Optional
   DATA_DIR=/opt/symphony/Symphony/data
   ```

9. **Create systemd service** (for auto-start)

   Exit the symphony user if you switched to it:
   ```bash
   exit  # Return to your admin user
   ```

   Create service file:
   ```bash
   sudo nano /etc/systemd/system/symphony.service
   ```

   Add the following content:
   ```ini
   [Unit]
   Description=Symphony Discord Music Bot
   After=network.target

   [Service]
   Type=simple
   User=symphony
   WorkingDirectory=/opt/symphony/Symphony
   ExecStart=/usr/bin/npm start
   Restart=always
   RestartSec=10
   StandardOutput=journal
   StandardError=journal

   [Install]
   WantedBy=multi-user.target
   ```

10. **Enable and start Symphony**
    ```bash
    sudo systemctl daemon-reload
    sudo systemctl enable symphony
    sudo systemctl start symphony

    # Check status
    sudo systemctl status symphony

    # View logs
    sudo journalctl -u symphony -f
    ```

#### LXC Container Tips

- **Resource allocation**: Allocate at least 1GB RAM for smooth operation
- **Storage**: 10GB+ recommended for caching music
- **Networking**: Ensure the container has internet access
- **Firewall**: No incoming ports needed (Discord bot uses outbound connections)
- **Backups**: Back up `/opt/symphony/Symphony/data` directory for database and cache

#### Updating Symphony in LXC

```bash
sudo systemctl stop symphony
cd /opt/symphony/Symphony
git pull
npm install --legacy-peer-deps
sudo systemctl start symphony
```

### 🐳 Docker

Symphony can run in Docker containers. You can use the following methods:

**Single Container**:
```bash
docker run -it \
  -v "$(pwd)/data":/data \
  -e DISCORD_TOKEN='your_token' \
  -e YOUTUBE_API_KEY='your_key' \
  -e SPOTIFY_CLIENT_ID='your_id' \
  -e SPOTIFY_CLIENT_SECRET='your_secret' \
  ghcr.io/marleybop/symphony:latest
```

**Docker Compose** (recommended):

Create `docker-compose.yml`:
```yaml
services:
  symphony:
    image: ghcr.io/marleybop/symphony:latest
    restart: always
    volumes:
      - ./symphony-data:/data
    environment:
      - DISCORD_TOKEN=your_discord_token
      - YOUTUBE_API_KEY=your_youtube_key
      - SPOTIFY_CLIENT_ID=your_spotify_id     # Optional
      - SPOTIFY_CLIENT_SECRET=your_spotify_secret  # Optional
```

Then run:
```bash
docker-compose up -d
```

### 💻 Node.js (Direct Installation)

**Prerequisites**:
- Node.js 22.x (22.0.0 or later recommended)
- ffmpeg (4.1 or later)
- Git

**Installation**:

1. Clone the repository:
   ```bash
   git clone https://github.com/Marleybop/Symphony.git
   cd Symphony
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   nano .env  # Edit with your API keys
   ```

3. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

4. Start Symphony:
   ```bash
   npm start
   ```

**Note**: On Windows, you may need to manually set the ffmpeg path in your environment variables.

## Commands

### Playback
- `/play <query>` - Play a song or playlist (YouTube URL, Spotify URL, or search)
- `/pause` - Pause playback
- `/resume` - Resume playback
- `/skip` - Skip current song
- `/stop` - Stop playback and clear queue
- `/seek <position>` - Jump to a specific time (e.g., `1:30`)
- `/fseek <duration>` - Forward seek by duration (e.g., `30s`)

### Mood & Random
- `/mood <mood>` - Play music based on a mood (20 moods available with autocomplete)
- `/random` - Play music from a randomly selected mood

Available moods: chill, energetic, focus, sad, happy, party, workout, sleep, morning, night, jazz, classical, electronic, rock, indie, ambient, romantic, melancholic, motivation, rain

### Queue Management
- `/queue` - Show current queue
- `/shuffle` - Shuffle the queue
- `/clear` - Clear the queue
- `/move <from> <to>` - Reorder queue items
- `/remove <position>` - Remove a song from queue
- `/loop` - Toggle loop for current song
- `/loop-queue` - Toggle loop for entire queue

### Favorites
- `/favorites create <name> <query>` - Save a query as a favorite
- `/favorites use <name>` - Play a saved favorite
- `/favorites list` - Show all favorites
- `/favorites remove <name>` - Delete a favorite

### Other
- `/now-playing` - Show currently playing song
- `/volume <0-100>` - Set volume
- `/disconnect` - Disconnect bot from voice channel
- `/config` - Configure server settings

## Advanced Configuration

### Cache Size

By default, Symphony limits cache to 2GB. To change:
```bash
CACHE_LIMIT=512MB  # or 10GB, etc.
```

### SponsorBlock Integration

Skip non-music segments in YouTube videos (disabled by default):
```bash
ENABLE_SPONSORBLOCK=true
SPONSORBLOCK_TIMEOUT=5  # Minutes to wait after server errors
```

### Custom Bot Status

Customize Symphony's Discord presence:

```bash
BOT_STATUS=online          # online, idle, or dnd
BOT_ACTIVITY_TYPE=LISTENING  # PLAYING, LISTENING, WATCHING, STREAMING
BOT_ACTIVITY=music         # Activity text
BOT_ACTIVITY_URL=          # Required for STREAMING type
```

**Examples**:

Playing a game:
```bash
BOT_STATUS=online
BOT_ACTIVITY_TYPE=PLAYING
BOT_ACTIVITY=with music
```

Streaming:
```bash
BOT_STATUS=online
BOT_ACTIVITY_TYPE=STREAMING
BOT_ACTIVITY_URL=https://www.twitch.tv/monstercat
BOT_ACTIVITY=Monstercat
```

### Auto Volume Reduction

Automatically reduce volume when people speak:

- `/config set-reduce-vol-when-voice true` - Enable
- `/config set-reduce-vol-when-voice false` - Disable
- `/config set-reduce-vol-when-voice-target <volume>` - Set target volume (0-100, default: 20)

### Global Command Registration

For bots in 10+ servers, you can register commands globally (updates take up to 1 hour):
```bash
REGISTER_COMMANDS_ON_BOT=true
```

### Server-Specific Settings

Each server can customize:
- Playlist limit (max songs from playlists)
- Auto-disconnect delay
- Auto-announce next song
- Default volume
- Queue page size
- And more via `/config` commands

## Troubleshooting

**Bot doesn't join voice channel**:
- Ensure the bot has "Connect" and "Speak" permissions
- Check that you're in a voice channel when using commands

**Music sounds distorted**:
- Try adjusting volume with `/volume`
- Check your cache size (`CACHE_LIMIT`)

**Commands not showing up**:
- Wait a few minutes for Discord to sync commands
- Try kicking and re-inviting the bot
- Set `REGISTER_COMMANDS_ON_BOT=true` for global registration

**"No songs found" error**:
- Verify your YouTube API key is valid and has quota remaining
- Check your internet connection
- Try a different search query

## Development

**Build TypeScript**:
```bash
npm run build
```

**Type checking**:
```bash
npm run typecheck
```

**Linting**:
```bash
npm run lint
npm run lint:fix
```

**Development mode** (auto-reload):
```bash
npm run dev
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Credits

Symphony is a fork of [Muse](https://github.com/museofficial/muse), originally created by [@codetheweb](https://github.com/codetheweb) and maintained by the Muse community. Special thanks to all contributors who built the foundation this project is based on.

---

Made with ❤️ for music lovers everywhere
