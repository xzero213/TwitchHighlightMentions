// ==UserScript==
// @name        Twitch Highlight Mentions
// @Author      /u/Signe_
// @namespace   *.twitch.tv/*
// @include       https://*.twitch.tv/*
// @version     1
// @grant       none
// ==/UserScript==
//Starts the loop
var Timer = setInterval(Loop, 1000);
//How many iteractions the loop has gone through (resets every 60 seconds)
var Counter = 0;
//Dictionary containing peoples name and there color
var Dictionary = [];
//The main loop for the script
function Loop() {
  if (hasChatPanel()) {
    //Gets the full chat message
    var From = document.getElementsByClassName('from');
    for (var i = 0; i < From.length; i++) {
        //Adds that persons name and style color to the dictionary
        AddToDict('@' + From[i].innerText, From[i].getAttribute('style'));
    }
    //Grabs all the user mentions
    var UserMention = document.getElementsByClassName('mentioning');
    for (var j = 0; j < UserMention.length; j++) {
      //If the mention has a style attribute then it has already been modified
      if (!UserMention[j].hasAttribute('style')) {
        //Don't set the style attribute if it doesn't exist yet
        var DictColor = ReturnFromDict(UserMention[j].innerText.toLowerCase());
        if (DictColor != '') {
          //Sets the color of the mention to be that persons color in chat
          UserMention[j].setAttribute('style', DictColor);
          if (DictContains('*' + UserMention[j].innerText.toLowerCase())) {
            //Sets the persons name to be the correct case (@example would become @Example if that was there name)
            UserMention[j].innerText = ReturnFromDict('*' + UserMention[j].innerText.toLowerCase());
          }
        }
      }
    }
  } 
  else {
    //If 8 seconds pass clear the timer. no reason to run longer than that
    if (Counter > 8) {
      Counter = 0;
      clearInterval(Timer);
    }
  }
  Counter++;
  if (Counter > 60) {
    // clear Counter and Dictionary after 60 seconds
    Counter = 0;
    Dictionary = [];
  }
}
function ReturnFromDict(Key) {
  //Returns a value based on the key if it doesn't exist return nothing
  if (DictContains(Key)) {
    return Dictionary[Key];
  } else {
    return '';
  }
}
function AddToDict(Key, Value) {
  //Adds a key value pair to the dictionary
  var _key = Key.toLowerCase();
  if (!DictContains(_key)) {
    Dictionary[_key] = Value;
  } else {
    ReplaceDictValue(_key, Value);
  }
  if (!DictContains('*' + _key)) {
    Dictionary['*' + _key] = Key;
  }
}
function ReplaceDictValue(Key, Value) {
  if (DictContains(Key)) {
    Key = Key.toLowerCase();
    var DictValue = Dictionary[Key];
    if (DictValue != Value) {
      Dictionary[Key] = Value;
    }
  }
}
function DictContains(Key) {
  //Checks if the Dictionary conains a key
  if (Dictionary[Key] == undefined) {
    return false;
  } 
  else {
    return true;
  }
}
function hasChatPanel() {
  //Checks if the current page has a chat panel
  if (document.getElementsByClassName('chat-room').length > 0) {
    return true;
  } else {
    return false;
  }
}
