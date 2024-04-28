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
        if(payment.status == "success"){
            ctx.reply(`Retiro exitoso:
            ID de la transaccion : ${payment.transaction_id}
            Monto: ${payment.amount}
            Metodo: ${payment.currency}
            Direccion: ${payment.address}
            Fecha: ${payment.timestamp}
            "${payment.message}`);
        }else if(payment.status == "pending"){
            ctx.reply(`El pago sera acreditado en breve.
            ${payment.message}`);
        }else if(payment.status == "failed"){
            ctx.reply(`El pago fallo ,revise si tiene fondos suficientes o si su billetera tiene la direccion correcta.
            ${payment.message}`);
        }
    }
}

module.exports = {
    askForWithdraw,
    withdraw
};