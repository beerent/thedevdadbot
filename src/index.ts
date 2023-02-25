import { RiddleController } from './controllers/RiddleController';
import { FishController } from './controllers/FishController';
import { logger } from './logger';
import { twitchClient } from './twitch-client';

const messageHandlers = {
    '!fishcam': FishController.handle,
    '!riddle': RiddleController.handle,
} satisfies Record<string, (message: string, username: string) => Promise<void>>;

twitchClient.on('message', (_channel, state, message) => {
    const username = state['display-name'];

    // Ignore messages from the bot
    if (!username || username === 'thedevdadbot') return;

    // Log the message and who sent it
    logger.log(username, message);

    // Get the command from the message
    const command = message.split(' ')[0] as keyof typeof messageHandlers;

    // If this is a command we know about, handle it
    if (messageHandlers[command]) void messageHandlers[command](message, username);
});