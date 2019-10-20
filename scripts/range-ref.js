var __delRangeRef = (function(){
    function RangeRef(cb){
        this.range = undefined;
        this.rect = {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0
          };
        this.callback = cb;
    }
    RangeRef.prototype.updateRect = function(hide) {
        if (!hide && this.range) {
          this.rect = this.range.getBoundingClientRect();
        } else {
          this.rect = {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0
          };
        }
        if(this.callback && typeof(this.callback) == 'function'){
            this.callback(this.rect);
        }
    }
    Object.defineProperties(RangeRef.prototype,
        { 
            'clientHeight': {
                get(){
                    return this.rect.height
                }
            },
            'clientWidth': {
                get(){
                    return this.rect.width;
                }
            }
        }
    );
    RangeRef.prototype.getBoundingClientRect = function(){
        return this.rect;
    }
    RangeRef.prototype.setRange = function(range){
        this.range = range;
        this.updateRect();
    }
    return RangeRef;
}())