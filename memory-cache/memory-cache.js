module.exports=(function(){
    let memoryObject = {};
    function memoryManagement(initialVal){
        memoryObject = initialVal || {};
    }
    memoryManagement.prototype.setValue = (key, value)=>{
        if(key && value){
            memoryObject[key] = value;
        }
    }
    memoryManagement.prototype.getValue = (key)=> {
        return memoryObject[key];
    }
    memoryManagement.prototype.freeMemByKey = (key)=> {
        delete memoryObject[key];
    }
    return memoryManagement;
}());