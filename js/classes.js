
class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }, width = 50, height = 150) {
        this.position = position;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.offset = offset;
        this.width = width;
        this.height = height;
    }

    draw() {
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        );
    }

    animateFrame() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0;
            }
        }
    }

    update() {
        this.draw();
        this.animateFrame();
    }
};

class Fighter extends Sprite {
    constructor({ position, velocity, moviment, imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 }, sprites, left, fantasyName, timeAtk, name, spriteSet }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
        });
        this.velocity = velocity;
        this.moviment = moviment;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            height: 70,
            width: 180,
        };
        this.isAttacking = false;
        this.health = 100;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.offset = offset;
        this.left = left;
        this.sprites = sprites;
        this.fantasyName = fantasyName;
        this.timeAtk = timeAtk;
        this.dead = false;
        this.selected = false;
        this.name = name;
        this.special = 25;
        this.spriteSet = spriteSet;

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

    select() {
        this.selected = true;
    }

    update() {

        /* c.fillStyle = 'blue';
        c.fillRect(
            (this.position.x - this.offset.x) + ((this.image.width / this.framesMax) * this.scale) / 3,
            (this.position.y - this.offset.y) + ((this.image.height * this.scale) / 2) / 2,
            ((this.image.width / this.framesMax) * this.scale) / 3,
            (this.image.height * this.scale) / 2
        ) */

        /* c.fillStyle = 'red';
        c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height) */

        this.draw();
        if (!this.dead) this.animateFrame();

        this.attackBox.position.x = this.position.x - this.offset.attackBox.x;
        this.attackBox.position.y = this.position.y - this.offset.attackBox.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // gravity function
        if (this.position.y + 125 + this.velocity.y >= canvas.height - 45) {
            this.velocity.y = 0;
            this.position.y = 422;
        } else this.velocity.y += gravity;
    }

    attack() {
        this.switchSprite('attack1');
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 1000)
    }

    takeHit(dm) {
        this.health -= dm

        if (this.health <= 0) {
            this.switchSprite('death');
        } else {
            this.switchSprite('takeHit');
        }
    }

    switchSprite(sprite) {
        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.sprites.death.framesMax - 1)
                this.dead = true
            return
        };

        if (this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax - 1) return;
        if (this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax - 1) return;

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.framesCurrent = 0;
                }
                break
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                }
                break
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.framesCurrent = 0;
                }
                break
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.framesCurrent = 0;
                }
                break
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax;
                    this.framesCurrent = 0;
                }
                break
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.framesMax = this.sprites.takeHit.framesMax;
                    this.framesCurrent = 0;
                }
                break
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image;
                    this.framesMax = this.sprites.death.framesMax;
                    this.framesCurrent = 0;
                }
                break
        }
    }
};