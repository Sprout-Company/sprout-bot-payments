const cryptoPayClient =  require("./crypto/cryptoPayClient.js");

const askForBuySc = async (ctx , topupMode) => {
    const message = await ctx.editMessageText(`Por favor, introduce la cantidad de sproutcoins que desea adquirir. La tasa de cambios actual es de 1spc = 0.01usd`);
    ctx.session = { topupMode : topupMode}; 
};

const topup = async (ctx, topupMode , amountInUsd) => {
    const userId = ctx.message.from.id;

    if(topupMode == "PAYPAL_USD"){

    }else{
        const invoice = await cryptoPayClient.buySproutCoins(userId , amountInUsd , topupMode);
        if(invoice.status == "success"){
            await ctx.reply(`Para recargar sus SproutCoins x${amountInUsd *100} debe enviar exactamente ${invoice.data.amount} ${invoice.data.currency} a la siguiente direccion:
            Direccion: *${invoice.data.payment_address}* 
            o puede escanear el siguiente QR.
            ID de Orden: *${invoice.data.invoice_id}*
            Envie en menos de 10 minutos o su boleta cerrara y los fondos enviados no seran acreditados.` , {
                parse_mode: 'Markdown'
            });

            try {
                const imageUrl = invoice.data.qr_code;
                await ctx.replyWithPhoto({ url: imageUrl });
        
            } catch (error) {
                await ctx.reply('ERROR QR: ' + error);
            }
        }
    }
}

module.exports = {
    askForBuySc,
    topup
};