const cheerio = require('cheerio')
const path = require('path')
const fs = require('fs');
const appConstants = require('../app-constants');
const binLink = __dirname.replace('/util', '');

function getActionButtonScriptContent(){
    let tempPath = path.join(`${binLink}/public`, appConstants.CLIENT_SCRIPTS.TEMPLATE);
    if(fs.existsSync(tempPath)){
        let fileContent = fs.readFileSync(tempPath);
        global.actionButtonScript = fileContent;
        return fileContent;
    }
    return '';
}
function getHTMLPagesInDirectory(dir, editUrlPreffix){
    // let isHtmlPresent =  recVal || false;
    let htmlRegex = /([A-Za-z\d]+)\.html$/;
    let output = [];
    if(fs.statSync(dir).isDirectory()){

      let srcFiles = fs.readdirSync(dir);
      if(srcFiles && srcFiles.length){
        for(var n=0; n < srcFiles.length; n++){
          let file = srcFiles[n];
          if(htmlRegex.test(file)){
            output.push({
                fileName: file,
                editUrl: path.join(editUrlPreffix, file),
                path: path.join(dir,file)
            });
          }
        }
      }
    } 
    return output;
}
function injectDELCMSScript(htmlContent, fileName, scriptPath){
    if(htmlContent){
        try{
            let actionButtonScript = global.actionButtonScript || getActionButtonScriptContent();
            let $ = cheerio.load(htmlContent, { decodeEntities: true });
            let head = $("head");
            let cmsbootstrap = $(`<script type="text/javascript">window.__delshift = {fileName: "${fileName}", apiBaseUrl: "${global.apiBaseUrl}"};</script>`);
            let delshiftscript = $(`<script type="text/javascript" src="${scriptPath}"></script>`);
            let actionEleScript = $(`<script type="text/x-del-cms-tmpl" id="__delshift-script">${actionButtonScript}</script>`);
            head.append(delshiftscript);
            head.append(cmsbootstrap);
            head.append(actionEleScript);
            return $.html();
        }   
        catch(err){
            return;
        }     
    }
}
function updatePageBody(filePath, bodyContent){
    try{
        let currentFileContent = fs.readFileSync(filePath),
            $ = cheerio.load(currentFileContent);
        if($){
            $("body").html(bodyContent);
            fs.writeFileSync(filePath, $.html());
            return true;
        } else{
            return false;
        }
    }
    catch(err){
        console.error("Error updating file!");
        return;
    }
}
module.exports = {
    getHTMLPagesInDirectory: getHTMLPagesInDirectory,
    injectDELCMSScript: injectDELCMSScript,
    updatePageBody: updatePageBody
}