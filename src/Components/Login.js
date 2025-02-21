import { useState } from "react";
import { loginUser } from "../Firebase";
import Logo from '../Assets/Logo.svg';

/**
 * Login component for user authentication.
 * @param {Object} props - The component props.
 * @param {Function} props.onLogin - Function to handle successful login.
 * @returns {JSX.Element} The rendered login component.
 */
export default function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    /**
     * Handles the login form submission.
     * @param {Event} e - The form submission event.
     * @returns {Promise<void>}
     */
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const user = await loginUser(email, password);
            onLogin(user);
            setError("");
        } catch (err) {
            setError("Wrong email or password");
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin}>
                <div className='login-header'>
                    <h1>investify</h1>
                    <img src={Logo} alt="Logo"></img>
                </div>
                {error && <span className="text-danger" style={{ display: "block" }}>{error}</span>}
                <div className='login-inputs-container'>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Heslo"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="submit-btn">Přihlásit se</button>
                </div>
                <p className="copyright">&copy; 2025 Tomáš Ulman</p>
            </form>
        </div>
    );
}

