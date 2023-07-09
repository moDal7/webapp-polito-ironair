const APIURL = 'http://localhost:3000';


async function readPlanes() {
    const url = APIURL + '/api/planes/';
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
    const url = APIURL + '/api/planes/' + pid;
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

async function getOccupiedSeats(pid) {
    pid = pid[0];
    const url = APIURL + '/api/planes/' + pid + '/seats';
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

const getReservationByUser = async (uid) => {
    const url = APIURL + '/api/reservations/user/' + uid;
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

const addReservation = async (reservation) => {
    const url = APIURL + '/api/reservations/';
    try {

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(reservation),
        });
        if (response.ok) {
            const list = await response.json();
            return list;
        } else if (response.status === 422) {
            const seats_err = await response.json();
            return seats_err;
        } else {
            const text = await response.text();
            throw new TypeError(text);
        }
    } catch (ex) {
        // network error
        throw ex;
    }
}

const deleteReservation = async (rid) => {
    const url = APIURL + '/api/reservations/' + rid;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok) {
            const code= await response.json();
            return code;
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
    const response = await fetch(APIURL + '/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    if(response.ok) {
      const user = await response.json();
      return user;
    }
    else {
      const errDetails = await response.text();
      return errDetails;
    }
  };
  
  const logOut = async() => {
    const response = await fetch(APIURL + '/api/sessions/current', {
      method: 'DELETE',
      credentials: 'include'
    });
    if (response.ok)
      return null;
  }

  const getUserInfo = async () => {
    const response = await fetch(APIURL + '/api/sessions/current', {
      credentials: 'include',
    });
    const user = await response.json();
    if (response.ok) {
      return user;
    } else {
      throw user;  // an object with the error coming from the server
    }
  };

const API = 
{
    readPlanes,
    readPlane,
    getOccupiedSeats,
    getReservationByUser,
    addReservation,
    deleteReservation,
    logIn,
    getUserInfo,
    logOut
};

export default API ;