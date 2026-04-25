![GrowLogoBackground](.github/assets/GrowLogoBackground.png)

# The GROW-Project

With this project, I’m finally bringing an idea to life that’s been stuck in my head for quite a while: an algorithm that simulates tree-like growth patterns along arbitrary drawn strokes. The inspiration came from metal band logos like the one of French band Gojira. To make the tool easy to use and accessible to anyone, I built a frontend and published it here: 
The frontend lets users draw freely on a canvas. It uses a modified version of the [handwriting.js library by ChenYuHo](https://github.com/ChenYuHo/handwriting.js), which captures all drawn **traces**.

Before these traces are turned into **structs** (the data structures used for growth simulation), I added some preprocessing steps that convert traces into **strokes**.

First, I changed the data format from two separate arrays of x and y coordinates into a single array of coordinate tuples:

[[x1, x2, .., xn], [y1, y2, .., yn]]  
→  
[[x1, y1], [x2, y2], .., [xn, yn]]

Next, I interpolate additional 
points between coordinates that are far apart. These gaps usually occur 
when drawing straight lines. Since the algorithm creates nodes at each 
point—and new branches can only grow from nodes—large gaps would prevent
 proper branching and lead to uneven growth.[**grow.tillli.us**](http://grow.tillli.us) (Sorry for the missing SSL certificate... I'm cheap)

Enjoy :-)

## How it works

#### Traces, Strokes and Structs

The frontend lets users draw freely on a canvas. It uses a modified version of the [handwriting.js library by ChenYuHo](https://github.com/ChenYuHo/handwriting.js), which captures all drawn **traces**.

Before these traces are turned into **structs** (the data structures used for growth simulation), I added some preprocessing steps that convert traces into **strokes**.

First, I changed the data format from two separate arrays of x and y coordinates into a single array of coordinate tuples:

```
[[x1, x2, .., xn], [y1, y2, .., yn]]  
→  
[[x1, y1], [x2, y2], .., [xn, yn]]
```

Next, I interpolate additional points between coordinates that are far apart. These gaps usually occur when drawing straight lines. Since the algorithm creates nodes at each point, and new branches can only grow from nodes, large gaps would prevent proper branching and lead to uneven growth.
![StartPointEditor](.github/assets/StartPointEditor.png)To control where the growth starts, each stroke has a defined **start point**. These are stored as indices pointing to coordinate tuples within the stroke. In Edit Mode, they are displayed as red dots and can be adjusted.

![CyclicJoinPoint](.github/assets/CyclicJoinPoint.png)I also introduced **join points**, which connect two strokes so they behave as a single structure. Each resulting structure can only have one starting point, even if it consists of multiple strokes. They can be added and removed in Edit Mode and are represented by blue dots. Cyclic joins are not allowed; the program displays an error popup if the user attempts to create one. Internally, a join point is represented as:

```
{ strokeA, pointAIndex, strokeB, pointBIndex, intersection }
```

Where:

- `strokeA` / `strokeB` are indices in `state.strokeState.strokes`
- `pointAIndex` / `pointBIndex` refer to nodes within those strokes
- `intersection` stores the exact coordinates

From the processed strokes, start points, join points, and a configuration object, the program constructs **structs** that drive the growth simulation.
These structs consist of tree structures built from the defined strokes. Each stroke point becomes a node with one ancestor and possibly multiple descendants. The nodes are parameterized with a set of values that control their behavior during growth.

![GrowingDirection](.github/assets/GrowingDirection.png)Starting from the initial node, the structure grows outward in both directions, adding one node per cycle (“year”). All nodes age until the starting node reaches the defined maximum age.
As the main structure grows, nodes can sprout side branches depending on the configured probabilities. These side branches can recursively sprout further branches, leading to complex, organic patterns.

#### Parameters

The growth process is controlled by a set of parameters that evolved over time. Since the algorithm is custom-built, I added new parameters whenever I wanted to simulate a specific behavior.
The system is flexible and can easily be extended (feel free to suggest ideas or open an issue).

###### Basic Settings

- **Initial Thickness** - The thickness of the tree branches when they are at age 1

- **Thickness Grow Rate** - How quickly the thickness of branches increases per growth cycle (0-1)

- **Maximum Thickness** - The maximum thickness that branches can reach during growth

- **Maximum Age** - The maximum age (in cycles) that branches can grow to before stopping

###### Sprouting Settings

- **Minimum Sprouting Age** - The minimum age a branch must reach before it can start sprouting new branches

- **Tip Sprouting Probability** - The probability (0-1) that a side-branches will create a new node on its tip

- **Main Sprouting Probability** - The probability (0-0.05) that the main branches of the structure will sprout laterally at each growth cycle

- **Secondary Sprouting Probability** - The probability (0-0.05) that side branches will sprout laterally at each growth cycle

- **Sprout Length** - The initial distance between newly sprouted nodes

- **Breaking Off Probability** - The probability (0-0.01) that branches will break off during growth

###### Sprouting Direction Settings

- **Standard Lateral Sprouting Angle** - The default angle (in degrees, 0-180) at which lateral branches sprout from their ancestor branch

- **Maximum Random Angle Offset** - The maximum random deviation (in degrees, 0-90) from the standard sprouting angle to create variation

- **Away From COM Influence** - How strongly new branches are pushed away from the center of mass (0-2), creating a more outward directed growth

- **Ancestor Direction Influence** - How much new branches follow the direction of their parent branch (0-2)

###### Environment Settings

- **Crowding Minimum Distance** - The minimum distance (in pixels, 0-200) at which structures influence and inhibid growth of the other structures

- **Crowding Factor** - How strongly branches growth is inhibited when closer than the minimum distance to another structure (0-1)

###### 

## Startup im Dev-Mode

In case you want to extend the software and develop locally, the setup process is fairly straightforward. Just clone the repository and follow the steps below.

#### Install dependencies

```shell
npm install
```

#### Start local server

```shell
php -S localhost:8000 -t public
```

#### Compile SCSS

```shell
npm run sass
```

## Galery

To conclude this README, here are some images created using the website. Feel free to download any of your creations and use them however you like. Enjoy :-)

![Demo1](.github/assets/Demo1.png) ![Demo2](.github/assets/Demo2.png) ![Demo3](.github/assets/Demo3.png) ![Demo4](.github/assets/Demo4.png) ![Demo5](.github/assets/Demo5.png) ![Demo6](.github/assets/Demo6.png)
