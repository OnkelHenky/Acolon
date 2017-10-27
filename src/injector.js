/**
 * Created by alex on 12.05.17.
 */

function messUpwords() {

    if(!window.jQuery) {
        /*jQuery auf der Webseite NICHT vorhanden*/
        var jQuery_version='3.1.1';
        var done=false;
        var script=document.createElement('script');
        script.onload = script.onreadystatechange = function(){
            if(!done&&(!script.readyState||script.readyState==='loaded'||script.readyState==='complete')){
                console.log('readyState = ' +script.readyState);
                done=true;
                dyslexia();
            }
        };

        script.src='//code.jquery.com/jquery-'+jQuery_version+'.min.js';
        document.getElementsByTagName('head')[0].appendChild(script)

    }else{
        /*jQuery auf der Webseite vorhanden*/
        dyslexia();
    }

    function dyslexia() {

    var getTextNodesIn = function(el) {

        return $(el).find(":not(iframe,script)").addBack().contents().filter(function() {
            return this.nodeType === 3;
        });
    };

   // var textNodes = document.querySelectorAll("p, h1, h2, h3");
    var textNodes = getTextNodesIn($("*"));

    function isLetter(char) {
        return /^[\d]$/.test(char);
    }

    var wordsInTextNodes = [];
    for (var i = 0; i < textNodes.length; i++) {
        var node = textNodes[i];

        var words = []

        var re = /\w+/g;
        var match;
        while ((match = re.exec(node.nodeValue)) != null) {

            var word = match[0];
            var position = match.index;

            words.push({
                length: word.length,
                position: position
            });
        }

        wordsInTextNodes[i] = words;
    }


    function messUpWords () {
        for (var i = 0; i < textNodes.length; i++) {

            var node = textNodes[i];

            for (var j = 0; j < wordsInTextNodes[i].length; j++) {

                // Only change a tenth of the words each round.
                if (Math.random() > 1/10) {

                    continue;
                }

                var wordMeta = wordsInTextNodes[i][j];

                var word = node.nodeValue.slice(wordMeta.position, wordMeta.position + wordMeta.length);
                var before = node.nodeValue.slice(0, wordMeta.position);
                var after  = node.nodeValue.slice(wordMeta.position + wordMeta.length);

                node.nodeValue = before + messUpWord(word) + after;
            }
        }
    }

    function messUpWord (word) {
        if (word.length < 3) {
            return word;
        }
        return word[0] + messUpMessyPart(word.slice(1, -1)) + word[word.length - 1];
    }

    function messUpMessyPart (messyPart) {
        if (messyPart.length < 2) {
            return messyPart;
        }

        var a, b;
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
    setInterval(messUpWords, 50);
}

}

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
    var data = event.dataTransfer.getData("text");
    console.log(' data event = ' + data);
    alert('Drop Event');
    messUpwords();

}, false);