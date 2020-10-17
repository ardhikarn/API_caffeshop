const bcrypt = require("bcrypt");
const {
  getUser,
  getUserCount,
  postUser,
  checkUser,
  getUserById,
  patchUser,
  changeData,
  checkKey,
  getUserByEmail,
  getUserCountByEmail,
} = require("../models/model_users");
const jwt = require("jsonwebtoken");
const helper = require("../helper/helper");
const qs = require("qs");
const redis = require("redis");
const client = redis.createClient();
const nodemailer = require("nodemailer");

const getPrevLink = (page, currentQuery) => {
  if (page > 1) {
    const generatedPage = {
      page: page - 1,
    };
    const resultPrevLink = {
      ...currentQuery,
      ...generatedPage,
    };
    return qs.stringify(resultPrevLink);
  } else {
    return null;
  }
};

const getNextLink = (page, totalPage, currentQuery) => {
  if (page < totalPage) {
    const generatedPage = {
      page: page + 1,
    };
    const resultNextLink = {
      ...currentQuery,
      ...generatedPage,
    };
    return qs.stringify(resultNextLink);
  } else {
    return null;
  }
};

module.exports = {
  getAllUser: async (request, response) => {
    let { page, limit } = request.query;
    page === "" || page === undefined ? (page = 1) : (page = parseInt(page));
    limit === "" || limit === undefined
      ? (limit = 5)
      : (limit = parseInt(limit));
    let totalData = await getUserCount();
    let totalPage = Math.ceil(totalData / limit);
    let offset = page * limit - limit;
    let prevLink = getPrevLink(page, request.query);
    let nextLink = getNextLink(page, totalPage, request.query);
    const pageInfo = {
      page,
      totalPage,
      limit,
      totalData,
      prevLink: prevLink && `http://127.0.0.1:3000/users?${prevLink}`,
      nextLink: nextLink && `http://127.0.0.1:3000/users?${nextLink}`,
    };
    try {
      const result = await getUser(limit, offset);
      result.map((value) => delete value.user_password);
      // proses set data result ke dalam redis
      if (result.length >= 1) {
        const newResult = {
          result,
          pageInfo,
        };
        client.setex(
          `getUser:${JSON.stringify(request.query)}`,
          3600,
          JSON.stringify(newResult)
        );
        return helper.response(
          response,
          200,
          "Success Get Data User",
          result,
          pageInfo
        );
      } else {
        return helper.response(response, 200, "Get User Success", [], pageInfo);
      }
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  getUserById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await getUserById(id);
      if (result.length > 0) {
        return helper.response(
          response,
          200,
          `Get User id: ${id} Success`,
          result
        );
      } else {
        return helper.response(
          response,
          404,
          `User id: ${id} not found`,
          result
        );
      }
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  getUserByEmail: async (request, response) => {
    try {
      const { search } = request.query;
      const limit = 50;
      const totalData = await getUserCountByEmail(search);
      const searchResult = await getUserByEmail(search, limit);
      const result = {
        searchResult,
        totalData,
      };
      console.log(result);
      return helper.response(
        response,
        200,
        "Success Get Product By Email",
        result
      );
    } catch (error) {
      console.log(error);
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  registerUser: async (request, response) => {
    const { user_email, user_password, user_name } = request.body;
    const salt = bcrypt.genSaltSync(10);
    const encryptPassword = bcrypt.hashSync(user_password, salt);
    const addData = {
      user_email,
      user_password: encryptPassword,
      user_name,
      user_role: 2,
      user_status: 0,
      user_key: 0,
      user_created_at: new Date(),
    };
    try {
      const checkEmail = await checkUser(user_email);
      if (user_name === "") {
        return helper.response(response, 400, "Username is Required");
      } else if (checkEmail.length >= 1) {
        return helper.response(response, 400, "Email Already Used");
      } else if (user_email === "" || user_email.search("@") < 0) {
        return helper.response(response, 400, "Valid Email is Required");
      } else if (user_password.length < 8) {
        return helper.response(
          response,
          400,
          "minimum 8 character password is Required"
        );
      } else {
        const result = await postUser(addData);
        return helper.response(
          response,
          200,
          "Success Register User, Contact Admin for activation account",
          result
        );
      }
    } catch (error) {
      console.log(error)
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  loginUser: async (request, response) => {
    try {
      const { user_email, user_password } = request.body;
      const checkDataUser = await checkUser(user_email);
      if (checkDataUser.length >= 1) {
        const checkPassword = bcrypt.compareSync(
          // proses cek password
          user_password,
          checkDataUser[0].user_password
        );
        if (checkPassword) {
          // proses set JWT
          const {
            user_id,
            user_email,
            user_name,
            user_role,
            user_status,
          } = checkDataUser[0];
          let payload = {
            user_id,
            user_email,
            user_name,
            user_role,
            user_status,
          };
          if (payload.user_status === 0) {
            return helper.response(
              response,
              400,
              "Your account is not activate, contact admin for activation"
            );
          } else {
            const token = jwt.sign(payload, process.env.KEY, { expiresIn: "12h" });
            payload = { ...payload, token };
            return helper.response(response, 200, "Success Login!", payload);
          }
        } else {
          return helper.response(response, 400, "Wrong Password !");
        }
      } else {
        return helper.response(
          response,
          400,
          "Email / Account not Registered !"
        );
      }
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  patchUser: async (request, response) => {
    const { id } = request.params;
    const setData = {
      user_name: request.body.user_name,
      user_role: request.body.user_role,
      user_status: request.body.user_status,
      user_updated_at: new Date(),
    };
    // if (request.body.user_password !== undefined) {
    //   if (
    //     request.body.user_password.length < 8 ||
    //     request.body.user_password.length > 16
    //   ) {
    //     return helper.response(
    //       response,
    //       400,
    //       "Password must be 8-16 characters"
    //     );
    //   }
    //   const salt = bcrypt.genSaltSync(10);
    //   const encryptPassword = bcrypt.hashSync(request.body.user_password, salt);
    //   setData.user_password = encryptPassword;
    // }
    try {
      if (setData.user_name === "") {
        return helper.response(response, 400, "Name cannot be empty");
      } else if (setData.user_role === "") {
        return helper.response(response, 400, "Please select role");
      } else if (setData.user_status === "") {
        return helper.response(response, 400, "Please select status");
      }
      const checkId = await getUserById(id);
      if (checkId.length > 0) {
        const result = await patchUser(setData, id);
        return helper.response(response, 201, "User Updated", result);
      } else {
        return helper.response(response, 404, `User id: ${id} Not Found`);
      }
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  sendEmailForgot: async (request, response) => {
    try {
      const { user_email } = request.body;
      const key = Math.round(Math.random() * 100000);
      const checkData = await checkUser(user_email);
      if (checkData.length >= 1) {
        const data = {
          user_key: key,
          user_updated_at: new Date(),
        };
        await changeData(data, user_email);
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.USER,
            pass: process.env.PASS,
          },
        });
        await transporter.sendMail({
          from: '"Rythz-Pos"',
          to: user_email,
          subject: "Rythz-Pos - Forgot Password",
          text: "Save your Password !",
          html: `<a href="http://localhost:8080/new-password?keys=${keys}">Click Here To Change Your Password</a>`,
        }),
          function (error) {
            if (error) {
              return helper.response(response, 400, "Email not Sent !");
            }
          };
        return helper.response(response, 200, "Email has been Sent");
      } else {
        return helper.response(response, 400, "Email is not Registered");
      }
    } catch (error) {
      return helper.response(response, 400, "Bad Request");
    }
  },
  changePassword: async (request, response) => {
    try {
      const { key } = request.query;
      const { user_password } = request.body;
      const checkData = await checkKey(key);
      if (
        request.query.key === undefined ||
        request.query.key === "" ||
        request.query.key === null
      ) {
        return helper.response(response, 400, "Invalid Key");
      }
      if (checkData.length >= 1) {
        const email = checkData[0].user_email;
        let setData = {
          user_key: key,
          user_password,
          user_updated_at: new Date(),
        };
        const limit = setData.user_updated_at - checkData[0].user_updated_at;
        const timeLimit = Math.floor(limit / 1000 / 60);
        if (timeLimit > 5) {
          const resetData = {
            user_key: "",
            user_updated_at: new Date(),
          };
          await changeData(resetData, email);
          return helper.response(response, 400, "Key Expired");
        } else if (
          request.body.user_password === undefined ||
          request.body.user_password === "" ||
          request.body.user_password === null
        ) {
          return helper.response(response, 400, "Password  is Required !");
        } else if (
          request.body.confirm_password === undefined ||
          request.body.confirm_password === "" ||
          request.body.confirm_password === null
        ) {
          return helper.response(
            response,
            400,
            "Confirm Password  is Required !"
          );
        } else if (request.body.user_password.length < 8) {
          return helper.response(
            response,
            400,
            "input password minimum 8 character !"
          );
        } else if (
          request.body.user_password !== request.body.confirm_password
        ) {
          return helper.response(response, 400, "Password not match !");
        } else {
          const salt = bcrypt.genSaltSync(10);
          const encryptPass = bcrypt.hashSync(user_password, salt);
          setData.user_password = encryptPass;
          setData.user_key = "";
        }
        const result = await changeData(setData, email);
        return helper.response(
          response,
          200,
          "Success Change Password !",
          result
        );
      } else {
        return helper.response(response, 400, "Invalid key");
      }
    } catch (error) {
      return helper.response(response, 400, "Bad Request");
    }
  },
  sendEmailOrder: async (request, response) => {
    try {
      const { user_email } = request.body;
      const key = Math.round(Math.random() * 100000);
      const checkData = await checkUser(user_email);
      if (checkData.length >= 1) {
        const data = {
          user_key: key,
          user_updated_at: new Date(),
        };
        await changeData(data, user_email);
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.USER,
            pass: process.env.PASS,
          },
        });
        await transporter.sendMail({
          from: '"Rythz-Pos"',
          to: user_email,
          subject: "Rythz-Pos - Notification",
          text: "Thank You for Order :)",
          html: `INI PESANAN ANDA`,
        }),
          function (error) {
            if (error) {
              return helper.response(response, 400, "Email not Sent !");
            }
          };
        return helper.response(response, 200, "Email has been Sent");
      } else {
        return helper.response(response, 400, "Email is not Registered");
      }
    } catch (error) {
      return helper.response(response, 400, "Bad Request");
    }
  },
};
