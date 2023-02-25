const SignUp = () => {
  return (
    <div>
      SignUp
      <form action="/api/auth/signUp" method="post">
        <label htmlFor="firstName">First Name</label>
        <input type="text" name="firstName" id="firstName" required />
        <label htmlFor="lastName">Last Name</label>
        <input type="text" name="lastName" id="lastName" required />
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" required />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" required />
        <label htmlFor="password2">Re-enter Password</label>
        <input type="password" name="password2" id="password2" required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
