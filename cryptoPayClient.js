const https = require('https');

let host = 'localhost'; // Host por defecto

hostConfig = (newHost) => {
    host = newHost;
}

// Función genérica para realizar solicitudes a el servidor
const requestServerAPI = async (path, postData) => {
    return new Promise((resolve, reject) => {
        const data = querystring.stringify(postData);
        const options = {
            hostname: host, 
            port: 443,
            path: '/payments/crypto/' + path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length,
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                resolve({ statusCode: res.statusCode, data: responseData });
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
};

// Función para comprar SproutCoins
const buySproutCoins = async (id, sourceAmount, currency) => {
    const postData = {
        id,
        sourceAmount,
        currency
    };

    return await requestServerAPI('buysc', postData);
};

// Función para obtener la tasa de cambio
const getExchangeRate = async (currency) => {
    const postData = {
        currency
    };

    return await requestServerAPI('exchange_rate', postData);
};

// Función para realizar un retiro
const withdraw = async (id, currency, amount) => {
    const postData = {
        id: id,
        currency,
        amount
    };

    return await requestServerAPI('withdraw', postData);
};

module.exports = {
    buySproutCoins,
    getExchangeRate,
    withdraw
};
