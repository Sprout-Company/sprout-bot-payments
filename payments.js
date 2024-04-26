let config =  require("./config.js");
let lang = null;
const {generateInlineWallets , askForWalletAddress} = require("./wallets.js");

const langD = (name) => {
    if(!lang[name] && !config[name]) return "<???>";
    return lang[name] ? lang[name] : config[name];
}

const payments = async (bot , api_client ,  _lang = null ) => {
if (_lang) lang = _lang;
    bot.on(langD(MAIN_MENU_NAME), async (ctx) => {
        const userId = ctx.message.from.id;
        const message = ctx.message.text;
        const userData = await api_client.getUserData(userId);
        //mostrar balance bla bla bla
        ctx.reply(langD(MAIN_MENU_DESC),
            {
                reply_markup: {
                    keyboard: [
                        [langD(TOP_UP_NAME)],
                        [langD(WITHDRAW_NAME)],
                        [langD(WALLETS_NAME)]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            }
        );

        switch (message) {
            case langD("TOP_UP_NAME"):
                generateInlineWallets(ctx , "topup");
                break;
            case langD("WITHDRAW_NAME"):
                
                break;
            case langD("WALLETS_NAME"):
                generateInlineWallets(ctx , "wallet");
                break;
            default:
                ctx.reply(langD("?"));
                break;
        }
    });

    bot.on('callback_query', (ctx) => {
        const query = ctx.callbackQuery.data;
        if (query.startsWith('wallet_')) {
            const wallet = query.slice(7);
        
            ctx.reply(`Seleccionaste la billetera: ${wallet}`);
            askForWalletAddress(ctx, wallet);
        }
    });

    bot.on('message', async (ctx) => {
        const walletName = ctx.session.walletName;
        const userId = ctx.message.from.id;
        if (walletName && ctx.message.text) {
            const walletAddress = ctx.message.text;
            const changeWallet = await api_client.changeWallet(userId , walletName , walletAddress);
            
            if(changeWallet.status == "SUCCESS") ctx.reply(`Dirección de la billetera ${walletName} guardada con éxito`);
            else ctx.reply(`ERROR  ${walletName} : ${changeWallet.message}`);
            ctx.session = {}; 
        }
    });
    
}


module.exports = payments;
