import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { User, Bell, Building, Shield, Save } from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { useToast } from "../context/ToastContext";
import wilayas from "../data/wilayas.json";

const api = "http://localhost:3000";

const Settings = () => {
  const { t } = useLanguage();
  const { user, updateUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isFromSignup = location.state?.fromSignup || false;

  const [activeTab, setActiveTab] = useState("profile");
  const [profileImage, setProfileImage] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [clinicName, setClinicName] = useState("");
  const { addToast } = useToast();

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: t("notifications"), icon: Bell },
    { id: "clinic", label: "Clinic Details", icon: Building },
    { id: "security", label: "Security", icon: Shield },
  ];

  const fileInputRef = React.useRef(null);

  useEffect(() => {
    if (!user) return;
    const [first = "", ...rest] = (user.full_name || "").split(" ");
    setFirstName(first);
    setLastName(rest.join(" "));
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setWilaya(user.wilaya || "");
    setSpecialty(user.specialty || "");
    setClinicName(user.clinic_name || "");
  }, [user]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!user) return;

    const payload = {
      full_name: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      wilaya,
    };

    if (user.type === "doctor") {
      payload.specialty = specialty;
      payload.clinic_name = clinicName;
    }

    const userId = user._id || user.user_id;
    const route = user.type === "doctor" ? "doctors" : "patients";

    try {
      const response = await axios.put(`${api}/${route}/${userId}`, payload);
      updateUser(response.data);
      addToast("Settings saved successfully.", "success");
      
      if (isFromSignup && activeTab === "profile") {
        setActiveTab("clinic");
        addToast("Please complete your Clinic Details next.", "info");
      } else if (isFromSignup && activeTab === "clinic") {
        navigate("/");
        addToast("Setup complete! Welcome to Doctome.", "success");
      }
    } catch (error) {
      console.error("Settings save failed", error);
      addToast("Failed to update profile.", "error");
    }
  };

  const handleChangePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        setProfileImage(imageUrl);
        addToast("Profile photo updated.", "success");
      } else {
        addToast("Please select a valid image file.", "error");
      }
    }
  };

  const handleRemovePhoto = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    addToast("Profile photo removed.", "warning");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-dark mb-6">
        {isFromSignup ? "Complete Your Profile" : t("settings")}
      </h1>

      {isFromSignup && (
        <div className="mb-6 bg-primary-light border-l-4 border-primary text-primary-dark p-4 rounded-r-md">
          <p className="text-sm font-medium">Welcome to Doctome! Let's get your profile and clinic details set up to personalize your experience.</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <Card noPadding className="overflow-hidden">
            <nav className="flex flex-col py-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all text-left ${
                    activeTab === tab.id
                      ? "bg-primary-light text-primary border-r-2 border-primary"
                      : "text-text-muted hover:bg-border-subtle hover:text-text-dark border-r-2 border-transparent"
                  }`}>
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Settings Content Area */}
        <div className="flex-grow">
          {activeTab === "profile" && (
            <Card>
              <h2 className="text-xl font-semibold text-text-dark mb-6">
                Personal Information
              </h2>

              <div className="flex items-center gap-6 mb-8 border-b border-border-light pb-8">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover shrink-0 border border-border-light shadow-sm"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-border-subtle flex items-center justify-center text-2xl font-bold text-text-dark shrink-0 shadow-sm">
                    {(user?.full_name || "Unknown")
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-text-dark mb-2">
                    Profile Photo
                  </h3>
                  <div className="flex gap-2 items-center">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleChangePhoto}>
                      Change
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-danger hover:text-danger"
                      onClick={handleRemovePhoto}>
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveChanges}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-dark block">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-bg-main border border-border-light rounded-md px-4 py-2 text-sm text-text-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-dark block">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-bg-main border border-border-light rounded-md px-4 py-2 text-sm text-text-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-dark block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-bg-main border border-border-light rounded-md px-4 py-2 text-sm text-text-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-dark block">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-bg-main border border-border-light rounded-md px-4 py-2 text-sm text-text-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-dark block">
                      Wilaya
                    </label>
                    <select
                      value={wilaya}
                      onChange={(e) => setWilaya(e.target.value)}
                      className="w-full bg-bg-main border border-border-light rounded-md px-4 py-2 text-sm text-text-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    >
                      <option value="">Select Wilaya</option>
                      {wilayas.map((w) => (
                        <option key={w.id} value={w.name}>
                          {w.id} - {w.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-text-dark block">
                      Specialty / Title
                    </label>
                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="w-full bg-bg-main border border-border-light rounded-md px-4 py-2 text-sm text-text-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="submit" variant="primary" icon={Save}>
                    {t("save_changes")}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <h2 className="text-xl font-semibold text-text-dark mb-6">
                Notification Preferences
              </h2>
              <form onSubmit={handleSaveChanges} className="space-y-6">
                <div className="flex items-center justify-between border-b border-border-light pb-4">
                  <div>
                    <h4 className="text-sm font-medium text-text-dark">
                      Email Adjustments
                    </h4>
                    <p className="text-xs text-text-muted">
                      Receive daily summary reports.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 accent-primary"
                  />
                </div>
                <div className="flex items-center justify-between border-b border-border-light pb-4">
                  <div>
                    <h4 className="text-sm font-medium text-text-dark">
                      SMS Alerts
                    </h4>
                    <p className="text-xs text-text-muted">
                      Instant alerts for High-Risk patient cancellations.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 accent-primary"
                  />
                </div>
                <div className="flex items-center justify-between border-b border-border-light pb-4">
                  <div>
                    <h4 className="text-sm font-medium text-text-dark">
                      Marketing Emails
                    </h4>
                    <p className="text-xs text-text-muted">
                      Receive updates about Doctome features.
                    </p>
                  </div>
                  <input type="checkbox" className="w-4 h-4 accent-primary" />
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit" variant="primary">
                    Update Preferences
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === "clinic" && (
            <Card>
              <h2 className="text-xl font-semibold text-text-dark mb-6">
                Clinic Information
              </h2>
              <form onSubmit={handleSaveChanges} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-dark block">
                    Clinic Name
                  </label>
                  <input
                    type="text"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    className="w-full bg-bg-main border border-border-light rounded-md px-4 py-2 text-sm text-text-dark"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-dark block">
                    Address
                  </label>
                  <input
                    type="text"
                    defaultValue="123 Medical Way, Suite 400"
                    className="w-full bg-bg-main border border-border-light rounded-md px-4 py-2 text-sm text-text-dark"
                  />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  {isFromSignup && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/")}
                    >
                      Skip for now
                    </Button>
                  )}
                  <Button type="submit" variant="primary">
                    Save Clinic Details
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <h2 className="text-xl font-semibold text-text-dark mb-6">
                Security Settings
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addToast("Password successfully updated!", "success");
                }}
                className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-dark block">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-bg-main border border-border-light rounded-md px-4 py-2 text-sm text-text-dark"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-dark block">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-bg-main border border-border-light rounded-md px-4 py-2 text-sm text-text-dark"
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    variant="outline"
                    className="text-primary border-primary hover:bg-primary-light">
                    Change Password
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
