import React from "react";
import { Card } from "../components/Card";
import { Label } from "../components/Label";
import { Select } from "../components/Select";
import { Toggle } from "../components/Toggle";
import { Container } from "../layouts/Container";
import { BRAND } from "../constants/brand";
import avatarPlaceholder from "../assets/avatar-placeholder.png";


export default function ProfilePage() {
  const [avatar, setAvatar] = React.useState<string | null>(avatarPlaceholder);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };
  const [prefs, setPrefs] = React.useState({
  twoFA: true,
  reminders: true,
  });

  return (
  <section id="profile" className="py-10 sm:py-14">
    <Container>
      <div className="mx-auto w-full max-w-3xl space-y-8">
        {/* Header */}
        <header>
          <h2
            className="text-3xl font-semibold"
            style={{ color: BRAND.primary }}
          >
            Mivora Settings
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Manage your account preferences
          </p>
        </header>

        {/* Profile Card */}
        <Card>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar Upload */}
            <div className="relative">
              <img
                src={avatar ?? "https://i.pravatar.cc/150"}
                alt="User avatar"
                className="h-24 w-24 rounded-full object-cover ring-2 ring-pink-500"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-pink-600 text-white text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-pink-700 transition"
              >
                Edit
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 w-full space-y-3">
              <div>
                <Label htmlFor="profile-name">Name</Label>
                <p
                  id="profile-name"
                  className="mt-1 text-sm text-gray-200"
                >
                  Pham Khoi Nguyen
                </p>
              </div>
              <div>
                <Label htmlFor="profile-lang">Language</Label>
                <Select id="profile-lang" defaultValue="en">
                  <option value="en">English</option>
                  <option value="vi">Tiếng Việt</option>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card>
          <div className="space-y-3">
    <Toggle
      checked={prefs.twoFA}
      onChange={(v) => setPrefs((p) => ({ ...p, twoFA: v }))}
      label="2FA enabled"
    />
    <Toggle
      checked={prefs.reminders}
      onChange={(v) => setPrefs((p) => ({ ...p, reminders: v }))}
      label="Reminders (24h, 2h)"
    />
  </div>
        </Card>
      </div>
    </Container>
  </section>
);
}