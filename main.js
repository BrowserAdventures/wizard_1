
class Matrix
{
    constructor()
    {
        this.map = [     // 16x16  ARRAY   //
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,0,0,1,0,0,0,0,0,0,0,0,0,2,1],
            [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
            [0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,1],
            [0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,0,0,0,0,0,0,0,0,2,0,1,0,0,0,1],
            [1,1,1,1,1,1,1,1,0,2,0,1,1,0,0,1],
            [1,1,0,0,0,1,1,1,0,0,0,1,0,0,0,1],
            [1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,1],
            [1,0,0,0,2,1,0,1,1,1,1,1,1,0,0,2],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1],
        ]
        this.columnTotal = 16;
        this.rowTotal = 16;
        this.tileSize = 32;
        const W = canvas.width = this.columnTotal * this.tileSize;
        const H = canvas.height = this.rowTotal * this.tileSize;
        this.img = new Image();
        this.img.src = 'platformGround.png';
        this.Fwidth = this.img.width/13;
        this.Fheight = this.img.height/13;
        this.cropX = this.Fwidth;
        this.cropY = this.Fheight;
    }
    create()
    {
        for (let i = 0; i < this.rowTotal; i++)
        for (let j = 0; j < this.columnTotal; j++)
        {
            const X = j * this.tileSize;
            const Y = i * this.tileSize;

            // draw ladder
            if (this.map[i][j] == 2) {
                ctx.drawImage(this.img, this.cropX*6.15, this.cropY*7,
                this.Fwidth, this.Fheight, X, Y, this.tileSize, this.tileSize);
            }
            // draw platfrom
            if (this.map[i][j] == 1) {
                ctx.drawImage(this.img, this.cropX*9.2, this.cropY*0,
                this.Fwidth, this.Fheight, X, Y, this.tileSize, this.tileSize);
                ctx.fillStyle = 'rgba(70,30,0, 0.4)';
                ctx.fillRect(X, Y, this.tileSize, this.tileSize);
            }
            // draw background
            if (this.map[i][j] == 0) {
                ctx.fillStyle = 'black';
                ctx.fillRect(X, Y, this.tileSize, this.tileSize);
            }
        }
    }
}

class Rect extends Matrix
{
    constructor(w, h)
    {
        super();
        this.X = 0;
        this.Y = 0;
        this.size = {w: w, h: h};
        this.vel = {x: 0, y: 0};
    }
    square()
        ctx.fillStyle = 'grey';
        ctx.fillRect(this.X, this.Y, this.size.w, this.size.h);
    }
    get right() {
        return this.X + this.size.w;
    }
    get bottom() {
        return this.Y + this.size.h;
    }
}

class Sprite extends Rect
{
    constructor(path, fwNumber, fhNumber)
    {
        super(32, 32);
        this.img = new Image();
        this.img.src = path;
        this.fwNumber = fwNumber; this.fhNumber = fhNumber;
        this.Fwidth = this.img.width / this.fwNumber;
        this.Fheight = this.img.height / this.fhNumber;
        this.cropX = 0; this.cropY = 0;
        // tracks animation interval
        this.Xcounter = 0; this.Ycounter = 0;
    }
    
    animate()
    {
        //  creates animation loop  //
        this.Xspeed = Math.floor(this.Xcounter) % this.Xsequence;
        this.Xspeed *= this.Fwidth; // amount to increase each frame
        this.Xcounter += 0.2; // animation speed
        //  boundaries loop  //
        if (this.right < 0) this.X = 16*30;
        if (this.X > 16*32) this.X = -1;
    }

    draw() {
        ctx.drawImage(this.img,
            this.cropX, this.cropY,
            this.Fwidth, this.Fheight,
            this.X, this.Y,
            this.size.w, this.size.h);
    }

    update(columnX, rowY, Xsequence) {
        this.Xsequence = Xsequence;
        this.columnX = columnX * this.Fwidth;
        this.cropY = rowY * this.Fheight;
        this.cropX = this.columnX + this.Xspeed;
    }

