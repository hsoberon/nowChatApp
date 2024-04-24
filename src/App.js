import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/layout";
import Home from "./pages/home";
import Users from "./pages/users";
import WSUsers from "./pages/ws_users";
import Chat from "./pages/chat";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="users" element={<Users />} />
          <Route path="wsusers" element={<WSUsers />} />
          <Route path="Chat" element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}