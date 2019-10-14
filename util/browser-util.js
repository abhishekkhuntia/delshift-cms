const open = require('open')
function openBrowser(url){
    if(url){
        open(url, {wait: true})
            .then(subProcess=> {
                if(subProcess && subProcess.on){
                    console.log("opened Browser >> ", subProcess.pid);
                }
            })
            .catch(err => {
                console.error('Error trigerred in browser open', err);
            });
    }
}
module.exports = {
    openBrowser: openBrowser
};