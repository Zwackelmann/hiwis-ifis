$.fn.weld = function(data, alias, config) {
    if(typeof(config) === 'undefined') config = {};
    if(typeof(alias) !== 'undefined' && alias != {}) config.alias = {};
    
    for(entry in alias) {
    
        config.alias[entry] = function(parent, element, key, value) {
            return $(parent).find(alias[key])[0];
        };
    };
    
    return this.each (function() {
        weld(this, data, config);
    });
};

