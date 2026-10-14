const { createClient } = supabase;

const supabaseURL='https://xwbitrmhxhqiczyplzfk.supabase.co';
const supabaseKey='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Yml0cm1oeGhxaWN6eXBsemZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExNzM1MTIsImV4cCI6MjEwNjc0OTUxMn0.mxsYxznrdK2J7Nf1M49pSiOlD1bmCEVLI0GghQlKz8o';

const supabaseclient = createClient(
    supabaseURL,
    supabaseKey
);

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        message.textContent = "Please enter email and password.";
        message.style.color = "red";
        return;
    }

    try {
        const { data, error } =
            await supabaseclient.auth.signInWithPassword({
                email: email,
                password: password
            });

        if (error) {
            console.error("Login error:", error.message);

            message.textContent = error.message;
            message.style.color = "red";
            return;
        }

        console.log("Logged-in user ID:", data.user.id);

        message.textContent = "Login successful!";
        message.style.color = "green";

        window.location.href = "index.html";

    } catch (err) {
        console.error("Unexpected error:", err);
        message.textContent = "Something went wrong. Try again.";
        message.style.color = "red";
    }
});