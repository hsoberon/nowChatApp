import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/layout";
import Home from "./pages/home";
import Users from "./pages/users";
import Chat from "./pages/chat";
import Video from "./pages/video";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="users" element={<Users />} />
          <Route path="Chat" element={<Chat />} />
          <Route path="Video" element={<Video />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}