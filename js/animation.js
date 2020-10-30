class AnimationClass {
  sprites = [];
  started = false;

  newSprite(sprite) {
    this.sprites.push(sprite);
  }

  on() {
    this.started = true;
    this.nextFrame();
  }

  off() {
    this.started = false;
  }

  nextFrame() {
    if (!this.started) return;

    this.clearScreen();
    for (var sprite of this.sprites) sprint.update();
    for (var sprite of this.sprites) sprint.draw();

    let animation = this;
    requestAnimationFrame(function () {
      animation.nextFrame();
    });
  }
}
