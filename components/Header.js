import { useRouter } from "next/router";
import useTranslation from "../utils/i18n";
import Link from "next/link";
import Button from "./Button";

const Header = () => {
  const { changeLocale, locale } = useTranslation();
  const { asPath } = useRouter();

  return (
    <header className="w-full flex items-center justify-between">
      <Link href="/">
        <p className="text-4xl font-bold">AgroScan</p>
      </Link>
      <Link href={asPath} locale={locale === "en" ? "es" : "en"} scroll={false}>
        <Button>{changeLocale}</Button>
      </Link>
    </header>
  );
};

export default Header;
