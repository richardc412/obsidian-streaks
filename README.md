# obsidian-streaks

This plugin helps track streaks directly through daily notes.

## How to Use

1. Add tasks you want to complete daily in your daily note template using checkboxes: `- [ ] My daily habit`
2. Add a flame emoji 🔥 to the template item `- [ ] My daily habit 🔥`

That's it!

Now, whenever you check off the item in your daily notes, it will keep track of your streak.

Note: this plugin only looks at your previous day's note to update the current streak value, and retroactively changing the status of a task will not update future streak counts.

However, if you missed a previous day, you can still add it and update the tasks, and the next day can still keep track of the streak.

## Technical Details

This section covers what this plugin actually does under the hood. Generally, if you make a daily note everyday and check off your tasks for that day, this plugin will work as expected in most cases.

// TODO
