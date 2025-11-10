import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProfilePage from "../Profile";
import UpdateProfile from "../UpdateProfile";
import type { Profile } from "../../../types/profile.types";

export default function MePage() {
  const [isEditing, setIsEditing] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("edit") === "1") {
      setIsEditing(true);                            // giữ chế độ edit
      navigate(location.pathname, { replace: true }); // URL chỉ còn /users/me
    }
   }, [location.pathname, location.search, navigate]);

  const toEdit = () => setIsEditing(true);
  const toView = () => setIsEditing(false);

  // demo data (UI-only)
  const demo: Profile = {
    name: "Tran Ngoc Thao Vy",
    email: "TNTV9@gmail.com",
    avatar_url:
      "https://mivora-ap-southeast-1.s3.ap-southeast-1.amazonaws.com/avatar-images/egzwcma6gxnfuitlb2x17n3oq.jpg",
    verified: "verified",
    role: "attendee"
  };

  return isEditing ? (
    <UpdateProfile profile={demo} onCancel={toView} onSaved={toView} />
  ) : (
    <ProfilePage profile={demo} onEdit={toEdit} />
  );
}
