export default {
  obj: {
    backendApi: {
      url: 'https://afternoon-falls-25894.herokuapp.com/',
      defaultHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      loginPage: {
        login: {
          action: 'signin',
          method: 'POST',
        },
        register: {
          action: 'users',
          method: 'POST',
        },
      },
      startPage: {

      },
      gamePage: {

      },
      general: {
        statistics: {
          load: {
            action: 'users/$id/statistics',
            method: 'GET',
            headers: {
              Authorization: 'Bearer $token',
            },
          },
          save: {
            action: 'users/$id/statistics',
            method: 'PUT',
            headers: {
              Authorization: 'Bearer $token',
            },
          },
          // action: 'user/$id/statistics',
          // method: 'GET',
          // headers: {
          //   'Authorization': 'Bearer $token',
          // },
        },

      },
    },
  },
};
