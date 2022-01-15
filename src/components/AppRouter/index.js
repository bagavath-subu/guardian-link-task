import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import NavBar from "../NavBar";
import Dashboard from "../../pages/Dashboard";
import UserListing from "../../pages/UserListing";
import PostListing from "../../pages/PostListing";
import TodoListing from "../../pages/TodoListing";

function AppRouter() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route index element={<UserListing />} />
          <Route path="dashboard/:userId" element={<Dashboard />} />
          <Route path="posts/:userId" element={<PostListing />} />
          <Route path="todos/:userId" element={<TodoListing />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

export default AppRouter;
