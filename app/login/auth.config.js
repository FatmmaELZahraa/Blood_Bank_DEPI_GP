// auth.config.js

export const authConfig = {
  donor: {
    endpoint: "http://localhost:5004/api/auth/login",
    redirect: {
      User: "/donor",
      Admin: "/admin",
    },
  },

 hospital: {
  endpoint: "http://localhost:5004/api/auth/login",
  redirect: {
    Hospital: "/hospital",
    Admin: "/admin",
  },
},

  admin: {
    endpoint: "http://localhost:5004/api/admin/login",
    redirect: {
      Admin: "/admin",
    },
  },
};