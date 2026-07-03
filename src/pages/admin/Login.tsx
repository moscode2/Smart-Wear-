import { useState, FormEvent } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { Lock, Mail, Loader, ShieldAlert } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function Login() {
  const { session, loading, signIn } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && session) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: signInError } = await signIn(email, password);
    setSubmitting(false);
    if (signInError) {
      setError(
        signInError.toLowerCase().includes("invalid")
          ? "Incorrect email or password."
          : signInError
      );
      return;
    }
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-plum-800 via-plum-700 to-rosegold-700 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-plum-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-7 w-7 text-plum-700" />
          </div>
          <h1 className="text-2xl font-display font-bold text-ink">Admin Sign In</h1>
          <p className="text-gray-500 text-sm mt-1">Smart Wear Collection management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@smartwear.co.ke"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-plum-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-plum-500 focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              <ShieldAlert className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-3 bg-plum-700 text-white rounded-lg font-semibold hover:bg-plum-800 transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/" className="hover:text-plum-700">&larr; Back to shop</Link>
        </p>
      </div>
    </div>
  );
}
