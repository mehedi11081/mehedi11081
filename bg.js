function Particle() {
  this.init();
}

Particle.prototype.radius = 3;

Particle.prototype.render = function () {
  var instance = this;

  instance.x += instance.speedX;
  instance.y += instance.speedY;
  instance.point.update(instance.x, instance.y);

  if (instance.x >= canvas.width + 110) {
    instance.x = -110;
  } else if (instance.x <= -110) {
    instance.x = canvas.width + 100;
  }

  if (instance.y >= canvas.height + 110) {
    instance.y = -110;
  } else if (instance.y <= -110) {
    instance.y = canvas.height + 100;
  }

  context.beginPath();
  context.fillStyle = "rgba(155,155,155,1)";
  context.arc(instance.x, instance.y, instance.radius, 0, 360, false);
  context.fill();
};

Particle.prototype.init = function () {
  var instance = this;

  instance.x = Math.round(Math.random() * (canvas.width - 100), 10) + 50;
  instance.y = Math.round(Math.random() * (canvas.height - 100), 10) + 50;
  instance.point = new Point(instance.x, instance.y);

  instance.speedX = 0.02 + Math.random() * 0.25;
  instance.speedY = 0.02 + Math.random() * 0.25;

  if (Math.round(Math.random(), 10)) {
    instance.speedX = -instance.speedX;
  }
  if (Math.round(Math.random(), 10)) {
    instance.speedY = -instance.speedY;
  }
};

/* Points (Coordinates) */

function Point(x, y) {
  this.update(x, y);
}

Point.prototype.update = function (x, y) {
  this.x = x;
  this.y = y;
  return this;
};

function Line(from, to) {
  this.update(from, to);
}

/* Lines */

Line.prototype.update = function (from, to) {
  this.from = from;
  this.to = to;
  return this;
};

Line.prototype.render = function () {
  var instance = this,
    alpha = 0.5 - (0.5 * hypotenus(instance.from, instance.to)) / maxDistance;

  context.beginPath();
  context.moveTo(instance.from.x, instance.from.y);
  context.lineTo(instance.to.x, instance.to.y);
  context.strokeStyle = "rgba(255,255,255," + alpha + ")";
  context.stroke();
};

/*--- Helper Functions ----*/

function hypotenus(Point1, Point2) {
  Point2 = Point2 || new Point(0, 0);

  var distX = Math.abs(Point1.x - Point2.x, 10),
    distY = Math.abs(Point1.y - Point2.y, 10);

  return Math.sqrt(distX * distX + distY * distY);
}

function linesAreSame(Line1, Line2) {
  /*
   * Both comparisons below should be `true`.
   *
   * Line 1 { from : { x : 0, y : 10 }, to : { x : 10, y : 20 } }
   * Line 2 { from : { x : 0, y : 10 }, to : { x : 10, y : 20 } }
   *
   * Line 1 { from : { x : 10, y : 20 }, to : { x : 0,  y : 10 } }
   * Line 2 { from : { x : 0,  y : 10 }, to : { x : 10, y : 20 } }
   */

  if (
    (Line1.from.x === Line2.from.x &&
      Line1.from.y === Line2.from.y &&
      Line1.to.x === Line2.to.x &&
      Line1.to.y === Line2.to.y) ||
    (Line1.from.x === Line2.to.x &&
      Line1.from.y === Line2.to.y &&
      Line1.to.x === Line2.from.x &&
      Line1.to.y === Line2.from.y)
  ) {
    return true;
  }

  return false;
}

/*---- Setup the canvas loop ----*/

var canvas = document.getElementById("myCanvas"),
  context = canvas.getContext("2d"),
  particlesArr = [],
  linesArr = [],
  quadArea = [],
  loop = false,
  maxDistance = hypotenus(new Point(0, 0), new Point(100, 100));

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.requestAnimFrame = (function (callback) {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

function ready() {
  for (var i = 50; i > -1; i--) {
    particlesArr.push(new Particle());
  }
}

function draw() {
  window.requestAnimFrame(function () {
    /* Empty the canvas to draw the next animation frame */
    context.clearRect(0, 0, canvas.width, canvas.height);

    /* Sort the particles in ascending distance from the
     * top left edge of the canvas. */

    /* Actually, their order doesn't matter, so just gonna
     * disable it. */

    /*particlesArr.sort(function(a, b) {
            var distA = hypotenus(a.point),
                distB = hypotenus(b.point);

            if(distA < distB) {
                return -1;
            } else if(distA > distB) {
                return 1;
            } else {
                return 0;
            }
        });*/

    var i = (j = k = 0);

    linesArr = [];

    /* Loop through to see if we need to generate some lines. */
    for (var distHypotenus, k = particlesArr.length - 1; k > -1; k--) {
      for (i = 0, j = particlesArr.length; i < j; i++) {
        if (k === i) continue;

        distHypotenus = hypotenus(particlesArr[k].point, particlesArr[i].point);

        if (distHypotenus < maxDistance) {
          linesArr.push(new Line(particlesArr[k].point, particlesArr[i].point));
        }
      }
    }

    /* Remove duplicate lines. */

    for (i = linesArr.length - 1; i > -1; i--) {
      for (j = 0, k = linesArr.length; j < k; j++) {
        if (i === j) continue;

        if (linesAreSame(linesArr[i], linesArr[j])) {
          linesArr.splice(i, 1);
          break;
        }
      }
    }

    /* Now we actually render them. */

    for (i = linesArr.length - 1; i > -1; i--) {
      linesArr[i].render();
    }

    for (i = particlesArr.length - 1; i > -1; i--) {
      particlesArr[i].render();
    }

    /* R-r-r-recursive! */
    draw();
  });
}

/*---- Event Handlers ----*/

window.onload = function () {
  ready();
  draw();
};

window.onresize = function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
