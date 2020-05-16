// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"tick-event.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TickEvent = void 0;

var TickEvent =
/** @class */
function () {
  function TickEvent(hours, minutes, seconds) {
    this.time = {
      hours: hours,
      minutes: minutes,
      seconds: seconds
    };
  }

  TickEvent.prototype.isExpired = function () {
    return this.time.hours === 0 && this.time.minutes === 0 && this.time.seconds === 0;
  };

  return TickEvent;
}();

exports.TickEvent = TickEvent;
},{}],"timer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Timer = void 0;

var tick_event_1 = require("./tick-event");

var Timer =
/** @class */
function () {
  function Timer(seconds) {
    this.remainingSeconds = seconds;
    this.running = false;
    this.onTicklisteners = new Set();
  }

  Timer.prototype.onTick = function (f) {
    this.onTicklisteners.add(f);
  };

  Timer.prototype.offTick = function (f) {
    this.onTicklisteners.delete(f);
  };

  Timer.prototype.resume = function () {
    var _this = this;

    if (this.running) {
      return;
    }

    this.running = true;

    var tick = function tick() {
      var now = Date.now();

      if (_this.onTicklisteners.size > 0) {
        var hours_1 = Math.floor(_this.remainingSeconds / (60 * 60));
        var minutes_1 = Math.floor(_this.remainingSeconds % (60 * 60) / 60);
        var seconds_1 = Math.floor(_this.remainingSeconds % 60);

        _this.onTicklisteners.forEach(function (listener) {
          return listener(new tick_event_1.TickEvent(hours_1, minutes_1, seconds_1));
        });
      }

      if (_this.remainingSeconds < 1) {
        _this.pause();
      } else {
        _this.remainingSeconds -= 1;
        _this.timer = setTimeout(tick, now + 1000 - Date.now());
      }
    };

    tick();
  };

  Timer.prototype.pause = function () {
    if (!this.running) {
      return;
    }

    this.running = false;

    if (this.timer) {
      clearTimeout(this.timer);
      delete this.timer;
    }
  };

  Timer.prototype.isRunning = function () {
    return this.running;
  };

  return Timer;
}();

exports.Timer = Timer;
},{"./tick-event":"tick-event.ts"}],"helper.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomID = void 0; // randomID generates a random string which can be used as
// an ID. There are risk of collision, this is NOT a UUID.
// However, to generate a few element in a page, it's a pragmatic
// choice to avoid a dependency toward a UUID lib.

function randomID() {
  return Math.random().toString(36).substr(2, 12);
}

exports.randomID = randomID;
},{}],"human-readable-duration.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.humanReadableDurationToString = exports.secondsToHumanReadableDuration = void 0; // secondsToHumanReadableDuration converts a number of second to a HumanReadableDuration.

function secondsToHumanReadableDuration(s) {
  var hours = Math.floor(s / (60 * 60));
  var minutes = Math.floor(s % (60 * 60) / 60);
  var seconds = Math.floor(s % 60);
  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
}

exports.secondsToHumanReadableDuration = secondsToHumanReadableDuration; // humanReadableDurationToString converts a HumanReadableDuration to a string XXhXXmXXs

function humanReadableDurationToString(h) {
  var s = [];

  if (h.hours > 0) {
    s.push(h.hours.toString() + 'h');
  }

  if (h.hours > 0 || h.minutes > 0) {
    s.push(h.minutes.toString() + 'm');
  }

  s.push(h.seconds.toString() + 's');
  return s.join(' ');
}

exports.humanReadableDurationToString = humanReadableDurationToString;
},{}],"meeting-step.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MeetingStep = void 0;

var timer_1 = require("./timer");

var helper_1 = require("./helper");

var human_readable_duration_1 = require("./human-readable-duration");

var MeetingStep =
/** @class */
function () {
  // create a new MeetingStep. If `id` is immited, we generate a random one.
  function MeetingStep(name, timeInSeconds, id) {
    this.name = name;
    this.timeInSeconds = timeInSeconds;
    this.stepTimer = new timer_1.Timer(timeInSeconds);
    this.id = id !== undefined ? id : helper_1.randomID();
  }

  MeetingStep.prototype.timer = function () {
    return this.stepTimer;
  };

  MeetingStep.prototype.humanReadableDuration = function () {
    return human_readable_duration_1.secondsToHumanReadableDuration(this.timeInSeconds);
  };

  return MeetingStep;
}();

