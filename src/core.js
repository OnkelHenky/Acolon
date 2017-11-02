/**
 * Copyright (c) 2017 Alexander Henka. All rights reserved.
 * Use of this source code is governed by a Apache 2.0 license that can be
 * found in the LICENSE file.
 */


/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url === 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

function allowDrop(ev) {
    console.log('allowDrop = ' +ev);

    ev.preventDefault();
}

function drag(ev) {

    console.log('drag = ' +ev);
    ev.dataTransfer.setData("text/plain", ev.target.id);
    console.log('ev.dataTransfer = ' +ev.dataTransfer.getData("text"));
}

function drop(ev) {

    /*
    console.dir('ev = '+ ev.dataTransfer);
    console.dir(ev.dataTransfer);

    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");

    ev.target.appendChild(document.getElementById(data));
*/  ev.preventDefault();

    console.log("Drop");

    // Get the data, which is the id of the drop target
    var data = ev.dataTransfer.getData("text");
    console.log('data = ' + data);

    ev.target.appendChild(document.getElementById(data));
    // Clear the drag data cache (for all formats/types)
    ev.dataTransfer.clearData();
}

document.addEventListener('DOMContentLoaded', function() {
    let dragged;
    /* events fired on the draggable target */
    document.querySelector('#messUPWords').addEventListener("drag", function( event ) {
    }, false);

    document.querySelector('#messUPWords').addEventListener("dragstart", function( event ) {
        // store a ref. on the dragged elem
        dragged = event.target;
        event.dataTransfer.setData("text/plain", event.target.id);
        console.log('ev.dataTransfer = ' +event.dataTransfer.getData("text/plain"));
        // make it half transparent
        event.target.style.opacity = .5;
    }, false);

    document.querySelector('#messUPWords').addEventListener("dragend", function( event ) {
        // reset the transparency
        event.target.style.opacity = "";
    }, false);

    /* events fired on the drop targets */
    document.querySelector('#outer-dropzone').addEventListener("dragover", function( event ) {
        // prevent default to allow drop
        event.preventDefault();
    }, false);

    document.querySelector('#outer-dropzone').addEventListener("dragenter", function( event ) {
        // highlight potential drop target when the draggable element enters it
        if ( event.target.className == "dropzone" ) {
            event.target.style.background = "purple";
        }

    }, false);
    document.querySelector('#outer-dropzone').addEventListener("dragleave", function( event ) {
        // reset background of potential drop target when the draggable element leaves it
        if ( event.target.className == "dropzone" ) {
            event.target.style.background = "";
        }

    }, false);

    document.querySelector('#outer-dropzone').addEventListener("drop", function( event ) {
        // prevent default action (open as link for some elements)
        event.preventDefault();
        // move dragged elem to the selected drop target
        if ( event.target.className == "dropzone" ) {
            event.target.style.background = "";
            dragged.parentNode.removeChild( dragged );
            event.target.appendChild( dragged );

            window.close();
        }

    }, false);


    getCurrentTabUrl(function(url) {
            console.log('Tab URL = '+url);
        chrome.tabs.executeScript(
            {
                file: 'js/injector.js'
            });


        });

});
