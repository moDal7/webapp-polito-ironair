const APIURL = 'http://localhost:3000';


async function readPlanes() {
    const url = APIURL + '/planes';
    try {
        const response = await fetch(url);
        if (response.ok) {
            const list = await response.json();
            return list;
        } else {
            const text = await response.text();
            throw new TypeError(text);
        }
    } catch (ex) {
        // network error
        throw ex;
    }
}

async function readPlane(pid) {
    const url = APIURL + '/course/' + pid;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const list = await response.json();
            //console.log(list);
            return list;
        } else {
            const text = await response.text();
            throw new TypeError(text);
        }
    } catch (ex) {
        // network error
        throw ex;
    }
}

// user login and logout functions

const logIn = async (credentials) => {
    const response = await fetch(APIURL + '/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    console.log(response)
    if(response.ok) {
      const user = await response.json();
      return user;
    }
    else {
      const errDetails = await response.text();
      throw errDetails;
    }
  };
  
  const getUserInfo = async () => {
    const response = await fetch(APIURL + '/sessions/current', {
      credentials: 'include',
    });
    const user = await response.json();
    if (response.ok) {
      return user;
    } else {
      throw user;  // an object with the error coming from the server
    }
  };
  
  const logOut = async() => {
    const response = await fetch(APIURL + '/sessions/current', {
      method: 'DELETE',
      credentials: 'include'
    });
    if (response.ok)
      return null;
  }

const API = 
{   planes,
    plane,
    logIn,
    getUserInfo,
    logOut
};

export default API ;