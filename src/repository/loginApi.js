import axios from "axios";

export default class TrackingApi {

  constructor(url) {
    this.url = url
  }

  login(username, password) {
    const apiURL = this.url + "/general/login"
    return new Promise((resolve, reject) => {
      axios
        .post(apiURL, {'username': username, 'password': password}, { timeout: 20000 })
        .then(response => {
          if (response.status === 200) {
            resolve(response);
          } else {
            reject(new Error("api-error"));
          }
        })
        .catch(response => {
          console.error("Error en loginApi - login");
          reject(new Error("server-error"));
        })
    })
  }
}