    collision()
    {
        let x = Math.floor(this.X/this.tileSize);
        let y = Math.floor(this.Y/this.tileSize);
        let columnOver = this.X % this.tileSize;
        let rowOver = this.Y % this.tileSize;

        // X axis
        if(this.vel.x > 0)
        if((this.map[y][x+1] && !this.map[y][x]) ||
            (this.map[y+1][x+1] && !this.map[y+1][x] && rowOver))
        {
            this.X = x * this.tileSize;
        }
        if (this.vel.x < 0)
        if((!this.map[y][x+1] && this.map[y][x]) ||
            (!this.map[y+1][x+1] && this.map[y+1][x] && rowOver))
        {
            this.X = (x+1) * this.tileSize;
        }

        // Y axis
        if (this.vel.y > 0)
        if((this.map[y+1][x] && !this.map[y][x]) ||
            (this.map[y+1][x+1] && !this.map[y][x+1] && columnOver))
        {
            this.Y = y * this.tileSize;
        }
        if (this.vel.y < 0)
        if((!this.map[y+1][x] && this.map[y][x]) ||
            (!this.map[y+1][x+1] && this.map[y][x+1] && columnOver))
        {
            this.Y = (y+1) * this.tileSize;
        }
    }
}

class Player extends Sprite
{
    constructor()
    {
        super('wizard_01.png', 8, 5);
        this.X = 2 * this.tileSize;
        this.Y = 2 * this.tileSize;
        this.speed = 1;
        this.gravity = 3;
        this.leftkey = false; this.rightkey = false;
        this.upkey = false; this.downkey = false;
        this.stop = true; this.start = false;
    }
    init()
    {
        if(this.stop) this.Xspeed = 0;
        this.animate();
        this.controller();
        this.collision();

    }
    controller()
    {
        this.vel.x = 0;
        this.vel.y = 0;

        // LEFT //
        if(this.leftkey &&!(this.rightkey || this.upkey || this.downkey))
        {
            this.vel.x = -this.speed;
            this.update(0, 1, this.fwNumber);
            this.draw();
            this.stop = false;
            this.start = true;
            this.direction = false;
        }
        // RIGHT //
        if(this.rightkey &&!(this.leftkey || this.upkey || this.downkey))
        {
            this.vel.x = this.speed;
            this.update(0, 2, this.fwNumber);
            this.draw();
            this.stop = false;
            this.start = true;
            this.direction = true;

        }
        // UP //
        if(this.upkey &&!(this.leftkey || this.rightkey || this.downkey))
        {
            this.update(4, 0, 4);
            this.draw();
            this.stop = false;
            this.start = true;
        }
        // DOWN //
        if(this.downkey &&!(this.leftkey || this.rightkey || this.upkey))
        {
            this.vel.y = this.speed;
            this.update(4, 0, 4);
            this.draw();
            this.stop = false;
            this.start = true;
        }
        // SPACEBAR // null
        if(this.spacebar &&!(this.leftkey || this.rightkey || this.upkey))
        {}
        // updates animation direction //
        if(this.stop)
        {
            if(this.direction) this.update(0, 2, 1);
            if(!this.direction) this.update(0, 1, 1);
        }
        if(!this.start) this.update(0, 0, 1);

        this.draw();
        this.vel.y += this.gravity;
        this.X += this.vel.x;
        this.Y += this.vel.y;
        this.stop = true;
    }
}

class People extends Sprite
{
    constructor(x)
    {
        super('greyMan1.png', 8, 9);
        this.Y = 16*7;
        this.row = Math.floor(Math.random()*(7 -4)+4);
        this.X = Math.floor(Math.random()*((x) -32)+32);
        this.vel.x = Math.floor(Math.random()*(150 -80)+80);
        this.gravity = 3;
        this.vel.y += this.gravity;
    }
    init() {
        this.animate();
        this.move();
        this.collision();
        this.update(0, this.row, 8);
        this.draw();
    }
    move()
    {
        this.X += Math.floor(Math.random()*(1.5 -1)+1);
        this.Xcounter += 0.03;
        this.Y += this.vel.y;
    }
}

