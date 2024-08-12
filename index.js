require('dotenv').config();
const { 
    Bot,
     GrammyError, 
     HttpError, 
     Keyboard,
      InlineKeyboard 
    } = require('grammy');
    const {hydrate} = require('@grammyjs/hydrate')

const bot = new Bot (process.env.BOT_API_KEY);
bot.use(hydrate());

bot.api.setMyCommands([
    {
        command: 'start', 
        description: 'Запускает бота',
    },
    {
        command: 'mood',
        description: 'Как настроение?'
    },
    {
        command: 'share',
        description: 'Поделись чем нибудь:'
    },
    {
        command: 'inline_keyboard',
        description: 'Инлайн клавиатура'
    },
    {
        command: 'menu',
        description: 'Получить меню'
    }
]);


bot.command('start', async (ctx) => {
    await ctx.react('🍌')
    await ctx.reply('Привет\\! я \\- бот телеграм канала: [клик](https://t.me/pornoleha)', {
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: true
    });
});

const menuKeyboard = new InlineKeyboard()
.text('Узнать статус заказа шлюхи', 'order-status')
.text('Обратиться в ебаную техподдрежку', 'support')

const backKeyboard = new InlineKeyboard().text('< Назад в утробу', 'back');

bot.command('menu', async (ctx) => {
await ctx.reply('Выберете пункт меню', {
    reply_markup: menuKeyboard,
    });
});
    // метод hydrate //
bot.callbackQuery('order-status', async (ctx) => {
    await ctx.callbackQuery.message.editText('Статус шлюхи: едет бухая', {
        reply_markup: backKeyboard,
    });
    await ctx.answerCallbackQuery();
});

bot.callbackQuery('support', async (ctx) => {
    await ctx.callbackQuery.message.editText('Поплачься, что у нас все так плохо', {
        reply_markup: backKeyboard,
    });
    await ctx.answerCallbackQuery();
})

bot.callbackQuery('back', async (ctx) => {
    await ctx.callbackQuery.message.editText('Выберете пункт меню', {
        reply_markup: menuKeyboard,
    });
    await ctx.answerCallbackQuery();
})

    //другие комманды//

bot.command("mood", async (ctx) => {
    // const moodKeyboard = new Keyboard().text('Хорошо').row().text('Норм').row().text('Хуево')
    // .resized()

    const moodLabels = ['Хорошо','Пойдет','Плоховастенько']
    const rows = moodLabels.map((label) => {
        return [
            Keyboard.text(label)
        ]
    })
    const moodKeyboard2 = Keyboard.from(rows).resized()

    await ctx.reply('Как настроение?', {
        reply_markup: moodKeyboard2
    })
})

bot.command('share', async (ctx) => {
    const shareKeyboard = new Keyboard().requestLocation('Гео').requestContact('Контакт')
    .requestPoll('Опрос').placeholder('Укажи данные...').resized()

    await ctx.reply('Чем хочешь поделиться?', {
        reply_markup: shareKeyboard
    })
    
})

bot.command('inline_keyboard', async (ctx) => {
// const inlineKeyboard = new InlineKeyboard()
//     .text('1', 'button-1')
//     .text('2', 'button-2')
//     .text('3', 'button-3');
    const inlineKeyboard2 = new InlineKeyboard().url('Перейти в тг канал','https://t.me/pornoleha')
    await ctx.reply('Нажмите кнопку', {
        reply_markup: inlineKeyboard2
    })
})

bot.on(':contact', async (ctx) => {
    await ctx.reply('Спасибо за все твои данные)))')
       
})



bot.hears('Хорошо', async (ctx) => {
     await ctx.reply('Класс!', {
        reply_markup: {remove_keyboard: true}
     })
});

bot.hears('Пойдет', async (ctx) => {
    await ctx.reply('Бедни', {
       reply_markup: {remove_keyboard: true}
    })
});

bot.hears('Плоховастенько', async (ctx) => {
    await ctx.reply('Иди покакай, все пройдет', {
       reply_markup: {remove_keyboard: true}
    })
});

// bot.command(['say_hello', 'hello',  'say_hi' ], async (ctx) =>{
// await ctx.reply('Hello!')
// });


bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;

    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram", e);
    } else {
        console.error("Unknown error", e);
    }
})

bot.start();