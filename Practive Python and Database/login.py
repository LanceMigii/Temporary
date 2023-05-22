<!DOCTYPE html>
<html>
<head>
  <title>User Login</title>
</head>
<body>
  <h1>User Login</h1>
  <form action="/login" method="post" onsubmit="redirectToApi()">
    <label for="username">Username:</label>
    <input type="text" name="username" id="username" required><br><br>
    <label for="password">Password:</label>
    <input type="password" name="password" id="password" required><br><br>
    <input type="submit" value="Login">
  </form>
  <br>
  <p>Don't have an account? <a href="/registration">Register</a></p>
  <script>
    function redirectToApi() {
      window.location.href = '/api-page.html';
    }
  </script>  
</body>
</html>
