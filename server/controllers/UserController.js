require("dotenv").config();

const pool = require("../db");
const chalk = require("chalk");
const jwt = require("jsonwebtoken");
const cryptoJS = require("crypto-js");

class UserController {
  async add(req, res, next) {
    const {
      username,
      password,
      repeatPassword,
      surname,
      name,
      patronymic,
      birthDate,
      phoneNumber,
      email,
    } = req.body;

    const usernameUniqueQuery = `SELECT * FROM "users" 
                                 WHERE username = $1`;

    const emailUniqueQuery = `SELECT * FROM "users" 
                              WHERE email = $1`;

    const phoneNumberUniqueQuery = `SELECT * FROM "users" 
                                    WHERE phone_number = $1`;

    const addUserQuery = `INSERT INTO "users"(surname, name, patronymic, birth_date, phone_number, username, email, password) 
                                        VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

    const isUsernameUnique =
      (await pool.query(usernameUniqueQuery, [username])).rowCount == 0;

    const isEmailUnique =
      (await pool.query(emailUniqueQuery, [email])).rowCount == 0;

    const isPhoneNumberUnique =
      (await pool.query(phoneNumberUniqueQuery, [phoneNumber])).rowCount == 0;

    const isPasswordsEqual = password === repeatPassword;

    // Получение пользователя
    try {
      if (!isPasswordsEqual)
        return res.status(406).send("Passwords are not equal!");
      else if (!isPhoneNumberUnique)
        return res.status(406).send("Number should be unique!");
      else if (!isUsernameUnique)
        return res.status(406).send("Username should be unique!");
      else if (!isEmailUnique)
        return res.status(406).send("Email should be unique!");

      const encryptPass = String(
        cryptoJS.AES.encrypt(password, process.env.PASS_KEY)
      );
      // Запрос на добавление пользователей в таблицу
      const newUser = await pool.query(addUserQuery, [
        surname,
        name,
        patronymic,
        birthDate,
        phoneNumber,
        username,
        email,
        encryptPass,
      ]);
      console.log(
        chalk.bgGreen("New user data: " + JSON.stringify(newUser.rows[0]))
      );

      res.status(200).json(newUser.rows[0]);
    } catch (e) {
      console.log(chalk.magenta("Add User Error: " + e));
      res.status(501).json({
        status: "error",
      });
    }
  }

  async login(req, res) {
    const { username, password } = req.body;
    console.log(username, password);

    const findUserQuery = `SELECT * FROM "users" 
                              WHERE username = $1`;

    const findClientQuery = `SELECT * FROM "clients"
                              WHERE user_id = $1`;

    const findEmployeeQuery = `SELECT * FROM "employees"
                              WHERE user_id = $1`;

    try {
      const user = (await pool.query(findUserQuery, [username]))?.rows[0];

      const client = (await pool.query(findClientQuery, [user?.id]))?.rows[0];

      const employee = (await pool.query(findEmployeeQuery, [user?.id]))
        ?.rows[0];

      console.log(chalk.bgRed("Found user: "), user);
      console.log(chalk.bgRed("Found client: "), client);
      console.log(chalk.bgRed("Found employee: "), employee);

      if (user) {
        const decryptPass = cryptoJS.AES.decrypt(
          user.password,
          process.env.PASS_KEY
        ).toString(cryptoJS.enc.Utf8);
        console.log(chalk.bgRed("Decrypt password: "), decryptPass);
        if (password == decryptPass) {
          let payload = null;

          if (employee) {
            payload = {
              id: user.id,
              employeeId: employee?.id,
              username: user.username,
              role: user.role,
            };
          } else if (client) {
            payload = {
              id: user.id,
              clientId: client?.id,
              username: user.username,
              role: user.role,
            };
          } else {
            payload = {
              id: user.id,
              username: user.username,
              role: user.role,
            };
          }

          const accessToken = jwt.sign(payload, process.env.TOKEN_KEY);

          return res.status(200).json({
            message: "You have successfully logged into your account",
            accessToken,
          });
        } else {
          throw new Error("Username or password are incorrect!");
        }
      } else {
        throw new Error("Username or password are incorrect!");
      }
    } catch (e) {
      console.log(chalk.magenta("Login Error: " + e.message));
      return res.status(406).json({
        message: e.message,
      });
    }
  }

  async register(req, res, next) {
    const {
      username,
      password,
      repeatPassword,
      surname,
      name,
      patronymic,
      birthDate,
      phoneNumber,
      email,
    } = req.body;

    for (let key in req.body) {
      if (req.body[key] == "") {
        throw new Error("All fields shoulld be provided!");
      }
    }

    const usernameUniqueQuery = `SELECT * FROM isUsernameUnique($1);`;

    const emailUniqueQuery = `SELECT * FROM isEmailUnique($1);`;

    const phoneNumberUniqueQuery = `SELECT * FROM isPhoneNumberUnique($1);`;

    const addUserQuery = `INSERT INTO users(surname, name, patronymic, birth_date, phone_number, username, email, password) 
                                        VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

    const { isusernameunique } = (
      await pool.query(usernameUniqueQuery, [username])
    ).rows[0];

    const { isemailunique } = (await pool.query(emailUniqueQuery, [email]))
      .rows[0];

    const { isphonenumberunique } = (
      await pool.query(phoneNumberUniqueQuery, [phoneNumber])
    ).rows[0];

    const isPasswordsEqual = password === repeatPassword;

    console.log(
      isemailunique,
      isusernameunique,
      isphonenumberunique,
      isPasswordsEqual
    );

    try {
      if (!isPasswordsEqual) throw new Error("Passwords are not equal!");
      else if (!isphonenumberunique)
        throw new Error("Phone number is already used!");
      else if (!isusernameunique) throw new Error("This username is busy!");
      else if (!isemailunique) throw new Error("This email is already used!");

      const encryptPass = String(
        cryptoJS.AES.encrypt(password, process.env.PASS_KEY)
      );

      const values = [
        surname,
        name,
        patronymic,
        birthDate,
        phoneNumber,
        username,
        email,
        encryptPass,
      ];

      await pool.query(addUserQuery, values, (err, data) => {
        console.log(
          chalk.bgGreen("New user data: " + JSON.stringify(data.rows[0]))
        );
        return res.status(200).json({
          message: "You successfuly created account!",
          data: data.rows[0],
        });
      });
    } catch (e) {
      console.log(chalk.magenta("Register Error: " + e));
      return res.status(406).json({ message: e.message });
    }
  }

