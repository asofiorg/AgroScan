import Link from "next/link";

const Footer = () => {
  return (
    <footer>
      &copy; ASOFI 2022 -{" "}
      <a
        href="https://github.com/asofiorg/agroscan"
        rel="noreferrer"
        target="_blank"
        className="text-blue-500 underline hover:text-blue-700"
      >
        Open Source
      </a>{" "}
      -{" "}
      <Link
        href="/admin"
        className="text-blue-500 underline hover:text-blue-700"
      >
        Admin
      </Link>
    </footer>
  );
};

export default Footer;
