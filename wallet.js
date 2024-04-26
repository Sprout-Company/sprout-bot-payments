const config = require("./config.js");

const askForWalletAddress = async (ctx, walletName) => {
    const message = await ctx.editMessageText(`Por favor, introduce la dirección de la billetera ${walletName}:`);
    ctx.session = { walletName: walletName }; // Guardar el nombre de la billetera en la sesión
};

const generateInlineWallets = (ctx , index) => {
    const walletButtons = config.WALLETS_ATM.map((wallet, index) => {
        return {
            text: wallet,
            callback_data: `${index}_${wallet}`
        };
    });

    ctx.reply(config.WALLETS_DESC,
        {
            reply_markup: {
                inline_keyboard: [walletButtons]
            }
        }
    );
};

module.exports = {
    askForWalletAddress,
    generateInlineWallets
}