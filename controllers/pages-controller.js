const path = require('path');
const appConstant = require('../app-constants');
const pagesUtils = require('../util/pages-util')

const fs = require('fs');
let cwdFolder = process.cwd();

function getPagesList(req, res, next){
    console.log("getPagesList called !!! >>");
    if(req.method && req.method == appConstant.METHODS.GET){
        if(cwdFolder && fs.existsSync(cwdFolder)){
            if(fs.statSync(cwdFolder).isDirectory()){
                let output = pagesUtils.getHTMLPagesInDirectory(cwdFolder, 'edit');
                res.status(200).json({data: output, status: appConstant.STATUS.OK});
            } else{
                console.error(appConstant.ERRORS.E_3000, cwdFolder);
                res.status(400).json({data:`HTML files not present`, status: appConstant.STATUS.FAILED});
            }
        }        
    } else{
        let errorMessage = appConstant.ERRORS.E_2000;
        console.error(errorMessage);
        res.status(404).json({data: `Route Not found  E_2000`});
    }
}
function updatePageContent(req, res, next){
    // console.log("REQUEST >>", req.body);
    if(req.method && 
       (req.method == appConstant.METHODS.PUT)){
        const {fileName,updatedContent} = req.body;
        let filePath = path.join(cwdFolder, fileName);
        if(fileName && updatedContent){
            fs.existsSync(filePath)
            // file exists
            if(pagesUtils.updatePageBody(filePath, updatedContent)){
                res.status(200).json({data: 'Updated content!', status: appConstant.STATUS.OK});
            } else{
                res.status(502).json({data: 'Updated content failed!', status: appConstant.STATUS.FAILED});
            }
        } else{
            console.error("Error updating page >> E_3001");
            res.status(502).json({data: appConstant.ERRORS.E_3001, status: appConstant.STATUS.FAILED});
        }
    } else{
        let errorMessage = appConstant.ERRORS.E_2000;
        console.error(errorMessage);
        res.status(404).json({data: `Route Not found  E_2000`});
    }
}
module.exports = {
    getPagesList: getPagesList,
    updatePageContent: updatePageContent
}
