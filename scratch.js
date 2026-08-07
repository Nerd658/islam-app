const fs = require('fs');
async function fetchIds(query) {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const text = await res.text();
    const regex = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
    let match;
    const ids = new Set();
    while ((match = regex.exec(text)) !== null) {
        ids.add(match[1]);
        if(ids.size >= 8) break;
    }
    return Array.from(ids);
}
async function run() {
    console.log("Rachid:", await fetchIds('rachid eljay conference longue heure'));
    console.log("Nader:", await fetchIds('nader abou anas conference complete'));
    console.log("Maher:", await fetchIds('maher zain official music video'));
    console.log("Sami:", await fetchIds('sami yusuf official'));
}
run();
