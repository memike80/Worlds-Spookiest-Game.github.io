var WorldHardest = WorldHardest || {};

WorldHardest.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');

WorldHardest.game.state.add('Boot', WorldHardest.Boot);
WorldHardest.game.state.add('Preload', WorldHardest.Preload);
WorldHardest.game.state.add('MainMenu', WorldHardest.MainMenu);
WorldHardest.game.state.add('Game',WorldHardest.Game);
WorldHardest.game.state.add('GameOver',WorldHardest.GameOver);
WorldHardest.game.state.add('GameOverWin', WorldHardest.GameOverWin)

WorldHardest.game.state.start('Boot');