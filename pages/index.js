import Link from "next/link";
import useTranslation from "../utils/i18n";
import Button from "../components/Button";
import Image from "next/image";
import heroImage from "../images/hero.png";
import aboutImage from "../images/about.png";

const Home = () => {
  const { hero, about, asofi, cta } = useTranslation();

  return (
    <>
      <section className="flex flex-col items-center justify-center my-6">
        <Image
          className="w-80"
          src={heroImage}
          alt="A little plant over a hand"
        />
        <h1 className="text-center text-5xl font-bold my-4">{hero?.title}</h1>
        <h2 className="text-center text-lg my-4">{hero?.subtitle}</h2>
        <Link href="/scan">
          <Button>{hero?.cta}</Button>
        </Link>
      </section>
      <section className="flex flex-col items-center justify-center my-6">
        <h1 className="text-center text-5xl font-bold my-4">{about?.title}</h1>
        <Image
          className="w-80"
          src={aboutImage}
          alt="A phone aside of some photos"
        />
        <p className="text-justify text-lg my-4">{about?.content}</p>
      </section>
      <section className="flex flex-col items-center justify-center my-6">
        <h1 className="text-center text-5xl font-bold my-4">{asofi?.title}</h1>
        <p className="text-justify text-lg my-4">{asofi?.content}</p>
      </section>
      <section className="flex flex-col items-center justify-center my-6">
        <h1 className="text-center text-5xl font-bold my-4">{cta?.title}</h1>
        <h2 className="text-center text-lg my-4">{cta?.subtitle}</h2>
        <Link href="/scan">
          <Button>{cta?.button}</Button>
        </Link>
      </section>
    </>
  );
};

export default Home;
