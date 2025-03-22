export async function basicFetch(url, payload) {
    const res = await fetch(url, payload)
    const body = await res.json()
    return body
  }


export async function signup(context) {
const payload = {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify(context)
}
  try {
    const body = await basicFetch("http://127.0.0.1:8000/user_accounts/signup", payload);
    if (body.token) {
        localStorage.setItem("token", body.token);
        return { success: true, token: body.token };
    } else {
        return { success: false, error: body.error || "Signup failed. Please try again." };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}


export async function login(context) {
const payload = {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: context.email,
      password: context.password,
    }),
};
try {
  const body = await basicFetch("http://127.0.0.1:8000/user_accounts/get-token", payload);
  if (body.token) {
      // Store the token in localStorage
      localStorage.setItem("token", body.token);
      return { success: true, token: body.token };
  } else {
      return { success: false, error: body.error || "Login failed. Invalid token." };
  }
} catch (error) {
  return { success: false, error: error.message };
}
}

export async function saveRecipe(userId, context) {
    /*console.log('IN_saveRecipe')
    console.log(`userId = ${userId}`)
    console.log(`Getting token from local storage => [${localStorage.getItem('token')}]`)
    console.log(`context = ${JSON.stringify(context)}`)*/
    const payload = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(context),  
    };
    //console.log(`payload = ${JSON.stringify(payload)}`)
    try {
        const body = await basicFetch(
            `http://127.0.0.1:8000/saved_recipes/user/${userId}/`, 
            payload
        );
        if (body) {
            //console.log("Recipe saved successfully:", body);
            return { success: true, data: body };
        } else {
            return { success: false, error: body.error || "Failed to save recipe." };
        }
    } catch (error) {
        console.error("Error saving recipe:", error);
        return { success: false, error: error.message };
    }
}

export async function getRecipe(userId) {
    //console.log('IN_getRecipe')
    //console.log(`userId = ${userId}`)
    //console.log(`Getting token from local storage => [${localStorage.getItem('token')}]`)
  
    const payload = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${localStorage.getItem('token')}`
        },
    };
    //console.log(`payload = ${JSON.stringify(payload)}`)
    try {
        const body = await basicFetch(
            `http://127.0.0.1:8000/saved_recipes/user/${userId}/`, 
            payload
        );
        if (body) {
            return { success: true, data: body };
        } else {
            return { success: false, error: body.error || "Failed to get recipe." };
        }
    } catch (error) {
        console.error("Error getting recipe:", error);
        return { success: false, error: error.message };
    }
}

