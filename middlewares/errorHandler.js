const {
  TOKEN_DOES_NOT_EXIST,
  INVALID_TOKEN,
  UNAUTHORIZED_ACCESS,
  TOKEN_EXPIRED,
} = require('../constants/errorConstants');

function errorHandler(err, req, res, next) {
  let error = { ...err, name: err.name, message: err.message };

  console.log(err.stack);

  switch (error.name) {
    case TOKEN_DOES_NOT_EXIST:
      return res.json({
        ok: false,
        status: 400,
        message: '인증 토큰이 존재하지 않습니다.',
      });
    case (INVALID_TOKEN, TOKEN_EXPIRED):
      return res.json({
        ok: false,
        status: 400,
        message: '유효하지 않은 인증 토큰입니다.',
      });
    case UNAUTHORIZED_ACCESS:
      return res.json({
        ok: false,
        status: 401,
        message: '미승인 유저입니다.',
      });
  }

  if (err.isOperational) {
    return res.json({
      ok: error.ok,
      status: error.status,
      message: error.message,
    });
  }

  res.json({
    ok: false,
    status: 500,
    message: '서버에 문제가 발생했습니다.',
  });
}

module.exports = errorHandler;
