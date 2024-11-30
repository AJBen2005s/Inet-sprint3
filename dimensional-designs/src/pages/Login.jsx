import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';

export default function Login() {
  const apiUrl = "http://localhost:3000/users/login"; // Backend API URL

  const { register, handleSubmit, formState: { errors } } = useForm();

  // Handle login submission
  async function loginUser(data) {
    console.log(data); // Log data to check if it's correct

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Send as JSON
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
        credentials: 'include', // Include session cookies
      });

      if (response.ok) {
        alert("Login successful!");
        window.location.href = '/'; // Redirect to dashboard on successful login
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Login failed.'}`); // Better error handling
      }
    } catch (error) {
      alert(`Request failed: ${error.message}`);
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 60px)' }}>
      <div className="w-100" style={{ maxWidth: '500px'}}>
        <h1 className="text-center mb-4">Login</h1>
        <form onSubmit={handleSubmit(loginUser)} method="post">
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              {...register("email", {
                required: "Email is required.",
                validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Invalid email address."
              })}
              type="email"
              className="form-control bg-light"
              placeholder="johndoe@example.com"
            />
            {errors.email && <span className="text-danger">{errors.email.message}</span>}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              {...register("password", {
                required: "Password is required.",
                minLength: { value: 8, message: "Password must be at least 8 characters long." },
                pattern: {
                  value: /(?=.*[A-Z])(?=.*\d)/,
                  message: "Password must contain at least one uppercase letter and one digit."
                }
              })}
              type="password"
              className="form-control bg-light"
              placeholder="Enter your password"
            />
            {errors.password && <span className="text-danger">{errors.password.message}</span>}
          </div>

          <button type="submit" className="btn btn-primary w-100">Login</button>
          <Link to="/signup" className="btn btn-outline-secondary w-100 mt-2">Don't have an account? Sign Up</Link>
        </form>
      </div>
    </div>
  );
}
