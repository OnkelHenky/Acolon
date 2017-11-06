/**
 * Created by alex on 12.05.17.
 */

/**
 * A dictionary with all supported barriers simulations
 * @type {{}}
 */
let Barriers = {};

/**
 * Mess uo words on the target web page to show reading barriers.
 * Based on the work and with permission of Victor 'geon' Widell
 * https://github.com/geon/geon.github.com/blob/master/_posts/2016-03-03-dsxyliea.md
 */
let messUpWords =  function () {

    let textNodes = getTextNodesIn(document.querySelector("html"));
    let wordsInTextNodes = [];

    /**
     * Get the the HTML nodes containing a text node as child.
     * @param root_node the starting node.
     * @returns {Array} All the nodes containing a text node as child.
     */
    function getTextNodesIn(root_node) {
        let nodes_with_text = [];
        for (let parent = root_node.firstChild; parent; parent = parent.nextSibling) {
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
    setInterval(messUpWords, 50);
};

/**
 *
 */
let notPerceivable = function () {

    /*
     * Make Header less or not perceivable for sighted users.
     */
    let allHeaders = document.querySelectorAll("h1, h2, h3, h4, h5, h6"); //get all header elements

    allHeaders.forEach((header)=>{
        header.style.cssText = "color: inherit; font-weight: normal; font-size: inherit; margin: 0; padding: 0; border: none";
        if(header.hasChildNodes()){
            let allChildes= header.querySelectorAll("*");
            allChildes.forEach((childElement)=>{
                childElement.style.cssText = "font-weight: normal; color: inherit; font-size: inherit; margin: 0; padding: 0; border: none";
            })
        }
    });

    /*
     * Make LINKS less or not perceivable for sighted users.
     */
    let allLinks = document.querySelectorAll("a"); //get all links "a elements"

    allLinks.forEach((link)=>{
        link.style.cssText = "cursor: default; text-decoration: none; color: inherit; font-weight: normal; font-size: inherit;";
        if(link.hasChildNodes()){
            let allChildes= link.querySelectorAll("*");
            allChildes.forEach((childElement)=>{
                childElement.style.cssText = "text-decoration: none; font-weight: normal; color: inherit; font-size: inherit;";
            })
        }
    });

    function theWorstContrast() {
        let textNodes = getTextNodesIn(document.querySelector("body"));

        function getTextNodesIn(root_node) {
            let nodes_with_text = [];
            for (let parent = root_node.firstChild; parent; parent = parent.nextSibling) {
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

      //  console.log('textNodes',textNodes);

        textNodes.forEach((element)=>{
            console.log('element',element);
            element.parentElement.style.cssText += "background-color: red; color: #6666ff !important";
        });
    }
    document.querySelector("body").style.cssText += "background: red !important; color: #6666ff !important";

   theWorstContrast();

};

/**
 * Hide the mouse pointer and disable all pointer events.
 */
let noMousePointer = function(){
    let allElements = document.querySelectorAll("*"); //get all elements

    allElements.forEach((element)=>{
        element.style.cursor ="none";
        element.style.pointerEvents = "none";
    });
};

/**
 * A dictionary of all available barriers.
 * @type {messUpWords}
 */
Barriers['messUPWords'] = messUpWords;
Barriers['noMousePointer'] = noMousePointer;
Barriers['notPerceivable'] = notPerceivable;

/**
 * Event handler for "drop-events"
 */
document.querySelector('html').addEventListener("drop", function( event ) {
    event.preventDefault();  //prevent default action.
    let barrier = event.dataTransfer.getData("text"); //get the @ID of the dragged element.
    console.log(' data event : '+ barrier);
    Barriers[barrier](); //simulate the barrier.
}, false);


/* events fired on the drop targets */
document.querySelector('html').addEventListener("dragover", function( event ) {
    // prevent default to allow drop
    event.preventDefault();
}, false);

document.querySelector('html').addEventListener("dragenter", function( event ) {
    // highlight potential drop target when the draggable element enters it
    // if ( event.target.className == "dropzone" ) {
    //   event.target.style.border = "6px dashed red";
    //   event.target.style.opacity = "1.0";
    //}

}, false);

document.querySelector('html').addEventListener("dragleave", function( event ) {
    // highlight potential drop target when the draggable element enters it
    // if ( event.target.className == "dropzone" ) {
    // event.target.style.background = "green";
    //event.target.style.opacity = "0.5";
    //}

}, false);
