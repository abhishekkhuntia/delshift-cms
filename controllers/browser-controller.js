const appConstant = require('../app-constants');
function releaseBrowser(req, res){
    if(req && req.method == appConstant.METHODS.POST){
        const app = req.app;
        let cache = app.get('pageCache');
        if(cache){
            const {fileName} = req.body;
            if(fileName && cache.getValue(fileName)){
                cache.freeMemByKey(fileName);
                res.status(200).json({data: 'File removed of watch list', status: appConstant.STATUS.OK});
            } else{
                res.status(500).json({data:'Cache Service Unavailable', status: appConstant.STATUS.FAILED})    
            }
        } else{
            res.status(500).json({data:'Cache Service Unavailable', status: appConstant.STATUS.FAILED})
        }
    }
}
module.exports = {
    releaseBrowser
}