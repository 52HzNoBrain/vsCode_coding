const sleep = (timer) => {
    return new Promise(r => setTimeout(r, timer))
}

module.exports = {
    sleep
}