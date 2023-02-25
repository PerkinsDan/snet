const LogIn = () => {
  return (
    <div>
      LogIn
      <form action="/api/auth/logIn" method="post">
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" required />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" required />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default LogIn;
