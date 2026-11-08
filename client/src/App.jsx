import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import MyGroups from './pages/MyGroups.jsx';
import GroupPage from './pages/GroupPage.jsx';
import AddExpense from './pages/AddExpense.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/groups" element={<MyGroups />} />
        <Route path="/groups/:groupId" element={<GroupPage />} />
        <Route path="/groups/:groupId/expenses/new" element={<AddExpense />} />
      </Route>

      <Route path="*" element={<Navigate to="/groups" replace />} />
    </Routes>
  );
}