  async update(req, res, next) {
    const id = req.params.id;

    const {
      surname,
      name,
      patronymic,
      birthDate,
      phoneNumber,
      email,
      username,
      oldPassword,
      newPassword,
      repeatNewPassword,
    } = req.body;

    console.log(req.body);

    const isChangePassword =
      isValue(oldPassword) &&
      isValue(newPassword) &&
      isValue(repeatNewPassword);

    const updateUserQuery = `UPDATE "users" 
                   SET surname = $1, name = $2, patronymic = $3, birth_date = $4, username = $5, phone_number = $6, email = $7
                   WHERE id = $8 RETURNING *`;

    const updatePasswordQuery = `UPDATE "users" 
                            SET password = $1
                            WHERE id = $2 RETURNING *`;

    const findUserQuery = `SELECT * FROM "users" 
                            WHERE id = $1`;

    const values = [
      surname,
      name,
      patronymic,
      birthDate,
      username,
      phoneNumber,
      email,
      id,
    ];

    try {
      if (isChangePassword) {
        const user = (await pool.query(findUserQuery, [id])).rows[0];
        const decryptPass = cryptoJS.AES.decrypt(
          user.password,
          process.env.PASS_KEY
        ).toString(cryptoJS.enc.Utf8);

        console.log(chalk.bgRed("Decrypt password: "), decryptPass);

        if (oldPassword == decryptPass) {
          if (newPassword == repeatNewPassword) {
            const encryptPass = String(
              cryptoJS.AES.encrypt(newPassword, process.env.PASS_KEY)
            );

            await pool.query(
              updatePasswordQuery,
              [encryptPass, id],
              (err, data) => {
                return res.status(200).json({
                  message: "Your password successfully changed!",
                  data: data.rows[0],
                });
              }
            );
          } else {
            throw new Error("New passwords are not equal!");
          }
        } else {
          throw new Error("Password doesn't exist!");
        }
      } else {
        await pool.query(updateUserQuery, values, (err, data) => {
          if (err) next(err);
          else {
            return res.status(200).json({
              message: "Your profile successfully updated!",
            });
          }
        });
      }
    } catch (e) {
      console.log(chalk.magenta("Update User Error: " + e));
      return res.status(406).json({ message: e.message });
    }
  }

  async remove(req, res) {
    const id = req.params.id;

    const query = `DELETE FROM "users" 
                   WHERE id = $1 RETURNING *`;

    try {
      const removedUser = await pool.query(query, [id]);

      res.status(200).json({
        data: removedUser.rows[0],
      });
    } catch (e) {
      return res.status(406).json({
        message: e.message,
      });
    }
  }

  async getAll(req, res) {
    const query = `SELECT * FROM "users"`;

    try {
      const users = await pool.query(query);

      res.status(200).json({
        data: users.rows,
        count: users.rowCount,
      });
    } catch (e) {
      return res.status(406).json({
        message: e.message,
      });
    }
  }

  async getById(req, res) {
    const id = req.params.id;

    const query = `SELECT * FROM "users"
                  WHERE id = $1`;

    try {
      const user = (await pool.query(query, [id])).rows[0];
      const decryptPass = cryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_KEY
      ).toString(cryptoJS.enc.Utf8);
      console.log(decryptPass);
      user.password = decryptPass;

      return res.status(200).json({
        data: user,
      });
    } catch (e) {
      return res.status(406).json({
        message: e.message,
      });
    }
  }
}

function isValue(val) {
  return val !== undefined && val != null && val != "";
}

module.exports = new UserController();
