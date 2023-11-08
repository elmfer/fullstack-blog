const loginUsernameField = $('#login-username');
const loginPasswordField = $('#login-password');

const signupUsernameField = $('#signup-username');
const signupPasswordField = $('#signup-password');

async function doLogin() {
  // Disable the login button to prevent double-clicks
  $('#login-btn').attr('disabled', true);

  const username = loginUsernameField.val();
  const password = loginPasswordField.val();

  if(!username || !password){
    alert('Username and password are required!');
    // Re-enable the login button so the user can try again
    $('#login-btn').attr('disabled', false);
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
    // Re-enable the login button so the user can try again
    $('#login-btn').attr('disabled', false);
  }
}

async function doSignup() {
  // Disable the signup button to prevent double-clicks
  $('#signup-btn').attr('disabled', true);

  const username = signupUsernameField.val();
  const password = signupPasswordField.val();

  if(!username || !password){
    alert('Username and password are required!');
    // Re-enable the signup button so the user can try again
    $('#signup-btn').attr('disabled', false);
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
    // Re-enable the signup button so the user can try again
    $('#signup-btn').attr('disabled', false);
  }
}