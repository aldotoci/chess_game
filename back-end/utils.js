const User = require('./models/User');
const Game = require('./models/Game');

const whenUserLeaveTheGame = async (gameId, userId) => {
    const game = await Game.findById(gameId);

    const initializer = await User.findById(game.initializer._id);
    const opponent = await User.findById(game.opponent._id);

    game.status = 'ended';

    // Decrease currentRating user user who left the game
    if (initializer._id.toString() === userId) {
        initializer.currentRating -= 10;
        opponent.currentRating += 10;

        // increase the wins and losses
        initializer.wins += 1;
        opponent.losses += 1;
    } else {
        initializer.currentRating += 10;
        opponent.currentRating -= 10;
        // increase the wins and losses
        
        opponent.wins += 1;
        initializer.losses += 1;
    }

    // Increase games played for both users
    initializer.gamesPlayed += 1;
    opponent.gamesPlayed += 1;



    await game.save();
    await initializer.save();
    await opponent.save();
}

const whenTheGameStarts = async (gameId) => {
    const game = await Game.findById(gameId).populate('initializer').populate('opponent');
    game.status = 'started';
    await game.save();
}


module.exports = {
    whenUserLeaveTheGame,
    whenTheGameStarts
}