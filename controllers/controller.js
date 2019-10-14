const pageController = require('./pages-controller');
const ROUTES = {
    'getPagesList': pageController.getPagesList,
    'updatePageContent': pageController.updatePageContent
}
function apiHandler(req, res, next){
    console.log("API handler got called >> ", req.params, req.method);
    let requestPath = req.params[0];
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