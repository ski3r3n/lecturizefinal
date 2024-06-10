## How to use
Do something like this (this is a formhandler)
```
  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, password: password }),
    });

    if (response.ok) {
      alert("Success!")
    } else {
      alert('Invalid credentials');
    }
  };
```