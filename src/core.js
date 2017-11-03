/**
 * Copyright (c) 2017 Alexander Henka. All rights reserved.
 * Use of this source code is governed by a Apache 2.0 license that can be
 * found in the LICENSE file.
 */


document.addEventListener('DOMContentLoaded', function() {
    let dragged;
    /* events fired on the draggable target */
    let draggableElements = document.querySelectorAll('.draggable');
    draggableElements.forEach((element)=>{
        element.addEventListener("drag", function( event ) {
        }, false);
        element.addEventListener("dragstart", function( event ) {
            // store a ref. on the dragged elem
            //dragged = event.target;
            console.log('Drag start',event.target.id);

            event.dataTransfer.setData("text/plain", event.target.id);
            console.log('ev.dataTransfer = ' + event.dataTransfer.getData("text/plain"));
            // make it half transparent
            //event.target.style.opacity = .5;
        }, false);
        element.addEventListener("dragend", function( event ) {
            // reset the transparency
            event.target.style.opacity = "";
        }, false);
    });


    /* events fired on the drop targets */
    document.querySelector('#outer-dropzone').addEventListener("dragover", function( event ) {
        // prevent default to allow drop
        event.preventDefault();
    }, false);


    /*
    document.querySelector('#outer-dropzone').addEventListener("dragenter", function( event ) {
        // highlight potential drop target when the draggable element enters it
        if ( event.target.className === "dropzone" ) {
            event.target.style.background = "purple";
        }

    }, false);
    document.querySelector('#outer-dropzone').addEventListener("dragleave", function( event ) {
        // reset background of potential drop target when the draggable element leaves it
        if ( event.target.className === "dropzone" ) {
            event.target.style.background = "";
        }

    }, false);

    document.querySelector('#outer-dropzone').addEventListener("drop", function( event ) {
        // prevent default action (open as link for some elements)
        event.preventDefault();
        // move dragged elem to the selected drop target
        if ( event.target.className === "dropzone" ) {
            event.target.style.background = "";
            dragged.parentNode.removeChild( dragged );
            event.target.appendChild( dragged );

            window.close();
        }

    }, false);
    */
});
