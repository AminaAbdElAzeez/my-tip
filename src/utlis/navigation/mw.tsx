import React, { ReactNode } from "react";
function processFuncArray(Component, funcs, callback) {
  let index = 0;
  // debugger
  function next(Comp: any) {
    index++;
    if (index < funcs.length) {
      return funcs[index](Component, next);
    } else {
      return callback(Comp);
    }
  }
  return funcs[index](Component, next);
}

export default function Middleware(Component, arrs) {
  // console.log("component name")
  const newComponent = {
    [Component.name]: (props) => {
      const Data = processFuncArray(Component, arrs, (C) => C);
      const Placeholder = () => (
        <h1>You should return component or next function</h1>
      );
      return Data ? <Data {...props} /> : <Placeholder />;
    },
  };
  return newComponent[Component.name];
}
