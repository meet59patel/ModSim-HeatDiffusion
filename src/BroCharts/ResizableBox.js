import React from "react";
import { ResizableBox as ReactResizableBox } from "react-resizable";

import "react-resizable/css/styles.css";

export default function ResizableBox({
  children,
  height = 500,
  resizable = true,
  style = {},
  className
}) {
  return (
    <div>
      {resizable ? (
        <ReactResizableBox width={'100%'} height={height}>
          <div
            style={{
              ...style,
              width: "100%",
              height: "100%"
            }}
            className={className}
          >
            {children}
          </div>
        </ReactResizableBox>
      ) : (
        <div
          style={{
            width: "100%",
            height: `${height}px`,
            ...style
          }}
          className={className}
        >
          {children}
        </div>
      )}
    </div>
  );
}