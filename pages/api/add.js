import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    const { lat, lng, address, comments, image, report, contact } = req.body;

    const newReport = await prisma.report.create({
      data: {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        contact,
        address,
        comments,
        image,
        report,
      },
    });

    res.status(200).json({ message: "Report added", report: newReport });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
