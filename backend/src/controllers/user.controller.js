export const getProfile = (req, res) => {
    res.json({ message: "Welcome to your profile", user: req.user });
  };