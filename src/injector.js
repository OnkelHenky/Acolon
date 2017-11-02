/**
 * Created by alex on 12.05.17.
 */

let Barriers = {};

let messUpWords =  function () {

    let textNodes = getTextNodesIn(document.querySelector("html"));
    let wordsInTextNodes = [];

    /**
     * Get the the HTML nodes containing a text node as child.
     * @param parent the starting node.
     * @returns {Array} All the nodes containing a text node as child.
     */
    function getTextNodesIn(parent) {
        let nodes_with_text = [];
        for (parent = parent.firstChild; parent; parent = parent.nextSibling) {
            if (['SCRIPT','STYLE'].indexOf(parent.tagName) >= 0) { //exclude script and style elements
                continue;
            }
            if (parent.nodeType === Node.TEXT_NODE) {
                nodes_with_text.push(parent)
            }
            else{
                nodes_with_text = nodes_with_text.concat(getTextNodesIn(parent))
            }
        }
        return nodes_with_text;
    }

    for (let i = 0; i < textNodes.length; i++) {
        let node = textNodes[i];
        let words = [];
        let re = /\w+/g;
        let match;

        while ((match = re.exec(node.nodeValue)) !== null) {
            let word = match[0];
            let position = match.index;
            words.push({
                length: word.length,
                position: position
            });
        }
        wordsInTextNodes[i] = words;
    }

    /**
     * Mess up the words in the the found text nodes
     */
    function messUpWords () {
        for (let i = 0; i < textNodes.length; i++) {
            let node = textNodes[i];
            for (let j = 0; j < wordsInTextNodes[i].length; j++) {

                // Only change a tenth of the words each round.
                if (Math.random() > 1/10) {
                    continue;
                }

                let wordMeta = wordsInTextNodes[i][j];

                let word = node.nodeValue.slice(wordMeta.position, wordMeta.position + wordMeta.length);
                let before = node.nodeValue.slice(0, wordMeta.position);
                let after  = node.nodeValue.slice(wordMeta.position + wordMeta.length);

                node.nodeValue = before + messUpWord(word) + after;
            }
        }
    }
    /*
     * Mess up a single word
     */
    function messUpWord (word) {
        if (word.length < 2) {
            return word;
        }
        return word[0] + messUpMessyPart(word.slice(1, -1)) + word[word.length - 1];
    }

    function messUpMessyPart (messyPart) {
        if (messyPart.length < 2) {
            return messyPart;
        }

        let a, b;
        while (!(a < b)) {
            a = getRandomInt(0, messyPart.length - 1);
            b = getRandomInt(0, messyPart.length - 1);
        }

        return messyPart.slice(0, a) + messyPart[b] + messyPart.slice(a+1, b) + messyPart[a] + messyPart.slice(b+1);
    }

    // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /*
     * Set the time interval for mess up words.
     * The speed.
     */
    setInterval(messUpWords, 75);
};

/**
 * A dictionary of all available barriers.
 * @type {messUpWords}
 */
Barriers['messUPWords'] = messUpWords;

/* events fired on the drop targets */
document.querySelector('html').addEventListener("dragover", function( event ) {
    // prevent default to allow drop
    event.preventDefault();
}, false);

document.querySelector('html').addEventListener("dragenter", function( event ) {
        // highlight potential drop target when the draggable element enters it
        // if ( event.target.className == "dropzone" ) {
        //   event.target.style.border = "6px dashed red";
        // event.target.style.opacity = "1.0";
        //}
}, false);

document.querySelector('html').addEventListener("dragleave", function( event ) {
    // highlight potential drop target when the draggable element enters it
    // if ( event.target.className == "dropzone" ) {
   // event.target.style.background = "green";
    //event.target.style.opacity = "0.5";
    //}
}, false);



document.querySelector('html').addEventListener("drop", function( event ) {
    // prevent default action (open as link for some elements)
    event.preventDefault();
    console.dir(event);
    event.preventDefault();
    let data = event.dataTransfer.getData("text");
    console.dir(event);
    console.log(' data event = ' + data);
    Barriers[data]();
}, false);