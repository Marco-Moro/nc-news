exports.handleCustomErrors = (err, request, response, next) => {
  if (err.status) {
    response.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePSQLErrors = (err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "bad request" });
  } else next(err);
};

exports.handle500 = (err, request, response, next) => {
  console.log("Unhandled error:", err);
  response.status(500).send({ msg: "Internal Server Error" });
};
