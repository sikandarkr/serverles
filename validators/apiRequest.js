module.exports = {
    requireApiKey: (req, res, next) => {
      const apiKey = req.header("x-api-key");
      // return next(res.json({ "api-key": apiKey }));
      if (!apiKey) {
        return next(res.json({ "api-key-error": "Api key is required" }));
      }
      if (!(apiKey === process.env.API_KEY)) {
        return next(res.json({ "api-key-error": process.env.apiKey }));
      }
      return next();
    }
};