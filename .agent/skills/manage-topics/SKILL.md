---
name: manage-topics
description: How to add new topics or add words to existing topics in the Imposter! game
---

# Managing Topics

Topics are the word lists used in the Imposter! game. Each topic is a separate JSON file in the `topics/` directory.

## Topic File Format

Each topic file follows this exact JSON structure:

```json
{
  "name": "שם הנושא",
  "icon": "🎯",
  "words": [
    { "word": "מילה", "hint": "רמז" },
    { "word": "מילה נוספת", "hint": "רמז נוסף" }
  ]
}
```

### Fields

| Field | Description | Example |
|-------|-------------|---------|
| `name` | Hebrew display name for the topic | `"חיות"` |
| `icon` | Single emoji representing the topic | `"🐾"` |
| `words` | Array of word objects | See below |
| `words[].word` | The secret word (Hebrew) | `"כלב"` |
| `words[].hint` | **A single word** hint for the imposter | `"עצם"` |

### Hint Rules

> **CRITICAL**: Each hint must be exactly **one word** in Hebrew.

The hint should be:
- **Related** to the secret word, but **not too obviously**
- Something that could have multiple interpretations
- NOT a synonym or direct description

> **CRITICAL**: The hint must **not share the same Hebrew root** as the secret word, and must not appear literally inside the word (e.g. if the word is `"קפיצה במוט"`, the hint cannot be `"מוט"`).

**Good hints:**
- `"כלב"` → `"עצם"` (related but not obvious)
- `"נהג"` → `"הגה"` (associated object)
- `"פיצה"` → `"תנור"` (where it's made)

**Bad hints:**
- `"כלב"` → `"חיית מחמד נאמנה"` (too long, multiple words)
- `"כלב"` → `"כלבלב"` (same root כ-ל-ב)
- `"ספרן"` → `"ספריה"` (same root ס-פ-ר)
- `"מחשבון"` → `"חישוב"` (same root ח-ש-ב)
- `"קפיצה במוט"` → `"מוט"` (hint appears literally in the word)

Aim for **15-20 words** per topic.

---

## Adding a New Topic

### Step 1: Create the topic JSON file

Create a new file in `topics/` directory, e.g. `topics/movies.json`:

```json
{
  "name": "סרטים",
  "icon": "🎬",
  "words": [
    { "word": "טיטאניק", "hint": "ספינה" },
    { "word": "הארי פוטר", "hint": "שרביט" },
    { "word": "מלך האריות", "hint": "סוואנה" }
  ]
}
```

### Step 2: Register the topic in the manifest

Add the new filename to `topics/index.json`:

```json
[
  "animals.json",
  "food.json",
  "countries.json",
  "professions.json",
  "sports.json",
  "movies.json"
]
```

### Step 3: Update the service worker cache

Add the new topic file to the `ASSETS` array in `sw.js`:

```javascript
const ASSETS = [
    // ... existing assets ...
    './topics/movies.json',
];
```

Also bump the cache version in `sw.js`:

```javascript
const CACHE_NAME = 'imposter-v2';  // increment version
```

### Step 4: Commit and push

```bash
git add topics/movies.json topics/index.json sw.js
git commit -m "Add movies topic"
git push
```

The new topic will automatically appear in the setup screen.

---

## Adding Words to an Existing Topic

### Step 1: Edit the topic file

Open the relevant file in `topics/` (e.g. `topics/animals.json`) and add new entries to the `words` array:

```json
{
  "name": "חיות",
  "icon": "🐾",
  "words": [
    // ... existing words ...
    { "word": "דוב", "hint": "דבש" },
    { "word": "עקרב", "hint": "עוקץ" }
  ]
}
```

### Step 2: Bump service worker version

In `sw.js`, increment the cache version so users get the updated word list:

```javascript
const CACHE_NAME = 'imposter-v2';  // increment version
```

### Step 3: Commit and push

```bash
git add topics/animals.json sw.js
git commit -m "Add words to animals topic"
git push
```

---

## Existing Topics Reference

| File | Name | Icon | Words |
|------|------|------|-------|
| `animals.json` | חיות | 🐾 | 18 |
| `food.json` | אוכל | 🍕 | 18 |
| `countries.json` | מדינות | 🌍 | 18 |
| `professions.json` | מקצועות | 👷 | 18 |
| `sports.json` | ספורט | ⚽ | 18 |
