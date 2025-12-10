# Obsidian Streaks

Track your daily habit streaks directly in your Obsidian daily notes with automatic streak counting and visual indicators.

## Features

- 🔥 **Simple Setup**: Just add a flame emoji to your habit checkboxes
- 📊 **Automatic Tracking**: Streaks are automatically calculated and updated when you check off tasks
- 📅 **Daily Note Integration**: Works seamlessly with Obsidian's daily notes
- 🔄 **Grace Period Support**: If you miss a day, you can add it retroactively and the streak will continue

## Installation

### From Obsidian Community Plugins

1. Open Obsidian Settings
2. Go to Community Plugins
3. Search for "Streaks"
4. Click Install
5. Enable the plugin

### Manual Installation

1. Download the latest release from the [Releases page](https://github.com/richardc412/obsidian-streaks/releases)
2. Extract the files to your vault's `.obsidian/plugins/obsidian-streaks/` directory
3. Reload Obsidian
4. Enable the plugin in Settings → Community Plugins

## Usage

### Setting Up Habits

1. In your daily note template, add checkboxes for habits you want to track:
   ```markdown
   - [ ] Exercise 🔥
   - [ ] Read for 30 minutes 🔥
   - [ ] Meditate 🔥
   ```

2. The flame emoji (🔥) tells the plugin to track this habit's streak.

### Tracking Streaks

- When you check off a habit (`- [ ]` → `- [x]`), the plugin automatically:
  - Looks at your previous day's note
  - Finds the streak count for that habit
  - Increments it by 1
  - Updates the current line to show: `- [x] Exercise 🔥 **5**`

- When you uncheck a habit, it reverts to the previous day's streak count:
  - `- [x] Exercise 🔥 **5**` → `- [ ] Exercise 🔥 **4**`

### Example

**Day 1 (2025-Apr-10):**
```markdown
- [x] Exercise 🔥 **1**
```

**Day 2 (2025-Apr-11):**
```markdown
- [x] Exercise 🔥 **2**
```

**Day 3 (2025-Apr-12):**
```markdown
- [ ] Exercise 🔥 **2**  (missed day, streak stays at 2)
```

**Day 4 (2025-Apr-13):**
```markdown
- [x] Exercise 🔥 **3**  (streak continues from day 2)
```

## Requirements

- **Daily Note Format**: Your daily notes must follow this path structure:
  ```
  daily notes/YYYY/MMMM/YYYY-MMM-DD.md
  ```
  
  Example: `daily notes/2025/April/2025-Apr-10.md`

- **Date Format**: Dates must be in the format `YYYY-MMM-DD` (e.g., `2025-Apr-10`)

## Technical Details

### How It Works

1. **Event Detection**: The plugin listens for checkbox click events in the editor
2. **Pattern Matching**: When a checkbox is clicked, it checks if the line contains a habit pattern: `- [ ] Habit Name 🔥`
3. **Previous Day Lookup**: It calculates the previous day's note path based on the current file's date
4. **Streak Calculation**: It reads the previous day's note and extracts the streak count using regex pattern: `- [x] Habit Name 🔥 **N**`
5. **Update**: It updates the current line with the new streak count (incremented if checked, previous count if unchecked)

### Limitations

- **Sequential Processing**: The plugin only looks at the previous day's note to calculate streaks. It does not scan backwards through all notes.
- **No Retroactive Updates**: Changing a task's status retroactively will not automatically update future streak counts. You would need to manually update subsequent days.
- **Path Format Dependency**: The plugin expects a specific daily note path format. Custom date formats or different folder structures are not currently supported.
- **Single Previous Day**: If you miss multiple days, you can add them retroactively, but the plugin will only check the immediately previous day when calculating streaks.

### File Structure

- `main.ts`: Core plugin logic and event handlers
- `manifest.json`: Plugin metadata and configuration
- `esbuild.config.mjs`: Build configuration for bundling

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Building

- **Development mode** (with watch):
  ```bash
  npm run dev
  ```

- **Production build**:
  ```bash
  npm run build
  ```

### Version Bumping

```bash
npm run version
```

This updates `manifest.json` and `versions.json` for release.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Author

**Richard Cao**

- GitHub: [@richardc412](https://github.com/richardc412)
