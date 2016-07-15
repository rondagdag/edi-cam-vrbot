"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require("johnny-five");

var Board = _require.Board;
var Fn = _require.Fn;

var Motor = _require.Motor;
var Motors = _require.Motors;
var RAD_TO_DEG = Fn.RAD_TO_DEG;
var constrain = Fn.constrain;
var scale = Fn.scale;

var priv = new WeakMap();

var SPEED_MIN = 50;
var SPEED_MAX = 200;

var Rover = function () {
  function Rover(pinDefs) {
    _classCallCheck(this, Rover);
   console.log(pinDefs);
    //this.update("center");

    var pins = [{ pins: pinDefs[0], invertPWM: false }, { pins: pinDefs[1], invertPWM: false 
}];

    pins[0].threshold = pins[0].threshold || 0;
    pins[1].threshold = pins[1].threshold || 0;

    console.log(pinDefs);
	priv.set(this, new Motors(pins));
	this.stop();
  }

  _createClass(Rover, [{
    key: "update",
    value: function update(direction) {
	console.log(direction);

console.log('direction update');
      var ms = 500;
      var axis = { x : 0, y : 0 };
  
      if (direction === "left") {
        axis.x = -100;
        axis.y = 150;
      }

      if (direction === "right") {
        axis.x = 100;
        axis.y = 150;
      }

      if (direction === "up") {
        axis.y = 150;
      }

      if (direction === "down") {
        axis.y = -150;
      }

      if (direction === "center") {
        this.stop();
      }


      var x = axis.x;
      var y = axis.y;

      // See drive.md
      //
      // Compute angle of joystick

      var angle = Math.acos(Math.abs(x) / Math.hypot(x, y)) * RAD_TO_DEG;

      // Compute "turn coefficient"
      var coeff = -1 + angle / 90 * 2;
      var turn = coeff * Math.abs(Math.abs(y) - Math.abs(x));

      turn = Math.round(turn * 100) / 100;

      var move = Math.max(Math.abs(y), Math.abs(x));
      var direction = {
        left: "forward",
        right: "forward"
      };

      var speed = {
        left: 0,
        right: 0
      };

      // Determine quadrant...
      if (x >= 0 && y >= 0 || x < 0 && y < 0) {
        speed.left = move;
        speed.right = turn;
      } else {
        speed.right = move;
        speed.left = turn;
      }

      // Invert when reversing...
      if (y < 0) {
        speed.left *= -1;
        speed.right *= -1;
        // TODO: Can we flip these here? For Reverse-And-Turn?
      }

      speed.left = Math.round(Number.isNaN(speed.left) ? 0 : speed.left);
      speed.right = Math.round(Number.isNaN(speed.right) ? 0 : speed.right);

      if (speed.left < 0) {
        direction.left = "reverse";
        speed.left *= -1;
      }

      if (speed.right < 0) {
        direction.right = "reverse";
        speed.right *= -1;
      }

      if (speed.left === 0 && speed.right === 0) {
        this.stop();
      } else {
        var left = scale(speed.left, 0, 100, SPEED_MIN, SPEED_MAX);
        var right = scale(speed.right, 0, 100, SPEED_MIN, SPEED_MAX);

        this.left[direction.left](left);
        this.right[direction.right](right);
      }

      return this;
    }
  }, {
    key: "stop",
    value: function stop() {
      priv.get(this).stop();
    }
  }, {
    key: "left",
    get: function get() {
      return priv.get(this)[0];
    }
  }, {
    key: "right",
    get: function get() {
      return priv.get(this)[1];
    }
  }]);

  return Rover;
}();

module.exports = Rover;
/*
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; 
i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; 
descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; 
Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, 
staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) 
defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new 
TypeError("Cannot call a class as a function"); } }

var _require = require("johnny-five");

var Board = _require.Board;
var Fn = _require.Fn;
var Motor = _require.Motor;
var Motors = _require.Motors;
var RAD_TO_DEG = Fn.RAD_TO_DEG;
var constrain = Fn.constrain;
var scale = Fn.scale;

var priv = new WeakMap();

var SPEED_MIN = 50;
var SPEED_MAX = 200;

var Rover = function () {
  function Rover(pinDefs) {
    _classCallCheck(this, Rover);

    var pins = [{ pins: pinDefs[0], invertPWM: true }, { pins: pinDefs[1], invertPWM: true }];

    pins[0].threshold = pins[0].threshold || 0;
    pins[1].threshold = pins[1].threshold || 0;

    console.log(pins);
    priv.set(this, new Motors(pins));

    this.stop();
  }

  _createClass(Rover, [{
    key: "update",
    value: function update(axis) {
      console.log(axis);
      var x = axis.x;
      var y = axis.y;

      // See drive.md
      //
      // Compute angle of joystick

      var angle = Math.acos(Math.abs(x) / Math.hypot(x, y)) * RAD_TO_DEG;

      // Compute "turn coefficient"
      var coeff = -1 + angle / 90 * 2;
      var turn = coeff * Math.abs(Math.abs(y) - Math.abs(x));

      turn = Math.round(turn * 100) / 100;

      var move = Math.max(Math.abs(y), Math.abs(x));
      var direction = {
        left: "forward",
        right: "forward"
      };

      var speed = {
        left: 0,
        right: 0
      };

      // Determine quadrant...
      if (x >= 0 && y >= 0 || x < 0 && y < 0) {
        speed.left = move;
        speed.right = turn;
      } else {
        speed.right = move;
        speed.left = turn;
      }

      // Invert when reversing...
      if (y < 0) {
        speed.left *= -1;
        speed.right *= -1;
        // TODO: Can we flip these here? For Reverse-And-Turn?
      }

      speed.left = Math.round(Number.isNaN(speed.left) ? 0 : speed.left);
      speed.right = Math.round(Number.isNaN(speed.right) ? 0 : speed.right);

      if (speed.left < 0) {
        direction.left = "reverse";
        speed.left *= -1;
      }

      if (speed.right < 0) {
        direction.right = "reverse";
        speed.right *= -1;
      }

      if (speed.left === 0 && speed.right === 0) {
        this.stop();
      } else {
        var left = scale(speed.left, 0, 100, SPEED_MIN, SPEED_MAX);
        var right = scale(speed.right, 0, 100, SPEED_MIN, SPEED_MAX);

        this.left[direction.left](left);
        this.right[direction.right](right);
      }

      return this;
    }
  }, {
    key: "stop",
    value: function stop() {
      priv.get(this).stop();
    }
  }, {
    key: "left",
    get: function get() {
      return priv.get(this)[0];
    }
  }, {
    key: "right",
    get: function get() {
      return priv.get(this)[1];
    }
  }]);

  return Rover;
}();

module.exports = Rover;*/
