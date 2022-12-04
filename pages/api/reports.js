import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PASSWORD = process.env.PASSWORD;

const handler = async (req, res) => {
  try {
    const { password } = req.query;

    if (password == PASSWORD) {
      const { page } = req.query;

      const pages = Math.ceil((await prisma.report.count()) / 10);

      if (page && page <= pages) {
        const reports = await prisma.report.findMany({
          skip: page - 1,
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        });

        res
          .status(200)
          .json({ message: "Reports fetched", page, pages, reports });
      } else {
        const reports = await prisma.report.findMany({
          skip: 0,
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        });

        res
          .status(200)
          .json({ message: "Reports fetched", page: 1, pages, reports });
      }
    } else {
      res.status(401).json({ message: "Password is incorrect" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