class Magic extends Sprite
{
    constructor()
    {
        super('energyBlast.png', 8, 4);
        this.strikes = [];
        this.fire = false;
        this.hit = false;
        this.Fwidth = 10*2;
        this.Fheight = 10*4;
    }
    create()
    {
        for(var i = 0; i < this.strikes.length; i++) {
            this.X = this.strikes[i][0];
            this.Y = this.strikes[i][1];
            ctx.drawImage(this.img, this.cropX, this.cropY,
                this.Fwidth, this.Fheight,
                this.X, this.Y,
                this.size.w, this.size.h);
        }
        this.move();
        this.animate();
        this.shoot();
        //this.collision();
    }
    move()
    {
        for (var i = 0; i < this.strikes.length; i++)
        {
            if (this.strikes[i][0] < 32*18) {
                if (this.strikes[i][0] > player.X)
                    this.strikes[i][0] +=7;
                if (this.strikes[i][0] < player.X)
                    this.strikes[i][0] -=7;
            }
            if (this.strikes[i][0] > 32*17 || this.strikes[i][0] < -32)
                this.strikes.splice(i, 1);

            if (this.hit) this.strikes.splice(i, 1);
        }
    }
    shoot()
    {
        if (this.fire && this.strikes.length <= .1)
        {
            if(player.direction)
                this.strikes.push([player.X+32, player.Y+5]);
            if(!player.direction)
                this.strikes.push([player.X-20, player.Y+5]);
            this.draw();
        }
    }
}

class Game extends Matrix
{
    constructor()
    {
        super();
        this.magic = new Magic;
        this.mob = [];
        this.totalMob = 10;

        for (var i = 0; i < this.totalMob; i++) {
            this.mob.push(i);
        }
        for(var i = 0; i < this.mob.length; i++) {
            this.mob[i] = new People(300);
        }
        this.loop();
    }

    render()
    {
        this.wall();
        player.init();
        this.magic.create();
        this.mob.forEach(ppl => {
            ppl.init();
        })
    }

    update(dt)
    {
        for (var i = 0; i < this.mob.length; i++) {
        if(this.magic.Y+32 > this.mob[i].Y
        && this.magic.Y+32 < this.mob[i].Y+32
        && this.magic.X >= this.mob[i].X
        && this.magic.X+32 <= this.mob[i].X+32)
        {
            this.mob.splice(i, 1);
            this.mob.push(new People(50));
            this.score++;
            console.log('hit');
        }
        }
        this.render();
    }

    loop() {
        let lastTime;
        const callback = (Mseconds) => {
            this.create();
            if(lastTime) this.update((Mseconds -lastTime)/1000);
            lastTime = Mseconds;
            requestAnimationFrame(callback);
        }
        callback();
    }
}






/*_________________________________________________________*/
let KEY = {                 // KEY CONTROLS //
    press: function(e) {
        if (e.keyCode == 37) player.leftkey = true;
        if (e.keyCode == 39) player.rightkey = true;
        if (e.keyCode == 38) player.upkey = true;
        if (e.keyCode == 40) player.downkey = true;

        if (e.keyCode == 32) game.magic.fire = true;

    },
    release: function(e) {
        if (e.keyCode == 37) player.leftkey = false;
        if (e.keyCode == 39) player.rightkey = false;
        if (e.keyCode == 38) player.upkey = false;
        if (e.keyCode == 40) player.downkey = false;

        if (e.keyCode == 32) game.magic.fire = false;
    },

    touchMove: function(e) {
        if(e.touches) {
        player.X = e.touches[0].pageX - canvas.offsetLeft - player.size.x / 2;
        player.Y = e.touches[0].pageY - canvas.offsetTop - player.size.y / 2;
        output.innerHTML = "Touch: "+ " x: " + player.pos.x + ", y: " + player.pos.y;
        e.preventDefault();
        }
    },
    touch: function(e) {
        if(e.touches) game.magic.fire = true;
        if(!e.touches) game.spit.fire = false;
    }
}
document.addEventListener('keydown', KEY.press, false);
document.addEventListener('keyup', KEY.release, false);
document.addEventListener("touchstart", KEY.touch, false);
//document.addEventListener("touchmove", KEY.touchMove, false);
const ctx=document.getElementById('canvas').getContext('2d');

const player = new Player;
window.onload = game = new Game;
