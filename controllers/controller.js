const pageController = require('./pages-controller');
const browserController = require('./browser-controller');
const fs = require('fs');
const ROUTES = {
    'getPagesList': pageController.getPagesList,
    'updatePageContent': pageController.updatePageContent,
    'release-window': browserController.releaseBrowser,
    'directory-map': pageController.getDirectoryMap
}
function apiHandler(req, res, next){
    let requestPath = req.params[0];
    console.log("API -> ", requestPath);
    let routeObj = getRoutesMatchingHandler(requestPath, ROUTES);
    if(routeObj && typeof(routeObj.handler) == 'function'){
        routeObj.handler(req, res, next);
    } else{
        res.status(404).json({status: 'FAILED', data: 'Route not found!'});
    }
}
function getRoutesMatchingHandler(route, routes){
    let routeObj={};
    if(routes && route){
        if(routes[route]){ // perfect match
            routeObj.handler = routes[route];
        } else{
        }
    }
    return routeObj;
}
module.exports= {
    apiHandler: apiHandler
}