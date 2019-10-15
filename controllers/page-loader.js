const appConstant = require('../app-constants')
const pagesUtil = require('../util/pages-util')
const path = require('path')

const cwd = process.cwd();
const fs = require('fs')
const HTMLREGEX = /([A-Za-z\d]+)\.html$/
function pageLoader(req, res){
    let fileName = req.params[0],
        cache = req.app.get('pageCache');
    if(fileName && 
       (req.method == appConstant.METHODS.GET)){
        let fileUrl = path.join(process.cwd(), fileName);
        if(HTMLREGEX.test(fileName)){
            console.log("Need to process the html file");
            try{
                console.log("HTML file location >> ", fileUrl);
                res.set('Content-Type', 'text/html');
                if(fs.existsSync(fileUrl)){
                    let htmlContent = fs.readFileSync(fileUrl)
                    if(htmlContent){
                        cache.setValue(fileName, Date.now());
                        let delshiftLoaderScript = `${req.protocol}://${req.hostname}:${req.app.get('PORT')}/__delshift/main-script.js`;
                        let procesedHtml = pagesUtil.injectDELCMSScript(htmlContent, fileName, delshiftLoaderScript);
                        if(procesedHtml){
                            res.send(procesedHtml);
                        } else{
                            res.sendFile(path.join(req.appPublicPath, 'error.html'));
                        }
                    }else{
                        res.sendFile(path.join(req.appPublicPath, 'error.html'));
                    }
                }else{
                    res.sendFile(path.join(req.appPublicPath, 'error.html'));
                }
            } catch(error){
                console.error("Error while processing the html file");
                process.exit(0);
            }            
            
        } else if(fs.existsSync(fileUrl)){
            res.sendFile(path.join(cwd, fileName))
        } else{
            res.sendFile(path.join(req.appPublicPath, 'error.html'));
        }
    } else{
        console.error(appConstant.ERRORS.E_2000);
        res.status(400).json({data: 'Missing parameters or Request method wrong.'});
    }
}
module.exports = pageLoader;