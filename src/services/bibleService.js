import bibleData from '../assets/bible.json';

// Structure of bibleData assumption: It seems to be a list of books or a big object.
// I'll need to inspect it or write code that handles the likely structure.
// Based on typical JSONs from such repos, it often has books, chapters, verses.

// Let's assume a structure and if it fails I'll debug.
// Actually, to be safe, I should inspect it first. But I can write a defensive service.

export const bibleService = {
    getRandomVerse: () => {
        // Flatten all verses
        // This might be expensive if done every time, so maybe cache it?
        // For now, let's just try to pick a random book, then random chapter, then random verse.

        // Note: The structure isn't 100% known without peeking, but commonly:
        // [ { name: "Genesis", chapters: [ { chapter: 1, verses: [ { verse: 1, text: "..." } ] } ] } ]
        if (!bibleData || typeof bibleData !== 'object') {
            console.error("Bible data not loaded or invalid");
            return { text: "In the beginning was the Word...", reference: "John 1:1" };
        }

        const books = Object.keys(bibleData);
        if (books.length === 0) return { text: "Error loading bible.", reference: "Error 0:0" };

        const randomBookName = books[Math.floor(Math.random() * books.length)];
        const bookData = bibleData[randomBookName];

        // bookData is Object(Chapter -> Verses)
        const chapters = Object.keys(bookData);
        if (chapters.length === 0) return { text: "No chapters found.", reference: "Error" };

        const randomChapterNum = chapters[Math.floor(Math.random() * chapters.length)];
        const chapterData = bookData[randomChapterNum];

        // chapterData is Object(VerseNum -> Text)
        const verses = Object.keys(chapterData);
        if (verses.length === 0) return { text: "No verses found.", reference: "Error" };

        const randomVerseNum = verses[Math.floor(Math.random() * verses.length)];
        const verseText = chapterData[randomVerseNum];

        return {
            text: cleanText(verseText),
            reference: `${randomBookName} ${randomChapterNum}:${randomVerseNum}`
        };
    }
};

function cleanText(text) {
    if (typeof text !== 'string') return "";
    // Remove asterisks and other markup if present
    return text.replace(/\*/g, '').trim();
}
