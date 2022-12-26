import React from 'react';
import { Outlet, Link } from "react-router-dom";


const Home = (props) => {
  return (
    <div>
       <nav>
          <Link to='/CFB/Games'>CFB</Link> |{" "}
          <Link to='/CBB/Games'>CBB</Link>
        </nav>
        <Outlet />
    </div>
  );
}

export default Home;
