import React from "react";
import ReactDOM from "react-dom";
import logo from "./img/01.png";

class Seach extends React.Component {
  render() {
    return (
      <div>
        Search Text
        <img src={logo} />
      </div>
    );
  }
}

ReactDOM.render(<Seach />, document.getElementById("root"));
