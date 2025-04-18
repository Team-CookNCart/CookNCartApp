export async function basicFetch(url, payload) {
    // console.log(`in basic fetch`)
    // console.log(`url = ${url} \n payload = ${JSON.stringify(payload)}`)
    const res = await fetch(url, payload)
    const body = await res.json()
    console.log(body)
    return body
  }


export async function signup(baseUrl, context) {
    const payload = {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(context),
    };
    try {
    // console.log(`in sign up`)
    // console.log(`baseUrl = ${baseUrl} \n payload = ${JSON.stringify(payload)}`)
//     const body = await basicFetch(`${baseUrl}/user_accounts/signup`, payload);
//     if (body.token) {
//         localStorage.setItem("token", body.token);
//         window.dispatchEvent(new Event("auth-change"));
        
//         return { success: true, token: body.token, userId: body.user_id };
//     } else {
//         return { success: false, error: body.error || "Signup failed. Please try again." };
//     }
//   } catch (error) {
//     return { success: false, error: error.message };
//  }
        const signupResponse = await basicFetch(`${baseUrl}/user_accounts/signup`, payload);
            
        if (!signupResponse.token) {
            return { success: false, error: signupResponse.error || "Signup failed" };
        }

        // Auto-login with new credentials
        const loginPayload = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: context.email,
                password: context.password
            }),
        };

        const loginResponse = await basicFetch(`${baseUrl}/user_accounts/get-token`, loginPayload);

        if (loginResponse.token) {
        // Get user ID through existing login flow
            const userResponse = await basicFetch(`${baseUrl}/user_accounts/user/single_user/`, {
                method: "GET",
                headers: {
                    "Authorization": `Token ${loginResponse.token}`,
                    "Content-Type": "application/json"
                }
            });

            // Store all auth data
            localStorage.setItem("token", loginResponse.token);
            localStorage.setItem("user_id", userResponse.id);
            window.dispatchEvent(new Event("auth-change"));

            return { 
                success: true, 
                token: loginResponse.token,
                userId: userResponse.id
            };
        }

        return { success: false, error: "Auto-login failed after signup" };

        } catch (error) {
        return { success: false, error: error.message };
}
    }


export async function login(context, baseUrl) {
    // console.log(`in login`)
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
  //const body = await basicFetch("http://127.0.0.1:8000/user_accounts/get-token", payload);
//   console.log(`baseUrl = ${baseUrl} \n payload = ${JSON.stringify(payload)}`)
  const body = await basicFetch(`${baseUrl}/user_accounts/get-token`, payload);
  
  if (body.token) {
      // Store the token in localStorage
      localStorage.setItem("token", body.token);
      window.dispatchEvent(new Event("auth-change"));
      return { success: true, token: body.token };
  } else {
      return { success: false, error: body.error || "Invalid Username or Password" };
  }
} catch (error) {
  return { error: "Network error. Please try"};
}
}

export async function saveRecipe(userId, context, baseUrl) {
    /*console.log('IN_saveRecipe')
    console.log(`userId = ${userId}`)
    console.log(`Getting token from local storage => [${localStorage.getItem('token')}]`)
    console.log(`context = ${JSON.stringify(context)}`)
    console.log(`baseUrl = [${baseUrl}]`)*/
    const payload = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(context),  
    };
    //console.log(`payload = ${JSON.stringify(payload)}`)
    //console.log(`EP= ${`${baseUrl}/saved_recipes/user/${userId}/`}`)
    try {
        const body = await basicFetch(
            //`http://127.0.0.1:8000/saved_recipes/user/${userId}/`, 
            `${baseUrl}/saved_recipes/user/${userId}/`,
            payload
        );
        if (body) {
            //console.log("Recipe saved successfully:", body);
            return { success: true, data: body };
        } else {
            console.log(`error ${body.error}`)
            return { success: false, error: body.error || "Failed to save recipe." };
        }
    } catch (error) {
        console.error("Error saving recipe:", error);
        return { success: false, error: error.message };
    }
}

export async function getRecipe(baseUrl, userId) {
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
            //`http://127.0.0.1:8000/saved_recipes/user/${userId}/`, 
            `${baseUrl}/saved_recipes/user/${userId}/`,
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

export async function deleteRecipe(baseUrl,userId, recipeId){

    const payload = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${localStorage.getItem('token')}`
        },
    };
    try {
        const body = await basicFetch(
            //`http://127.0.0.1:8000/saved_recipes/user/${userId}/recipe/${recipeId}/`,
            `${baseUrl}/saved_recipes/user/${userId}/recipe/${recipeId}/`,
            payload
        );
        if (body) {
            return { success: true, data: body };
        } else {
            return { success: false, error: body.error || "Failed to delete recipe." };
        }
    } catch (error) {
        console.error("Error deleting recipe:", error);
        return { success: false, error: error.message };
    }
}


export const logout = (setAuth) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user_id");
  setAuth(false);
  // Trigger custom event
  window.dispatchEvent(new Event("auth-change"));
}



export async function saveShoppingList(token, meals, baseUrl) {
    // console.log("IN_saveShoppingList");
    const apiUrl = `${baseUrl}/shopping_list/`;

    // console.log("Final API URL:", apiUrl);

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify({ meals }),
        });

        const data = await response.json();
        // console.log("Response Data:", data);
        return response.ok ? { success: true } : { success: false, error: data.message || "Unknown error" };
    } catch (error) {
        console.error("Error in saveShoppingList:", error);
        return { success: false, error: "Network error" };
    }
}


export async function fetchShoppingList(baseUrl) {
    const payload = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${localStorage.getItem('token')}`
        },
    };
    try {
        const body = await basicFetch(
            `${baseUrl}/shopping_list/`,
            payload
        );
        // console.log("Response Data:", body);
        if (body) {
            return { success: true, data: body };
        } else {
            return { success: false, error: body.error || "Failed to get list." };
        }
    } catch (error) {
        console.error("Error getting list:", error);
        return { success: false, error: error.message };
    }
}



export const deleteShoppingListItem = async (base_url, itemId) => {
    const url = `${base_url}/shopping_list/${itemId}`;
    // console.log("URL:", url);

    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${localStorage.getItem('token')}`
            },
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || "Error deleting item.");
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error("Error deleting shopping list item:", error);
        return { success: false, error: error.message || "Failed to delete item." };
    }
};


export const updateShoppingListItem = async (base_url, itemId, updatedQty) => {
    const url = `${base_url}/shopping_list/${itemId}`;
    // console.log("URL:", url);

    try {
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                qty: updatedQty
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || "Error updating item.");
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error("Error updating shopping list item:", error);
        return { success: false, error: error.message || "Failed to update item." };
    }
};


export async function postEmail(token, baseUrl) {

    if (!token) {
        token = localStorage.getItem('token');
        if (!token) {
            return { success: false, error: "No token found" };
        }
    }

    const apiUrl = `${baseUrl}/shopping_list/send-email/`;

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
        });

        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            return response.ok ? { success: true } : { success: false, error: data.message || "Unknown error" };
        } else {
            const errorText = await response.text();
            return { success: false, error: "Unexpected response format" };
        }
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}

export const clearShoppingList = async (base_url) => {
    const url = `${base_url}/shopping_list/`;

    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${localStorage.getItem('token')}`
            },
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || "Error clearing list.");
        }

        return { success: true };
    } catch (error) {
        console.error("Error clearing shopping list:", error);
        return { success: false, error: error.message || "Failed to clear list." };
    }
};
