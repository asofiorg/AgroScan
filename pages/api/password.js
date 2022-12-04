const PASSWORD = process.env.PASSWORD;

const handler = async (req, res) => {
  try {
    const { password } = req.body;

    if (password == PASSWORD) {
      res.status(200).json({ message: "Password is correct" });
    } else {
      res.status(401).json({ message: "Password is incorrect" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
