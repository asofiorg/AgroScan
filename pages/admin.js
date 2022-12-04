import { checkPassword } from "../utils/api";
import { useState } from "react";
import Button from "../components/Button";
import useTranslation from "../utils/i18n";
import Dashboard from "../components/Dashboard";
import Head from "next/head";

const Admin = () => {
  const [password, setPassword] = useState("");
  const [canProceed, setCanProceed] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const handleChange = (e) => {
    setPassword(e.target.value);

    if (attempted) {
      setAttempted(false);
    }
  };

  const handleSubmit = async () => {
    const can = await checkPassword(password);
    setCanProceed(can);
    setAttempted(true);
  };

  const { admin } = useTranslation();

  if (!canProceed) {
    return (
      <>
        <Head>
          <title>Admin - AgroScan</title>
        </Head>
        <label htmlFor="address" className="flex flex-col m-2">
          {admin?.password?.label}
          <input
            className="border border-gray-300 rounded-md p-2"
            type="password"
            onChange={handleChange}
            value={password}
            placeholder={admin?.password?.placeholder}
          />
          {attempted && (
            <p className="text-red-500">{admin?.password?.incorrect}</p>
          )}
        </label>
        <Button onClick={handleSubmit}>{admin?.password?.submit}</Button>
      </>
    );
  }

  return <Dashboard password={password} />;
};

export default Admin;
