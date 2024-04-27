const cryptoPayClient =  require("./crypto/cryptoPayClient.js");

const askForWithdraw = async (ctx , withdrawMode) => {
    const message = await ctx.editMessageText(`Por favor, introduce la cantidad de balance que desea retirar a su cuenta de ${withdrawMode}`);
    ctx.session = { withdrawMode : withdrawMode}; 
};

const withdraw = async (ctx, api_client , withdrawMode , amountInUsd) => {
    const userId = ctx.message.from.id;
    const user = await api_client.getUserData(userId);

    if(!user) return ctx.reply("ERROR: USER_NOT_FOUND please login in our page to use this feature.");

    if(user.wallet.balance < amountInUsd) return ctx.reply("ERROR: INSUFICIENT_BALANCE.");

    if(topupMode == "PAYPAL_USD"){

    }else{
        const payment = await cryptoPayClient.withdraw(userId , withdrawMode , amountInUsd);
        if(payment.status == "success")
    }
}

module.exports = {
    askForWithdraw,
    withdraw
};