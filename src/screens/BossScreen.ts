// tslint:disable member-ordering
/// <reference path="GameScreen.ts"/>

/**
 * Screen where the user can play the game
 */
class BossScreen extends GameScreen {
    private boss: Boss;
    private player: Player;
    private enemy: Array<Enemy>;
    private sword: Sword;
    private shouldSwitchToTitleScreen = false;
    private id: IDcard;

    private playerLives: number;
    private enemyLives: number;

    /**
     * Construct a new GameScreen object.
     *
     * @param game the game this screen belongs to
     */
    public constructor(game: Game) {
        super(game);
        this.boss = new Boss(new Vector(100, 400), new Vector(0, 0), this.game.ctx, "./assets/urawizardgandalf.png", this, 6, 20);
        this.player = new Player(new Vector(100, 900), new Vector(0, 0), this.game.ctx, "./assets/Squary.png", 1, 1, 1);
        this.sword = new Sword(new Vector(140, 675), new Vector(0, 0), this.game.ctx, "./assets/mastersword.png", 1, 1, 0.1);
        this.enemy = [];
        for (let i = 0; i < 8; i++) {
            this.enemy[i] = new Enemy(new Vector(this.randomNumber(100, this.game.canvas.width - 100), this.randomNumber(100, this.game.canvas.height - 100)), new Vector(this.randomNumber(-4, 4), this.randomNumber(-2, 2)), this.game.ctx, "./assets/Enemy.png", this, 1, 1);
        }

        this.id = new IDcard(new Vector(this.game.canvas.width, 0), new Vector(0, 0), this.game.ctx, './assets/idcard/idCard5.png', 1, 1, 1.5, game);
        // add an mouse event listener

        this.enemyLives = 100;
    }

    public adjust(game: Game) {
        for (let i = 0; i < this.enemy.length; i++) {
            this.enemy[i].enemyMove(this.game.canvas);
        }
        this.player.playerMove(this.game.canvas);
    }

    /**
     * Let this screen draw itself and its gameobjects on the given rendering
     * context.
     *
     * @param ctx the rendering context to draw on
     */
    public draw(ctx: CanvasRenderingContext2D) {
        for (let i = 0; i < this.enemy.length; i++) {
            this.enemy[i].update();
        }
        this.boss.update();
        this.player.update();
        if (this.player.hasSword) {
            this.sword.movePos(this.player);
            this.sword.update();
        }
        this.id.update();
    }

    /**
     * Let this screen listen to the user input
     */
    public listen(userinput: UserInput) {
        if (this.player.clickedOn(userinput)) {
            console.log("omg");
        };
        if (this.boss.clickedOn(userinput)) {
            console.log("aiergjoiajgn");
        }
    }

    /**
    * Check collisions
    */
    public collide() {
        let player = this.player.box();
        let boss = this.boss.box();
        let sword = this.sword.box();
        for (let i = 0; i < this.enemy.length; i++) {
            let enemy = this.enemy[i].box();

            if (this.collides(player, enemy)) {
                if (this.enemy[i].exist) {
                    this.enemy[i].exist = false;
                    this.id.youGotRekt = this.id.youGotRekt - 1;
                }
                this.playerLives--;
                this.sound();

            }

            if (this.collides(sword, enemy) && this.player.hasSword) {
                this.enemyLives--;
            }

            if (this.enemyLives < 1) {
                this.enemy[i].exist = false;
                // console.log('Victory');
            }
            if (this.collides(player, enemy)) {
                if (this.enemy[i].exist) {
                    this.enemy[i].exist = false;
                    this.id.youGotRekt = this.id.youGotRekt - 1;
                }
            }
        }

        if (this.collides(player, boss)) {
            if (this.boss.exist) {
                this.boss.exist = false;
                this.id.youGotRekt = this.id.youGotRekt - 1;
            }
        }

        if (this.boss.attack) {
            if (this.collides(player, this.boss.attack.box())) {
                console.log("ohmygodtheykilledSquary!!");
            }
        }

    }

    public sound() {
        let audio = new Audio('./assets/sounds/oof.mp3');
        audio.play();
    }
}