exports.MeetingStep = MeetingStep;
},{"./timer":"timer.ts","./helper":"helper.ts","./human-readable-duration":"human-readable-duration.ts"}],"meeting.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Meeting = void 0;

var human_readable_duration_1 = require("./human-readable-duration");

var Meeting =
/** @class */
function () {
  function Meeting(steps) {
    this._steps = steps;
    this._currentStepIdx = 0;
    this.onTicklisteners = new Set();
    this.onStepChangeListeners = new Set();
  } // addStep adds a new step to the meeting.


  Meeting.prototype.addStep = function (s) {
    this._steps.push(s);

    this._currentStepIdx = 0;
  }; // steps returns an array of all steps.


  Meeting.prototype.steps = function () {
    return this._steps;
  }; // currentStep returns the current step.


  Meeting.prototype.currentStep = function () {
    return this._steps[this._currentStepIdx];
  }; // startMeeting starts the meeting and the first step timer.


  Meeting.prototype.startMeeting = function () {
    this._startedAt = new Date();
    this.startCurrentTimer();
  }; // hasStarted returns true if the meeting has already started.


  Meeting.prototype.hasStarted = function () {
    return this._startedAt !== undefined;
  }; // stopMeeting stops the meeting.


  Meeting.prototype.stopMeeting = function () {
    this._finishedAt = new Date();
  }; // startCurrentTimer binds onTick events and resume the current step.
  // should be called when steps is started for the first time or after a change of step.


  Meeting.prototype.startCurrentTimer = function () {
    var _this = this;

    this.onTicklisteners.forEach(function (l) {
      return _this.currentStep().timer().onTick(l);
    });
    this.currentStep().timer().resume();
  }; // stopCurrentTimer unbinds onTick events and pause the current step.
  // should be called when steps is stopped before a change of step.


  Meeting.prototype.stopCurrentTimer = function () {
    var _this = this;

    this.onTicklisteners.forEach(function (l) {
      return _this.currentStep().timer().offTick(l);
    });
    this.currentStep().timer().pause();
  }; // resumeCurrentTimer resumes the current step timer after it has been paused.


  Meeting.prototype.resumeCurrentTimer = function () {
    this.currentStep().timer().resume();
  }; // pauseCurrentTimer pauses the current step timer.


  Meeting.prototype.pauseCurrentTimer = function () {
    this.currentStep().timer().pause();
  }; // nextStep jumps to the next step if available.


  Meeting.prototype.nextStep = function () {
    if (this._currentStepIdx < this._steps.length - 1) {
      this.startStep(this._currentStepIdx + 1);
    }
  }; // jumpToStep jumps to a specific steps identified by its id.


  Meeting.prototype.jumpToStep = function (id) {
    var stepIdx = this._steps.findIndex(function (s) {
      return s.id === id;
    });

    if (stepIdx !== undefined) {
      this.startStep(stepIdx);
    }
  }; // startStep starts a new step and make sure the previous one is stopped.


  Meeting.prototype.startStep = function (stepIdx) {
    this.stopCurrentTimer();
    this._currentStepIdx = stepIdx;
    this.startCurrentTimer();
    this.onStepChangeListeners.forEach(function (l) {
      return l();
    });
  }; // totalDuration returns a HumanReadableDuration of the duration of the entire meeting.


  Meeting.prototype.totalDuration = function () {
    return human_readable_duration_1.secondsToHumanReadableDuration(this._steps.reduce(function (acc, step) {
      return acc + step.timeInSeconds;
    }, 0));
  }; // onTick register a new tickListener.


  Meeting.prototype.onTick = function (f) {
    this.onTicklisteners.add(f);
  }; // onStepChange register a new stepChangeListener.


  Meeting.prototype.onStepChange = function (f) {
    this.onStepChangeListeners.add(f);
  };

  return Meeting;
}();

exports.Meeting = Meeting;
},{"./human-readable-duration":"human-readable-duration.ts"}],"index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var meeting_step_1 = require("./meeting-step");

