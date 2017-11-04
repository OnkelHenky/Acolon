/**
 * Copyright (c) 2017 Alexander Henka. All rights reserved.
 * Use of this source code is governed by a Apache 2.0 license that can be
 * found in the LICENSE file.
 */

/**
 * Adding all the event handlers for the draggable elements
 */
document.addEventListener('DOMContentLoaded', function() {
    /* events fired on the draggable target */
    let draggableElements = document.querySelectorAll('.draggable');
    draggableElements.forEach((element)=>{
        element.addEventListener("drag", function( event ) {
        }, false);
        element.addEventListener("dragstart", function( event ) {
            console.log('Drag start',event.target.id);
            event.dataTransfer.setData("text/plain", event.target.id);
            console.log('ev.dataTransfer = ' + event.dataTransfer.getData("text/plain"));
            setTimeout(function() {
                event.target.className = "draggableISDragged"; //swap css class to indicate that the element is dragged.
            }, 1);

        }, false);
        element.addEventListener("dragend", function( event ) {
            setTimeout(function() {
                event.target.className = "draggable"; //restore the initial class after the element was dragged.
            }, 1);
        }, false);

    });
});
