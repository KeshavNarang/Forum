let posts = [];
let users = [];
let currentUser = null;

// Function to load user data from the JSON file
function loadUserData() {
    fetch('users.json')
        .then((response) => response.json())
        .then((data) => {
            users = data;
        })
        .catch((error) => {
            console.error('Error loading user data:', error);
        });
}

// Function to save user data to the JSON file
function saveUserData() {
    fetch('users.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(users),
    })
        .then(() => {
            console.log('User data saved to file successfully.');
        })
        .catch((error) => {
            console.error('Error saving user data:', error);
        });
}

// Function to perform user authentication
function authenticate(username, password) {
    const user = users.find((user) => user.username === username && user.password === password);
    if (user) {
        currentUser = user;
        return true;
    }
    return false;
}

// Function to create a new user account
function createUser(username, password, name, contact) {
    const userExists = users.some((user) => user.username === username);
    if (!userExists) {
        const newUser = {
            username,
            password,
            name,
            contact
        };
        users.push(newUser);
        currentUser = newUser;
        saveUserData();
        return true;
    }
    return false;
}

// Function to display posts
function displayPosts() {
    fetch('posts.json')
        .then((response) => response.json())
        .then((data) => {
            posts = data;
            const postList = document.getElementById('post-list');
            postList.innerHTML = '';

            for (let i = 0; i < posts.length; i++) {
                const post = posts[i];
                const postElement = document.createElement('div');
                postElement.className = 'post';
                postElement.innerHTML = `<p>${post.content}</p>`;
                postList.appendChild(postElement);
            }
        })
        .catch((error) => {
            console.error('Error loading posts:', error);
        });
}

// Initialize the forum
function initialize() {
    loadUserData();
    document.getElementById('auth-form').addEventListener('submit', handleSignIn);
    document.getElementById('signup-form').addEventListener('submit', handleSignUp);
    displayPosts();
}

// Function to handle sign-in
function handleSignIn(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (authenticate(username, password)) {
        displayPosts();
        document.getElementById('post-content').disabled = false;
    } else {
        alert('Invalid username or password. Please try again.');
    }
}

// Function to handle sign-up
function handleSignUp(event) {
    event.preventDefault();

    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    const name = document.getElementById('name').value;
    const contact = document.getElementById('contact').value;

    if (createUser(username, password, name, contact)) {
        displayPosts();
        document.getElementById('post-content').disabled = false;
        alert('Account created successfully!');
    } else {
        alert('Username already exists. Please choose a different username.');
    }
}

// Initialize the forum when the page loads
initialize();