/**
 * Topics module — loads topic JSON files and provides word selection.
 * 
 * Topic files are stored in /topics/ directory.
 * Each file: { name, icon, words: [{ word, hint }] }
 * The manifest /topics/index.json lists all available topic filenames.
 */

const TopicsManager = (() => {
    let allTopics = [];

    /**
     * Load all topics from the manifest and their JSON files.
     * @returns {Promise<Array>} Array of topic objects
     */
    async function loadTopics() {
        try {
            const manifestResponse = await fetch('topics/index.json');
            const filenames = await manifestResponse.json();

            const topicPromises = filenames.map(async (filename) => {
                try {
                    const response = await fetch(`topics/${filename}`);
                    const topic = await response.json();
                    topic._filename = filename;
                    return topic;
                } catch (err) {
                    console.warn(`Failed to load topic: ${filename}`, err);
                    return null;
                }
            });

            const topics = await Promise.all(topicPromises);
            allTopics = topics.filter(t => t !== null);
            return allTopics;
        } catch (err) {
            console.error('Failed to load topics manifest:', err);
            return [];
        }
    }

    /**
     * Get all loaded topics.
     * @returns {Array} Array of topic objects
     */
    function getTopics() {
        return allTopics;
    }

    /**
     * Pick a random word from the selected topic names.
     * @param {string[]} topicNames - Array of topic names to pick from
     * @returns {{ word: string, hint: string, topicName: string } | null}
     */
    function getRandomWord(topicNames) {
        // Gather all words from selected topics
        const pool = [];
        for (const topic of allTopics) {
            if (topicNames.includes(topic.name)) {
                for (const entry of topic.words) {
                    pool.push({
                        word: entry.word,
                        hint: entry.hint,
                        topicName: topic.name
                    });
                }
            }
        }

        if (pool.length === 0) return null;

        const index = Math.floor(Math.random() * pool.length);
        return pool[index];
    }

    return {
        loadTopics,
        getTopics,
        getRandomWord
    };
})();
