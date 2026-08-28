import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Avatar from "../Avatar/Avatar";
import { LogOut } from "lucide-react";

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    navigate("/login");
  }

  return (
    <div className="mb-6 flex items-center justify-end gap-3">
      <Avatar name={user?.name ?? user?.email ?? "?"} />
      <div className="text-right">
        <p className="text-sm font-medium text-slate-900">{user?.name ?? user?.email}</p>
        <p className="text-xs text-slate-500">{user?.role === "TEACHER" ? "Professor" : "Aluno"}</p>
      </div>
    <button
  onClick={handleSignOut}
  className="ml-2 flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
>
  <LogOut size={16} />
  Sair
</button>
    </div>
  );
}

export default Header;