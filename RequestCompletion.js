const axios = require('axios');
const vscode = require('vscode')

const myAxios = axios.create({
    itmeout:60000
})

//Interceptors for the request
myAxios.interceptors.request.use(config => {
    // Do something before request is sent
    return config;
    },error => {
    // Do something with request error
    return Promise.reject(error);
});

//Interceptors for the response
myAxios.interceptors.response.use(response => {
    // Do something before response is sent
    return response;
    },error => {
    // Do something with response error
    return Promise.reject(error);
});

//send the HttpRequest
async function postCompletion(fimPrefixCode, fimSuffixCode){
    //get serverAddress at config
    const serverAddress = vscode.workspace.getConfiguration('aia').get('serverAddress');
    //get authorization at config
    const authorization = vscode.workspace.getConfiguration('aia').get('authorization');
    //get completionMaxTokens at config
    const completionMaxTokens = vscode.workspace.getConfiguration('aia').get('CompletionMaxTokens')
    //Encapsulation the Request Body
    let data = {
        "inputs":fimPrefixCode + '\n' + fimSuffixCode,
        "parameters":{
            "max_new_tokens":completionMaxTokens,
            "truncate":4000,
            "top_p":0.7,
            "temperature":0.2,
            "stop":["<|endoftext|>","</s>"],
            "seed":22
        }
    }
    const response = await myAxios.post(serverAddress, data, {
        headers:{
            authorization
        }
    });
    return response.data.generated_text
}

module.exports = {
    postCompletion
}
