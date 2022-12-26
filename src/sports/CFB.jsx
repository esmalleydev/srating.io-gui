import React from 'react';
import { Link, Outlet } from "react-router-dom";


class CFB extends React.Component {

  constructor(props) {
    super(props);
  }
  

  render() {
    return (
      <div>
        <Outlet />
      </div>
    );
  }
}


export default CFB;
