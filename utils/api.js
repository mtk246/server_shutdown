import axios from 'axios';

export {
  getApi
};

async function getApi(apiUrl) {
    let res = '';
    await axios({
        method: "get",
        url: apiUrl,
    }).then((response) => {
        res = response;
    }).catch((error) => {
        if (error.response) {
            res = error.response;
        }
        if (error.request) {
            res = {
                status: 500,
                data: {
                    message: "Server Error",
                },
            };
        }
    });

    return res;
};