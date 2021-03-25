import axios from "axios";

export default class DashboardApi {

  constructor(url, token) {
    this.url = url
    this.token = token
  }

  summaryMonth(year, month) {
    const apiURL = this.url + "/dashboard/report/summary/month"
    return new Promise((resolve, reject) => {
      axios.defaults.headers.common["Authorization"] = "bearer " + this.token
      axios
        .post(apiURL, {'year': year, 'month': month}, { timeout: 20000 })
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

  vehiclesState() {
    const apiURL = this.url + "/dashboard/vehicles/state"
    return new Promise((resolve, reject) => {
      axios.defaults.headers.common["Authorization"] = "bearer " + this.token
      axios
        .get(apiURL, {}, { timeout: 20000 })
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
