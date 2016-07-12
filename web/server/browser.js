window.Leap = require('leapjs');
window.AFRAME = require('aframe');
window.AFRAME.extras = require('aframe-extras');

window.AFRAME.extras.registerAll();
require('aframe-leap-hands').registerAll();
window.io = require('socket.io-client')
