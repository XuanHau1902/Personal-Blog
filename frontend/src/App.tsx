import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PostDetailPage from "./pages/PostDetailPage";
import PostEditorPage from "./pages/PostEditorPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/posts/new" element={<ProtectedRoute><PostEditorPage /></ProtectedRoute>} />
      <Route path="/posts/:id/edit" element={<ProtectedRoute><PostEditorPage /></ProtectedRoute>} />
      <Route path="/posts/:id" element={<PostDetailPage />} />
    </Routes>
  );
}

export default App;
