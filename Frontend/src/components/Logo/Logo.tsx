import { Link } from "react-router-dom";
// import { useContext } from "react";
// import { AppContext } from "../../../context/app.context";

import logo from "../../assets/Logo.svg";
// import path from "../../constants/path";

export default function Logo({ className = "" }: { className?: string }) {
  // const { profile, isAuthenticated } = useContext(AppContext);

  const target_path = "/";

  // if (isAuthenticated) {
  //   if (profile?.role === "mentor") {
  //     target_path = path.mentor_home;
  //   } else if (profile?.role === "mentee") {
  //     target_path = path.mentee_home;
  //   }
  // }

  return (
    <Link to={target_path} className="flex items-center gap-2">
      <img
        src={logo}
        alt="CareerLink — Your link to career clarity"
        className={`h-9 w-auto select-none ${className}`}
        loading="eager"
        decoding="async"
      />
      <span className="sr-only">CareerLink</span>
    </Link>
  );
}
