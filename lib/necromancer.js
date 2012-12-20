/*!
 *  ___  ___  ___  ___  ___  _ _  ___  ___  ___  ___  ___
 * |   )|___)|    |   )|   )| | )|   )|   )|    |___)|   )
 * |  / |__  |__  |    |__/ |  / |__/||  / |__  |__  |
 *              
 *               -- animates elements --
 * written in Coco by Aarni Koskela at Anders Inno Oy, MMXI
 * 
 * Licensed under the MIT License:
 * 
 * Copyright (C) 2011, 2012 by Anders Inno Oy
 * 
 * Permission is hereby granted, free of charge, to any
 * person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the
 * Software without restriction, including without
 * limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software
 * is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice
 * shall be included in all copies or substantial portions
 * of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
 * KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
(function(){
  var root, log, setLog, Altar, _, Grimoire, FQueue, BellToll, StudyHall, Necromancer, Ritual, ScryingOrb, RitualBook;
  root = this;
  log = null;
  setLog = function(flag){
    if (flag) {
      return log = function(){
        return console.log.apply(console, arguments);
      };
    } else {
      return log = function(){};
    }
  };
  setLog(false);
  Altar = (function(){
    var nativeForEach, Altar;
    nativeForEach = Array.prototype.forEach;
    Altar = {};
    Altar.isFunction = function(obj){
      return !!(obj && obj.constructor && obj.call && obj.apply);
    };
    Altar.each = function(obj, iterator, context){
      var i, len$, val, key, own$ = {}.hasOwnProperty;
      if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
      } else if (!!+obj.length) {
        for (i = 0, len$ = obj.length; i < len$; ++i) {
          val = obj[i];
          iterator.call(context, obj[i], i, obj);
        }
      } else {
        for (key in obj) if (own$.call(obj, key)) {
          val = obj[key];
          iterator.call(context, val, key, obj);
        }
      }
      return obj;
    };
    Altar.bind = function(func, obj){
      obj == null && (obj = root);
      return function(){
        return func.apply(obj, arguments);
      };
    };
    Altar.bindAll = function(obj){
      var isf, k, f;
      isf = Altar.isFunction;
      for (k in obj) {
        f = obj[k];
        if (isf(f)) {
          obj[k] = Altar.bind(f, obj);
        }
      }
      return obj;
    };
    return Altar;
  }.call(this));
  _ = root._ || Altar;
  Grimoire = {
    animate: function(inv, opt){
      var $target, fromVals, toVals;
      $target = inv.master.$target;
      if (opt.p2 !== null) {
        fromVals = opt.p || {};
        toVals = opt.p2;
      } else {
        fromVals = null;
        toVals = opt.p || {};
      }
      if (fromVals) {
        $target.css(fromVals);
      }
      return inv.master.$target.animate(toVals, {
        duration: 0 | (opt.duration || 1),
        easing: opt.easing || "linear",
        complete: function(){
          return inv.complete();
        },
        queue: false
      });
    },
    graphicate: function(inv, opt){
      var steps, duration, p, step, stepDur, target, startTime, func;
      steps = opt.steps || 50;
      duration = opt.duration || 1;
      p = opt.p || {};
      if (steps == "auto") {
        steps = (duration / 1000.0) * (opt.fps || 30.0);
      }
      step = 0;
      stepDur = Math.max(1, duration / steps);
      target = inv.master.$target;
      startTime = +new Date();
      func = function(){
        var i, k, ref$, v;
        i = (+new Date() - startTime) / duration;
        for (k in ref$ = p) {
          v = ref$[k];
          v.f(target, i, k, v);
        }
        if (i >= 1) {
          return inv.complete();
        } else {
          return setTimeout(func, stepDur);
        }
      };
      return func();
    },
    attr: function(inv, opt){
      inv.master.$target.attr(opt.p || {});
      return inv.complete();
    },
    css: function(inv, opt){
      inv.master.$target.css(opt.p || {});
      return inv.complete();
    },
    classes: function(inv, opt){
      var t, k, v;
      t = inv.master.$target;
      for (k in opt) {
        v = opt[k];
        if (v === true) {
          t.addClass(k);
        } else if (v === false) {
          t.removeClass(k);
        }
      }
      return inv.complete();
    },
    summon: function(inv, opt){
      return setTimeout(function(){
        var container, nec;
        container = opt.container || inv.master.$target.parent();
        nec = Necromancer.summon(opt.template, container, opt.ritual);
        nec.summoner = inv.master;
        if (opt.hidden) {
          nec.$target.hide();
        }
        nec.start();
        return inv.complete();
      }, opt.duration || 1);
    },
    delay: function(inv, opt){
      return setTimeout(function(){
        return inv.complete();
      }, opt.duration || 1);
    },
    rewind: function(inv, opt){
      return setTimeout(function(){
        return inv.completeAndRewind();
      }, opt.duration || 1);
    },
    debug: function(inv, opt){
      console.log(inv, "DEBUG", opt);
      return inv.complete();
    },
    destroy: function(inv, opt){
      return setTimeout(function(){
        return inv.master.destroy();
      }, opt.duration || 1);
    },
    call: function(inv, opt){
      return setTimeout(function(){
        opt.func(inv);
        return inv.complete();
      }, opt.duration || 1);
    },
    simul: function(inv, opt){
      var ritual, nReq, nComplete, complete, i$, len$, ac, results$ = [];
      ritual = opt.ritual;
      nReq = ritual.length;
      nComplete = 0;
      complete = function(){
        nComplete++;
        if (nComplete == nReq) {
          return inv.complete();
        }
      };
      for (i$ = 0, len$ = ritual.length; i$ < len$; ++i$) {
        ac = ritual[i$];
        results$.push(Necromancer.invoke(inv.master, complete, ac));
      }
      return results$;
    },
    show: function(inv, opt){
      return setTimeout(function(){
        inv.master.$target.show();
        return inv.complete();
      }, opt.duration || 1);
    },
    hide: function(inv, opt){
      return setTimeout(function(){
        inv.master.$target.hide();
        return inv.complete();
      }, opt.duration || 1);
    },
    followSummoner: function(inv, opt){
      return setTimeout(function(){
        var $dst, $src, ref$, vs, i$, len$, k;
        $dst = inv.master.$target;
        $src = (ref$ = inv.master.summoner) != null ? ref$.$target : void 8;
        if ($src && $dst) {
          vs = {};
          for (i$ = 0, len$ = (ref$ = opt.css).length; i$ < len$; ++i$) {
            k = ref$[i$];
            vs[k] = $src.css(k);
          }
          $dst.css(vs);
        }
        return inv.complete();
      }, opt.duration || 1);
    },
    playSound: function(inv, opt){
      BellToll.play(opt.sound, opt.soundOptions);
      return inv.complete();
    }
  };
  FQueue = (function(){
    FQueue.displayName = 'FQueue';
    var prototype = FQueue.prototype, constructor = FQueue;
    function FQueue(){
      this.queue = [];
      this.available = false;
    }
    prototype.makeAvailable = function(){
      var results$ = [];
      this.available = true;
      while (this.queue.length > 0) {
        results$.push(this.queue.shift()());
      }
      return results$;
    };
    prototype.invoke = function(f){
      if (this.available) {
        return f();
      } else {
        return this.queue.push(f);
      }
    };
    return FQueue;
  }());
  BellToll = {
    available: false,
    silent: false,
    sounds: {},
    addQueue: new FQueue(),
    initialize: function(soundManagerUrl){
      var soundManager;
      if (soundManager = root.soundManager) {
        soundManager.url = soundManagerUrl;
        return soundManager.onready(function(){
          BellToll.available = true;
          log("A bell tolls for thee.");
          return BellToll.addQueue.makeAvailable();
        });
      } else {
        return log("BellToll unavailable: No soundManager in window");
      }
    },
    setSilent: function(silent){
      BellToll.silent = true;
      if (silent) {
        root.soundManager.mute();
        return log("The Bell has been silenced... for now.");
      } else {
        root.soundManager.unmute();
        return log("The Bell tolls once more.");
      }
    },
    addSound: function(id, url, options){
      options == null && (options = {});
      options = import$({
        autoLoad: true
      }, options);
      options.id = id;
      options.url = url;
      return BellToll.addQueue.invoke(function(){
        return BellToll._addSound(options);
      });
    },
    _addSound: function(options){
      return BellToll.sounds[options.id] = root.soundManager.createSound(options);
    },
    play: function(soundId, options){
      var ref$;
      options == null && (options = {});
      if (BellToll.available && !BellToll.silent) {
        return (ref$ = BellToll.sounds[soundId]) != null ? ref$.play(options) : void 8;
      }
    }
  };
  StudyHall = {
    makeClassTogglingRitual: function(sequence, delay){
      var ritual, i$, len$, cl, cz, j$, len1$, c, results$ = [];
      ritual = new Ritual;
      for (i$ = 0, len$ = sequence.length; i$ < len$; ++i$) {
        cl = sequence[i$];
        cz = {};
        for (j$ = 0, len1$ = sequence.length; j$ < len1$; ++j$) {
          c = sequence[j$];
          cz[c] = cl == c;
        }
        ritual.classes(cz);
        results$.push(ritual.delay(delay));
      }
      return results$;
    },
    makeBlinkingRitual: function(delay){
      return new Ritual(function(){
        this.delay(delay);
        this.hide();
        this.delay(delay);
        return this.show();
      });
    },
    makeFadingMoverRitual: function(className, x0, y0, dx, dy, timeFunc){
      var o;
      o = {};
      o[className] = true;
      return new Ritual(function(){
        var speed, hspeed;
        this.classes(o);
        speed = timeFunc();
        hspeed = speed / 2;
        this.animate(hspeed, {
          left: x0,
          top: y0,
          opacity: 0
        }, {
          left: x0 + dx,
          top: y0 + dy,
          opacity: 1
        });
        this.animate(hspeed, {
          left: x0 + dx * 2,
          top: y0 + dy * 2,
          opacity: 0
        });
        return this.destroy();
      });
    }
  };
  Necromancer = (function(){
    Necromancer.displayName = 'Necromancer';
    var Defaults, prototype = Necromancer.prototype, constructor = Necromancer;
    Defaults = {
      summoner: null,
      repeatTimes: 1
    };
    function Necromancer(target, options){
      this.target = target;
      options == null && (options = {});
      import$(this, import$(import$({}, Defaults), options));
      this.$target = $(this.target);
      this.$target.data("necromancer", this);
      this.queue = [];
      this.current = 0;
      this.repetition = 0;
      this.orb = null;
      _.bindAll(this);
      if (options.ritual) {
        this.add(Necromancer.resolveRitual(options.ritual));
      }
    }
    prototype.complete = function(){
      this.current++;
      return this.startNext();
    };
    prototype.completeAndRewind = function(){
      this.current = 0;
      this.startNext();
      return this;
    };
    prototype.start = function(){
      log("Starting, repetition #" + this.repetition);
      this.current = 0;
      this.startNext();
      return this;
    };
    prototype.add = function(thing){
      var q, i, to$;
      q = this.queue;
      log("adding:", thing, "to", q);
      if (thing.length && thing.length > 0) {
        for (i = 0, to$ = thing.length; i < to$; ++i) {
          q.push(thing[i]);
        }
      } else {
        q.push(thing);
      }
      q.length;
      return this;
    };
    prototype.destroy = function(){
      this.$target.remove();
      if (this.orb) {
        this.orb.destroy();
      }
      return this.queue = null;
    };
    prototype.startNext = function(){
      var ac;
      if (!this.queue) {
        return;
      }
      if (!(ac = this.queue[this.current])) {
        log("Out of actions at " + this.current + " (ql = " + this.queue.length + ").");
        this.repetition++;
        if (this.repeatTimes <= 0 || this.repetition < this.repeatTimes) {
          log("Rewinding.");
          this.start();
        } else {
          log("Stopping. " + this.repetition + " / " + this.repeatTimes);
        }
        return;
      }
      if (this.orb) {
        this.orb.redraw();
      }
      return Necromancer.invoke(this, this.complete, ac);
    };
    prototype.scry = function(){
      if (this.orb) {
        this.orb.destroy();
        this.orb = null;
      }
      return this.orb = new ScryingOrb(this);
    };
    Necromancer.invoke = function(master, complete, ac){
      var inv, action, delay, cond, actionFunc;
      inv = {
        master: master,
        complete: complete
      };
      action = ac.action;
      if (Grimoire[action]) {
        action = Grimoire[action];
      }
      delay = 0 | (ac.params.delay || 0);
      cond = ac.cond;
      if (cond && !cond(master, ac)) {
        log("Condition not satisfied for invoke, completing immediately");
        return setTimeout(complete, 1);
      } else {
        actionFunc = function(){
          return action(inv, ac.params || {});
        };
        if (ac.nowait) {
          inv.complete = function(){
            return log("Nowait completion called");
          };
          actionFunc = (function(innerFunc){
            return function(){
              innerFunc();
              return complete();
            };
          }.call(this, actionFunc));
        }
        if (delay > 0) {
          return setTimeout(actionFunc, delay);
        } else {
          return actionFunc();
        }
      }
    };
    Necromancer.resolveRitual = function(ritual){
      if (ritual.unholy) {
        return ritual;
      }
      ritual = RitualBook[ritual] || ritual;
      if (_.isFunction(ritual)) {
        ritual = ritual();
      }
      ritual = ritual || [];
      return ritual;
    };
    Necromancer.summon = function(template, targetContainer, ritual, options){
      var $el;
      options == null && (options = {});
      template = template || "<div />";
      $el = $(template).clone().attr("id", 'nec-' + (+new Date));
      $el.appendTo(targetContainer);
      return Necromancer.possess($el, ritual, options);
    };
    Necromancer.possess = function(element, ritual, options){
      options == null && (options = {});
      return new Necromancer($(element), import$({
        ritual: ritual
      }, options));
    };
    Necromancer.setLog = setLog;
    Necromancer.StudyHall = StudyHall;
    Necromancer.Grimoire = Grimoire;
    Necromancer.BellToll = BellToll;
    return Necromancer;
  }());
  Ritual = (function(superclass){
    Ritual.displayName = 'Ritual';
    var prototype = extend$(Ritual, superclass).prototype, constructor = Ritual;
    function Ritual(c){
      this.unholy = true;
      this.readGrimoire();
      this.timeMultiplier = 1;
      if (c) {
        c.call(this);
      }
    }
    prototype.readGrimoire = function(){
      var key;
      for (key in Grimoire) {
        (fn$.call(this, key));
      }
      function fn$(key){
        this[key] = function(){
          var args;
          args = [].slice.call(arguments);
          args.unshift(key);
          return this.put.apply(this, args);
        };
      }
    };
    prototype.put = function(action, params, p, p2){
      params == null && (params = {});
      p == null && (p = null);
      p2 == null && (p2 = null);
      if (typeof params == "number") {
        params = {
          duration: params
        };
      }
      params.delay = (params.delay || 0) * this.timeMultiplier;
      params.duration = (params.duration || 0) * this.timeMultiplier;
      params.p = p;
      params.p2 = p2;
      this.push({
        action: action,
        params: params
      });
    };
    prototype.keyframe = function(params){
      var keyframes, duration, delay, snapFirst, kdur, idx, len$, kf, action;
      params == null && (params = {});
      keyframes = [].slice.call(arguments, 1);
      duration = (typeof params == "number"
        ? 0 | params
        : params.duration) || 1000;
      delay = params.delay || 0;
      snapFirst = !!params.snapFirst;
      kdur = duration / keyframes.length;
      for (idx = 0, len$ = keyframes.length; idx < len$; ++idx) {
        kf = keyframes[idx];
        action = idx == 0 && snapFirst ? "css" : "animate";
        this.put(action, {
          duration: duration,
          delay: delay
        }, kf);
      }
    };
    return Ritual;
  }(Array));
  ScryingOrb = (function(){
    ScryingOrb.displayName = 'ScryingOrb';
    var drawLine, prototype = ScryingOrb.prototype, constructor = ScryingOrb;
    drawLine = function(ctx, x0, y0, x1, y1, style, width){
      ctx.beginPath();
      ctx.strokeStyle = style;
      ctx.lineWidth = width;
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    };
    function ScryingOrb(master){
      this.master = master;
      this.$stage = this.master.$target.parent();
      this.canvas = document.createElement("canvas");
      this.$canvas = $(this.canvas);
      this.$canvas.css({
        position: "absolute",
        left: 0,
        top: 0,
        "z-index": 9000
      });
      this.magic = 0 | 5 + Math.random() * 30;
      this.ctx = this.canvas.getContext("2d");
      this.$stage.append(this.$canvas);
    }
    prototype.destroy = function(){
      this.$canvas.remove();
      this.canvas = null;
      this.ctx = null;
    };
    prototype.redraw = function(){
      var c, pos, accTime, accCSS, ctx, drawBox, idx, ref$, len$, ac, isPast, vColor, fromObj, toObj, x0, y0, x1, y1;
      if (!(c = this.canvas)) {
        return;
      }
      c.width = this.$stage.width();
      c.height = this.$stage.height();
      pos = this.master.current;
      accTime = 0;
      accCSS = {
        left: 0,
        top: 0
      };
      ctx = this.ctx;
      drawBox = _.bind(this.drawBox, this);
      for (idx = 0, len$ = (ref$ = this.master.queue).length; idx < len$; ++idx) {
        ac = ref$[idx];
        isPast = pos > idx;
        vColor = isPast
          ? "silver"
          : pos == idx ? "lime" : "orange";
        accTime += ac.params.delay;
        fromObj = accCSS;
        toObj = null;
        switch (ac.action) {
        case "animate":
          if (ac.params.p2) {
            fromObj = import$(import$({}, fromObj), ac.params.p);
            toObj = ac.params.p2;
          } else {
            toObj = ac.params.p;
          }
          break;
        case "css":
          fromObj = toObj = import$(import$({}, fromObj), ac.params.p);
        }
        x0 = 0 | (fromObj != null ? fromObj.left : void 8);
        y0 = 0 | (fromObj != null ? fromObj.top : void 8);
        x1 = (toObj != null ? toObj.left : void 8) || x0;
        y1 = (toObj != null ? toObj.top : void 8) || y0;
        drawLine(ctx, x0, y0, x1, y1, "black", 7);
        drawLine(ctx, x0, y0, x1, y1, vColor, 3);
        if (!isPast) {
          drawBox(ctx, idx, ac, x0, y0, vColor);
        }
        accCSS.left = x1;
        accCSS.top = y1;
        accTime += ac.params.duration;
      }
    };
    prototype.drawBox = function(ctx, idx, ac, pointToX, pointToY, vColor){
      var lines, line, k, v, lineH, boxW, i$, len$, text, boxH, an, r, boxX, ref$, ref1$, ref2$, boxY, boxCX, boxCY;
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.font = "9px/9px Segoe UI";
      lines = [idx + ": " + ac.action];
      if (ac.action == "css" || ac.action == "animate") {
        line = (function(){
          var ref$, results$ = [];
          for (k in ref$ = ac.params.p) {
            v = ref$[k];
            results$.push(k + ": " + v);
          }
          return results$;
        }()).join(", ");
        if (line.length) {
          lines.push(line);
        }
      }
      if (ac.action == "delay") {
        lines.push(ac.params.duration + " msec");
      }
      lineH = 10;
      boxW = 0;
      for (i$ = 0, len$ = lines.length; i$ < len$; ++i$) {
        text = lines[i$];
        boxW = Math.max(boxW, ctx.measureText(text).width) + 5;
      }
      boxH = lineH * lines.length + 3;
      an = (idx * this.magic) % 6.282;
      r = 30 + (idx % 5) * 15;
      boxX = (ref$ = (ref2$ = 0 | pointToX + Math.cos(an) * r) > 0 ? ref2$ : 0) < (ref1$ = this.canvas.width - boxW) ? ref$ : ref1$;
      boxY = (ref$ = (ref2$ = 0 | pointToY + Math.sin(an) * r) > 0 ? ref2$ : 0) < (ref1$ = this.canvas.height - boxH) ? ref$ : ref1$;
      boxX += 0.5;
      boxY += 0.5;
      boxCX = boxX + boxW * 0.5;
      boxCY = boxY + boxH * 0.5;
      drawLine(ctx, pointToX, pointToY, boxCX, boxCY, vColor, 2);
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.lineWidth = 1;
      ctx.strokeRect(boxX, boxY, boxW, boxH);
      ctx.fillStyle = vColor;
      for (idx = 0, len$ = lines.length; idx < len$; ++idx) {
        text = lines[idx];
        ctx.fillText(text, boxX + 2, boxY + lineH * (1 + idx));
      }
    };
    return ScryingOrb;
  }());
  RitualBook = {};
  root.Necromancer = Necromancer;
  root.Ritual = Ritual;
  root.RitualBook = RitualBook;
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
  function extend$(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
}).call(this);
