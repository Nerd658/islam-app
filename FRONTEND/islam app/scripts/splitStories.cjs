const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../src/data/stories.json');
const outDir = path.join(__dirname, '../public/data/stories');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const stories = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const index = [];

stories.forEach(story => {
  // Create a slug from the title (e.g. "l-histoire-du-prophete-youssef-joseph")
  const slug = story.title.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const storyFile = { ...story, slug };

  // Write individual story
  fs.writeFileSync(
    path.join(outDir, `${slug}.json`),
    JSON.stringify(storyFile, null, 2)
  );

  // Add to index (without the heavy chapters array)
  index.push({
    id: story.id,
    slug,
    title: story.title,
    category: story.category,
    read_time_minutes: story.read_time_minutes,
    chapter_count: story.chapters.length
  });
});

// Write index
fs.writeFileSync(
  path.join(outDir, 'index.json'),
  JSON.stringify(index, null, 2)
);

console.log('Stories split successfully!');
