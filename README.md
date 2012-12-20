Necromancer - animate dead elements
===================================

Necromancer is a small library/DSL for immersive "Flash-like"
animations and animation loops for web sites.

It was originally written at [Anders Inno](http://andersinno.com/)
in approximately two days for a client project that required rich
animation that would also work on iPads. This obviously ruled out
Flash, so we -- or well, I -- busted out a text editor and hacked
Necromancer together. Product delivered well before deadline, with
(quite literally -- Necromancer supports sound via the BellToll
submodule) bells and whistles attached.

The source code for Necromancer had been languishing on my HD for
far too long, and I figured other people might have use for its
eldritch horrors.

Oh - yes, you can bet the naming of classes and concepts in
Necromancer is as silly as the name of the library.

Features
--------

* Nice DSL for coders-writing-animations (once you get used to it)
* Reasonably fast (1st generation iPads had no trouble)
* Supports multiple instances of objects without conflicts
* Automatically repeating animations (if required)
* Extensible without too much effort
* About 10k when minified, like 4k when gzipped! POW!

Concepts/API
------------

The library itself is currently more or less undocumented, but here goes:

* A *Necromancer* is an object that possesses a given DOM element
  and orchestrates its behavior via what is affectionately called
  a ritual.

* *Rituals* are objects that are (usually) created via a pseudo
  DSL (Domain Specific Language). Rituals describe how an element
  behaves in a series of procedural, deterministic (well, deterministic
  during runtime, at least -- you can generate rituals on the fly)
  calls to behavioral incantations (Actions) looked up from the Grimoire.

* The *RitualBook* (a global object, also accessible via Necromancer.RitualBook)
  contains rituals that may be called upon by name instead of direct reference.

* The *Grimoire* is a single object that contains Actions that
  Rituals may call upon. For instance, "css", "show", "animate" and "delay" are
  among the default Actions provided with Necromancer.
  One can also write their own Actions and add them into the Grimoire.
  Subsequent Ritual creations will then be able to access them.
  It's accessible as Necromancer.Grimoire.

* The *StudyHall* is a factory for new Rituals. It can provide you with
  a fast way to implement blinking lights (makeClassTogglingRitual),
  occasionally disappearing things (makeBlinkingRitual), or for instance
  puffs of smoke (makeFadingMoverRitual). It's provided as a convenience,
  and can be mercilessly ripped out of the library if you want a smaller
  build. It is accessible as Necromancer.StudyHall.

* The *ScryingOrb* is a versatile debugging tool that may be used by a
  Necromancer via the scry() call.

* *BellToll* is a helper object to interface with (what was, at the time
  of the library's writing, hot stuff) the SoundManager library to enable
  the @playSound Action. It can also be ripped out.

If this all seems confusing -- well, you're right, it may well be.

You should take a look at the sample(s) in the "samples/" directory and
things might get a little clearer. The samples are also living proof of why I
write code and don't draw graphics.

Requirements
------------

On the build machine, you'll need the bizarre and excellent
[Coco](http://github.com/satyr/coco) language, as the library
is written in it.

On clients, jQuery or another library API compatible with it is
currently required. Patches to remove this dependency are welcome.

Credits
-------

Written with love and hacker spirit by [akx](http://github.com/akx)
at Anders Inno.

License
-------

Licensed under the MIT License:

Copyright (C) 2011, 2012 by Anders Inno Oy

Permission is hereby granted, free of charge, to any
person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the
Software without restriction, including without
limitation the rights to use, copy, modify, merge,
publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software
is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice
shall be included in all copies or substantial portions
of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
