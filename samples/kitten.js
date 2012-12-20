/**

IF YOU ARE CURRENTLY LOOKING AT A .JS FILE, LOOK AT THE CORRESPONDING .CO INSTEAD.

IF YOU ARE WONDERING WHY YOUR CHANGES DO NOT APPEAR IN THE .JS FILE, YOU SHOULD PROBABLY
BE RUNNING

  coco -wc kitten.co

AND STOP WONDERING.

*/
(function(){
  var makeKittenRitual;
  Necromancer.setLog(true);
  RitualBook.mew = new Ritual(function(){
    this.debug("mew");
    this.classes({
      mew: true
    });
    this.followSummoner({
      css: ['left', 'top']
    });
    this.show();
    this.animate({
      duration: 500,
      easing: "swing"
    }, {
      opacity: 0
    }, {
      top: "-=50",
      left: "-=50",
      opacity: 1
    });
    this.delay(100);
    this.keyframe({
      duration: 200,
      delay: 30
    }, {
      left: "-=10"
    }, {
      left: "+=20"
    }, {
      left: "-=10"
    }, {
      left: "+=10"
    });
    this.animate(1000, {
      opacity: 0
    });
    return this.destroy();
  });
  makeKittenRitual = function(){
    return new Ritual(function(){
      var tardiness, sloppiness;
      tardiness = 1.0 + Math.random() * 0.5;
      sloppiness = 1.0 + Math.random() * 0.5;
      this.css({}, {
        left: 150 + Math.random() * 30,
        top: 310 + Math.random() * 20
      });
      this.animate({
        duration: 1500 * tardiness,
        easing: "swing"
      }, {
        top: 200
      });
      this.delay(200 * sloppiness);
      this.animate({
        duration: 400 * tardiness,
        easing: "swing"
      }, {
        top: 160 - Math.random() * 20
      });
      this.delay(300 * sloppiness);
      this.summon({
        ritual: "mew",
        hidden: true
      });
      this.delay(700 * sloppiness);
      this.animate({
        duration: 1500 * tardiness
      }, {
        top: 320
      });
      return this.destroy();
    });
  };
  window.showMeAKitten = function(debug){
    var x$;
    x$ = Necromancer.summon("<div class=kitten>", "#bg", makeKittenRitual());
    if (debug) {
      x$.scry();
    }
    x$.start();
    return x$;
  };
}).call(this);