var meeting_1 = require("./meeting");

var human_readable_duration_1 = require("./human-readable-duration"); // updateTimer updates the timer values on the page.
// lastTickEvent is used to update only elements which have changed.


function updateTimer(newTime, lastTime) {
  var pad = function pad(n) {
    return String(n).padStart(2, '0');
  };

  if (newTime.hours !== lastTime.hours) {
    document.getElementById('hours').innerText = pad(newTime.hours);
  }

  if (newTime.minutes !== lastTime.minutes) {
    document.getElementById('minutes').innerText = pad(newTime.minutes);
  }

  if (newTime.seconds !== lastTime.seconds) {
    document.getElementById('seconds').innerText = pad(newTime.seconds);
  }
} // updateSteps update the list of steps displayed on the page.


function updateSteps(meeting) {
  var domElements = [];

  for (var i = 0; i < meeting.steps().length; i++) {
    var step = meeting.steps()[i];
    var elemClass = step.id === meeting.currentStep().id ? 'step active' : 'step';
    domElements[i] = "<div class=\"" + elemClass + "\" id=\"" + step.id + "\">" + step.name + " <span class=\"duration\">" + human_readable_duration_1.humanReadableDurationToString(step.humanReadableDuration()) + "</span></div>";
  }

  document.getElementById('steps').innerHTML = domElements.join('\n');

  var _loop_1 = function _loop_1(step) {
    var btnElt = document.getElementById(step.id);

    if (btnElt) {
      btnElt.addEventListener('click', function () {
        jumpToStep(meeting, step.id);
        return false;
      });
    }
  };

  for (var _i = 0, _a = meeting.steps(); _i < _a.length; _i++) {
    var step = _a[_i];

    _loop_1(step);
  }
} // jumpToStep jump to the step identified by stepId.


function jumpToStep(meeting, stepId) {
  meeting.jumpToStep(stepId);
} // setupControls binds controls click event.


function setupControls(meeting) {
  var resumeElt = document.getElementById('resume');

  if (resumeElt) {
    resumeElt.addEventListener('click', function () {
      if (!meeting.hasStarted()) {
        resumeElt.innerText = 'RESUME';
        meeting.startMeeting();
      } else {
        meeting.resumeCurrentTimer();
      }
    });
  }

  var pauseElt = document.getElementById('pause');

  if (pauseElt) {
    pauseElt.addEventListener('click', function () {
      return meeting.pauseCurrentTimer();
    });
  }
}

window.onload = function () {
  // create the meeting with the respective steps
  // TODO: load this from a JSON instead of hardcoding values
  var steps = [];
  steps.push(new meeting_step_1.MeetingStep('Introduction', 300));
  steps.push(new meeting_step_1.MeetingStep('Product understanding', 600));
  steps.push(new meeting_step_1.MeetingStep('Present team and stack', 300));
  steps.push(new meeting_step_1.MeetingStep('Introduction candidate', 300));
  steps.push(new meeting_step_1.MeetingStep("Candidate's ideal position", 300));
  steps.push(new meeting_step_1.MeetingStep("Candidate's questions", 600));
  steps.push(new meeting_step_1.MeetingStep("Process' next steps", 300));
  var meeting = new meeting_1.Meeting(steps);
  var lastTimeDuration = {
    hours: 0,
    minutes: 0,
    seconds: 0
  }; // keep the last tickEvent to update only changed values

  updateTimer(meeting.currentStep().humanReadableDuration(), lastTimeDuration); // display the current steps

  updateSteps(meeting); // setup control buttons

  setupControls(meeting); // subcribe to tick event to update timer values

  meeting.onTick(function (t) {
    console.debug('new tick', t);
    updateTimer(t.time, lastTimeDuration);

    if (t.isExpired()) {
      setTimeout(function () {
        return meeting.nextStep();
      }, 1000);
    }

    lastTimeDuration = t.time;
  }); // subscribe to step changes to update the step list

  meeting.onStepChange(function () {
    console.debug('step changed');
    updateSteps(meeting);
  });
};
},{"./meeting-step":"meeting-step.ts","./meeting":"meeting.ts","./human-readable-duration":"human-readable-duration.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61684" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/src.77de5100.js.map