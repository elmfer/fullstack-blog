const loginUsernameField = $('#login-username');
const loginPasswordField = $('#login-password');

const signupUsernameField = $('#signup-username');
const signupPasswordField = $('#signup-password');

async function doLogin() {
  const username = loginUsernameField.val();
  const password = loginPasswordField.val();

  if(!username || !password){
    alert('Username and password are required!');
    return;
  }

  const response = await fetch('/api/users/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers: { 'Content-Type': 'application/json' }
  });

  if(response.ok){
    await sleep(500);

    document.location.assign('/');
  } else {
    alert(`Failed to log in!`);
  }
}

async function doSignup() {
  const username = signupUsernameField.val();
  const password = signupPasswordField.val();

  if(!username || !password){
    alert('Username and password are required!');
    return;
  }

  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers: { 'Content-Type': 'application/json' }
  });

  if(response.ok){
    await sleep(500);

    document.location.assign('/');
  } else {
    alert(`Failed to sign up!`);
  }
}