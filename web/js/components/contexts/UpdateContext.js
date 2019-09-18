import React from "react";
export default React.createContext({
    dataMap: [],
    updatedObject: (object) => {},
    focusedObject: (object) =>{},
    saveCanvas: (object) => {},
    addNewObjectFromSidebar: (object) => {}
});