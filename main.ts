import { Plugin, MarkdownView, Notice, TFile, Editor } from "obsidian";

export default class StreaksPlugin extends Plugin {
	getLineIndex(element: HTMLElement): number {
		const lineElement = element.closest(".cm-line");
		if (!lineElement) return -1;
		const allLines = Array.from(document.querySelectorAll(".cm-line"));
		return allLines.indexOf(lineElement);
	}

	// TODO: Refactor to a generic path string
	getPreviousDayPath(currentPath: string): string {
		// Extract the date from the file path
		const datePattern = /(\d{4})-([A-Za-z]{3})-(\d{2})/;
		const match = currentPath.match(datePattern);

		if (!match) {
			throw new Error("Could not extract date from path: " + currentPath);
		}

		// Extract year, month, and day from the match
		const year = parseInt(match[1]);
		const month = match[2];
		const day = parseInt(match[3]);

		// Create a Date object for the current date
		const monthMap: { [key: string]: number } = {
			Jan: 0,
			Feb: 1,
			Mar: 2,
			Apr: 3,
			May: 4,
			Jun: 5,
			Jul: 6,
			Aug: 7,
			Sep: 8,
			Oct: 9,
			Nov: 10,
			Dec: 11,
		};

		const currentDate = new Date(year, monthMap[month], day);

		// Calculate the previous day
		const previousDate = new Date(currentDate);
		previousDate.setDate(currentDate.getDate() - 1);

		// Format the previous day's path
		const previousYear = previousDate.getFullYear();
		const previousMonth = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		][previousDate.getMonth()];
		const previousDay = String(previousDate.getDate()).padStart(2, "0");

		// Extract the base directory structure
		const lastSlashIndex = currentPath.lastIndexOf("/");
		const directory = currentPath.substring(0, lastSlashIndex);
		const basePath = directory.substring(0, directory.lastIndexOf("/"));

		// Handle month change in path
		if (previousDate.getMonth() !== currentDate.getMonth()) {
			return `${basePath}/${previousMonth}/${previousYear}-${previousMonth}-${previousDay}`;
		}

		// Same month - just replace the date part
		return `${directory}/${previousYear}-${previousMonth}-${previousDay}`;
	}

	/**
	 * Checks if a note contains a habit streak pattern and returns the streak count
	 * @param {string} notePath - The path to the note file (e.g., "daily notes/2025/2025-Apr-10")
	 * @param {string} habit - The habit name to look for
	 * @returns {Promise<number>} - The streak count if found, 0 otherwise
	 */
	async getHabitStreak(notePath: string, habit: string): Promise<number> {
		try {
			const abstractFile = this.app.vault.getAbstractFileByPath(notePath);
			if (!abstractFile) return 0;

			const file = abstractFile as TFile;
			const noteContent = await this.app.vault.read(file);
			const escapedHabit = habit.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
			const pattern = new RegExp(
				`- \\[x\\]\\s*${escapedHabit}\\s*🔥\\s*\\*\\*(\\d+)\\*\\*`
			);
			const match = noteContent.match(pattern);
			return match ? parseInt(match[1], 10) : 0;
		} catch (error) {
			console.error(`Error checking habit streak: ${error}`);
			return 0;
		}
	}

	async onload() {
		this.registerDomEvent(document, "click", async (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (target.tagName !== "INPUT") return;
			if (target.getAttribute("type") !== "checkbox") return;

			const isChecked = (target as HTMLInputElement).checked;
			const lineIndex = this.getLineIndex(target);
			if (lineIndex === -1) return;

			// Get the line content from the editor at that index
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (!view) return;

			const editor = view.editor;
			const rawLineText = editor.getLine(lineIndex);
			const match = rawLineText.match(/^- \[( |x)\] (.+?)\s*🔥\s*(.*)$/);
			if (!match) return;

			const habitText = match[2];
			const activeFile = this.app.workspace.getActiveFile();
			if (!activeFile) return;

			const filePath = activeFile.path; // relative path in the vault
			const template = "daily notes/YYYY/MMMM/YYYY-MMM-DD";
			const previousDailyNotePath = this.getPreviousDayPath(filePath);
			if (!previousDailyNotePath) return;

			const prevHabitStreak = await this.getHabitStreak(
				`${previousDailyNotePath}.md`,
				habitText
			);

			if (isChecked) {
				editor.replaceRange(
					`- [x] ${habitText} 🔥 **${prevHabitStreak + 1}**`,
					{ line: lineIndex, ch: 0 },
					{ line: lineIndex, ch: rawLineText.length }
				);
			} else {
				editor.replaceRange(
					`- [ ] ${habitText} 🔥 **${prevHabitStreak}**`,
					{ line: lineIndex, ch: 0 },
					{ line: lineIndex, ch: rawLineText.length }
				);
			}
		});
	}

	onunload() {
		// Cleanup if necessary
	}
}
