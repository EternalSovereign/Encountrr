import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 shadow sticky top-0 z-50 text-white">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold hover:text-gray-100">
                    Companion Matcher
                </Link>

                {/* Hamburger for mobile */}
                <button
                    className="sm:hidden text-white focus:outline-none"
                    onClick={toggleMenu}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop Menu */}
                <div className="hidden sm:flex items-center gap-4">
                    <NavLinks
                        isAuthenticated={isAuthenticated}
                        onLogout={handleLogout}
                    />
                </div>
            </div>

            {/* Mobile Slide Down Menu */}
            <div
                className={`sm:hidden transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="flex flex-col gap-2 px-4 pt-2 pb-4 bg-blue-600">
                    <NavLinks
                        isAuthenticated={isAuthenticated}
                        onLogout={() => {
                            handleLogout();
                            setIsOpen(false);
                        }}
                        onClickLink={() => setIsOpen(false)}
                    />
                </div>
            </div>
        </nav>
    );
}

function NavLinks({ isAuthenticated, onLogout, onClickLink = () => {} }) {
    return (
        <>
            <Link to="/" onClick={onClickLink} className="hover:underline">
                Home
            </Link>

            {isAuthenticated && (
                <>
                    <Link
                        to="/matches"
                        onClick={onClickLink}
                        className="hover:underline"
                    >
                        Matches
                    </Link>
                    <Link
                        to="/profile"
                        onClick={onClickLink}
                        className="hover:underline"
                    >
                        Profile
                    </Link>
                </>
            )}

            {!isAuthenticated ? (
                <>
                    <Link
                        to="/login"
                        onClick={onClickLink}
                        className="hover:underline"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        onClick={onClickLink}
                        className="hover:underline"
                    >
                        Register
                    </Link>
                </>
            ) : (
                <button
                    onClick={onLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                    Logout
                </button>
            )}
        </>
    );
}
