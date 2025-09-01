// Polyfill for Object.groupBy (ES2024 feature)
if (!Object.groupBy) {
  Object.groupBy = function(items, callbackFn) {
    const groups = {};
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const key = callbackFn(item, i);
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    }
    
    return groups;
  };
}

// Polyfill for Map.groupBy (ES2024 feature)
if (!Map.groupBy) {
  Map.groupBy = function(items, callbackFn) {
    const groups = new Map();
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const key = callbackFn(item, i);
      
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(item);
    }
    
    return groups;
  };
}
