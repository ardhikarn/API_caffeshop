const bcrypt = require("bcrypt");
const {
  getUser,
  getUserCount,
  postUser,
  checkUser,
  getUserById,
  patchUser,
} = require("../models/model_users");
const jwt = require("jsonwebtoken");
const helper = require("../helper/helper");
const qs = require("qs");
const redis = require("redis");
const client = redis.createClient();

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
    let { page, limit, search, sort, ascDesc } = request.query;
    page === "" || page === undefined ? (page = 1) : (page = parseInt(page));
    limit === "" || limit === undefined
      ? (limit = 5)
      : (limit = parseInt(limit));
    if (search === "" || search === undefined) {
      search = "";
    }
    if (sort === "" || sort === undefined) {
      sort = "user_id";
    }
    if (ascDesc === "" || ascDesc === undefined) {
      ascDesc = "ASC";
    }
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
      const result = await getUser(limit, offset, search, sort, ascDesc);
      console.log(result);
      // proses set data result ke dalam redis
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
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
  registerUser: async (request, response) => {
    const { user_email, user_password, user_name } = request.body;
    // utk merubah password agar di enkripsi
    const salt = bcrypt.genSaltSync(10);
    const encryptPassword = bcrypt.hashSync(user_password, salt);
    const addData = {
      user_email,
      user_password: encryptPassword,
      user_name,
      user_role: 2,
      user_status: 0,
      user_created_at: new Date(),
    };
    // console.log(user_email);
    try {
      // kondisi jika email sama tidak bisa
      const checkEmail = await checkUser(user_email);
      if (user_email === "" || user_email.search("@") < 0) {
        return helper.response(response, 400, "Valid Email is Required");
      } else if (checkEmail.length >= 1) {
        return helper.response(response, 400, "Email Already Used");
      } else if (user_name === "") {
        return helper.response(response, 400, "Username is Required");
      } else if (user_password.length < 8) {
        return helper.response(
          response,
          400,
          "minimum 8 character is Required"
        );
      } else {
        const result = await postUser(addData);
        return helper.response(response, 200, "Success Register User", result);
      }
    } catch (error) {
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
              "Your account is not activate, contact admin for help"
            );
          } else {
            const token = jwt.sign(payload, "RAHASIA", { expiresIn: "24h" });
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
    try {
      const { id } = request.params;
      const {
        user_name,
        user_email,
        user_password,
        user_role,
        user_status,
      } = request.body;
      const salt = bcrypt.genSaltSync(10);
      const encryptPassword = bcrypt.hashSync(user_password, salt);
      const updateUser = {
        user_name,
        user_email,
        user_password: encryptPassword,
        user_role,
        user_status,
        user_updated_at: new Date(),
      };
      const checkId = await getUserById(id);
      console.log(checkId);
      if (checkId.length > 0) {
        const result = await patchUser(updateUser, id);
        return helper.response(response, 200, `User id: ${id} Updated`, result);
      } else {
        return helper.response(response, 404, `User id: ${id} not Found`);
      }
    } catch (error) {
      return helper.response(response, 400, "Bad Request", error);
    }
  },
};
