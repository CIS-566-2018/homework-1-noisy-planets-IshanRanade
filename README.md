# CIS 566 Project 1: Noisy Planets


## Ishan Ranade (ish2017)

![](danPlanet.png)

## Overview
This project demonstrates a procedurally created and procedurally modified planet.
The terrain changes over time, and there are various controls to modify the speed
of the passage of time, the level of water, the bobbing of water, and the color
of the water.

## Terrain
The terrain was generated using Perlin noise and adding together about 10 different
versions of the noise with various frequencies and amplitudes to get a nice, rocky,
rugged shape.  The different biome types are determined by the height field of the
overall noise function, with some interpolation between biomes to move smoothly between
them.  Biomes include a beach near the water, dirt above that, two types of forests, 
and a mountain with snow at the top.  For the two forests, I used a random function to
distribute different colored trees to make it look nicer to the eye.  Below the water level
is just basic dirt that can be exposed by using the GUI to lower the water level.

## Cities
I created some basic lighted areas on the dark side of the planet to simulate cities.
I placed them at high terrain levels, and randomly distributed different colored lights
in the area.  I also modifed the light ray vector for these specific vertices so that
only the lights would show up and the rest of the dark side of the planet would remain
unlit.  I also increased the height of the vertices of the light positions to make them
seem like tall buildings.

## Shading
I used a lambert shading for the terrain and implemented Blinn-Phong shading for the water.
If you go to the dark side of the planet, I also implemented a glow so that water appears
to be glowing under a light in the night sky.  On the light side of the planet the water is not
modified too much and looks normal.

## Water
The water was created by using a second render pass with a different alpha value to 
create a slight transparent look.  The water color, level, and bobbing variance is 
controllable with the GUI.  The bobbing variance means how much the water will
appear to bob up and down, to add some animation and life to the planet.  To create
the water, I sampled the height field noise function and tested the difference from
the desired water level, and placed transparent water at a point if the terrain was
not above the water level.

## Extra Credit: Time
I used a 4D Perlin noise function to show the passage of time.  You can modify the speed
of time with the GUI, and you can see the structure of the planet change.
