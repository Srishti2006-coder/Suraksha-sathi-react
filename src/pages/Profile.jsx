import React, { useState, useEffect } from "react";

const Profile = ({ setPage }) => {
  // State for user data (simulated from localStorage)
  const [user, setUser] = useState({
    username: "User",
    email: "email@example.com",
    created: Date.now(),
  });

  // State for emergency contacts
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  
  // State for modals
  const [showECModal, setShowECModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPwdModal, setShowPwdModal] = useState(false);
  
  // State for settings
  const [settings, setSettings] = useState({
    notifications: true,
    privacy: "contacts",
    dark: false,
  });

  // State for SOS
  const [sosCmd, setSosCmd] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("Status: idle");
  const [sosHeard, setSosHeard] = useState([]);

  // State for stats
  const [stats, setStats] = useState({
    routes: 0,
    reports: 0,
    alerts: 0,
  });

  // State for activity
  const [activities, setActivities] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    // Load user
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch (e) {
        console.error("Error parsing user:", e);
      }
    }

    // Load emergency contacts
    const storedContacts = localStorage.getItem("emergencyContacts");
    if (storedContacts) {
      try {
        setEmergencyContacts(JSON.parse(storedContacts));
      } catch (e) {
        console.error("Error parsing contacts:", e);
      }
    }

    // Load settings
    const storedSettings = localStorage.getItem("settings");
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch (e) {
        console.error("Error parsing settings:", e);
      }
    }

    // Load stats
    const routes = localStorage.getItem("stat_routes") || 0;
    const reports = localStorage.getItem("stat_reports") || 0;
    const alerts = localStorage.getItem("stat_alerts") || 0;
    setStats({ routes: Number(routes), reports: Number(reports), alerts: Number(alerts) });

    // Load SOS command
    const storedCmd = localStorage.getItem("sos_cmd");
    if (storedCmd) {
      setSosCmd(storedCmd);
    }

    // Load activity
    const storedActivity = localStorage.getItem("activity");
    if (storedActivity) {
      try {
        setActivities(JSON.parse(storedActivity));
      } catch (e) {
        // Default activities
        setActivities([
          { when: Date.now() - 3600000, text: "Checked a safe route" },
          { when: Date.now() - 3600 * 24 * 1000, text: "Reported an area" },
          { when: Date.now() - 3600 * 48 * 1000, text: "Viewed community post" },
        ]);
      }
    } else {
      setActivities([
        { when: Date.now() - 3600000, text: "Checked a safe route" },
        { when: Date.now() - 3600 * 24 * 1000, text: "Reported an area" },
        { when: Date.now() - 3600 * 48 * 1000, text: "Viewed community post" },
      ]);
    }
  }, []);

  // Get user initials
  const getInitials = (name) => {
    return (name || "U").charAt(0).toUpperCase();
  };

  // Format date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  // Save emergency contact
  const saveEmergencyContact = (contact) => {
    const newContacts = [...emergencyContacts, { ...contact, id: Date.now() }];
    setEmergencyContacts(newContacts);
    localStorage.setItem("emergencyContacts", JSON.stringify(newContacts));
  };

  // Remove emergency contact
  const removeContact = (id) => {
    const newContacts = emergencyContacts.filter((c) => c.id !== id);
    setEmergencyContacts(newContacts);
    localStorage.setItem("emergencyContacts", JSON.stringify(newContacts));
  };

  // Save SOS command
  const saveSosCommand = () => {
    localStorage.setItem("sos_cmd", sosCmd);
    setStatus("Status: command saved");
    setTimeout(() => setStatus("Status: idle"), 1500);
  };

  // Toggle voice listener
  const toggleVoiceListener = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setIsListening(!isListening);
      if (!isListening) {
        setStatus("Listening...");
      } else {
        setStatus("Stopped");
      }
    } else {
      setStatus("SpeechRecognition not supported in this browser");
    }
  };

  // Save settings
  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem("settings", JSON.stringify(newSettings));
  };

  // Handle edit profile
  const handleEditProfile = (e) => {
    e.preventDefault();
    const username = e.target.editUsername.value;
    const email = e.target.editEmail.value;
    const newUser = { ...user, username, email };
    setUser(newUser);
    localStorage.setItem("authUser", JSON.stringify(newUser));
    setShowEditModal(false);
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    e.preventDefault();
    // In a real app, this would validate and update the password
    setShowPwdModal(false);
    alert("Password updated.");
  };

  return (
    <main className="max-w-6xl mx-auto mt-8 px-4 pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <section className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 text-2xl font-bold">
              {getInitials(user.username)}
            </div>
            <div>
              <div className="text-xl font-semibold">{user.username || "User"}</div>
              <div className="text-sm text-slate-500">{user.email || "email@example.com"}</div>
              <div className="text-xs text-slate-400 mt-1">
                Joined: {user.created ? formatDate(user.created) : "—"}
              </div>
            </div>
          </div>

          <div className="mt-4 space-x-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded shadow-sm hover:bg-indigo-700 transition"
            >
              Edit Profile
            </button>
            <button
              onClick={() => setShowPwdModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border rounded hover:bg-slate-50 transition"
            >
              Change Password
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-600">Emergency Contacts</h3>

            <div className="mt-3">
              <p className="text-xs text-slate-400 mb-3">
                Manage trusted contacts who will be notified in an emergency.
              </p>
              <button
                onClick={() => setShowECModal(true)}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-md bg-pink-600 hover:bg-pink-700 text-white shadow transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 8.5v7a2.5 2.5 0 002.5 2.5h13A2.5 2.5 0 0021 15.5v-7A2.5 2.5 0 0018.5 6h-13A2.5 2.5 0 003 8.5zM8 12h8M8 15h5"
                  />
                </svg>
                Manage Emergency Contacts
              </button>
            </div>

            {/* Inline contact list */}
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {emergencyContacts.length === 0 ? (
                <li className="text-xs text-slate-400">
                  No emergency contacts yet. Click "Manage Emergency Contacts" to add.
                </li>
              ) : (
                emergencyContacts.map((contact) => (
                  <li
                    key={contact.id}
                    className="flex items-center justify-between bg-slate-50 p-2 rounded"
                  >
                    <div>
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-xs text-slate-500">
                        {contact.country} {contact.phone}
                      </div>
                    </div>
                    <button
                      onClick={() => removeContact(contact.id)}
                      className="text-red-500 text-sm hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))
              )}
            </ul>

            {/* Voice SOS controls */}
            <div className="mt-4 p-4 bg-white rounded border">
              <h4 className="font-semibold mb-2">Voice SOS</h4>
              <p className="text-xs text-slate-500 mb-2">
                Set a custom voice command and start the listener.
              </p>

              <input
                type="text"
                value={sosCmd}
                onChange={(e) => setSosCmd(e.target.value)}
                placeholder="e.g., help me 123"
                className="w-full px-3 py-2 border rounded mb-2 text-slate-700 placeholder-slate-400"
              />

              <div className="flex items-center gap-2">
                <button
                  onClick={saveSosCommand}
                  className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  Save Command
                </button>

                <button
                  onClick={toggleVoiceListener}
                  className="px-3 py-2 rounded bg-rose-600 text-white hover:bg-rose-700 transition"
                >
                  {isListening ? "Stop Voice Listener" : "Start Voice Listener"}
                </button>

                <div className="text-xs text-slate-500 ml-auto">{status}</div>
              </div>

              {/* Live heard lines */}
              {sosHeard.length > 0 && (
                <div className="sos-heard mt-4">
                  {sosHeard.map((line, i) => (
                    <div key={i} className="line p-2 bg-slate-50 rounded mt-2 text-sm">
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Stats + Activity (span 2 cols) */}
        <section className="lg:col-span-2 space-y-6">
          {/* Safety Insights */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold">Safety Insights</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded">
                <div className="text-xs text-slate-500">Safe Routes Taken</div>
                <div className="text-2xl font-semibold mt-1">{stats.routes}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded">
                <div className="text-xs text-slate-500">Reports Sent</div>
                <div className="text-2xl font-semibold mt-1">{stats.reports}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded">
                <div className="text-xs text-slate-500">Alerts Received</div>
                <div className="text-2xl font-semibold mt-1">{stats.alerts}</div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-600">Recent Activity</h3>
              <ul className="mt-3 space-y-3 text-sm text-slate-700">
                {activities.length === 0 ? (
                  <li className="p-3 rounded bg-slate-50">No recent activity</li>
                ) : (
                  activities.slice(0, 6).map((activity, index) => (
                    <li
                      key={index}
                      className="p-3 rounded bg-slate-50 flex justify-between items-start"
                    >
                      <div>{activity.text}</div>
                      <div className="text-xs text-slate-400">
                        {new Date(activity.when).toLocaleString()}
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Settings & Preferences</h2>
              <div className="text-xs text-slate-500">Manage your account</div>
            </div>

            <div className="mt-4 space-y-4">
              {/* Enable Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Enable Notifications</div>
                  <div className="text-xs text-slate-500">Receive app alerts</div>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) =>
                      updateSettings({ ...settings, notifications: e.target.checked })
                    }
                    className="sr-only"
                  />
                  <span
                    className={`w-11 h-6 rounded-full relative transition-colors ${
                      settings.notifications ? "bg-indigo-600" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.notifications ? "translate-x-5" : ""
                      }`}
                    />
                  </span>
                </label>
              </div>

              {/* Privacy */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Privacy: Share profile</div>
                  <div className="text-xs text-slate-500">Who can see your profile</div>
                </div>
                <select
                  value={settings.privacy}
                  onChange={(e) =>
                    updateSettings({ ...settings, privacy: e.target.value })
                  }
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="private">Private</option>
                  <option value="contacts">Contacts only</option>
                  <option value="public">Public</option>
                </select>
              </div>

              {/* Dark Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Dark Mode</div>
                  <div className="text-xs text-slate-500">Switch theme</div>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.dark}
                    onChange={(e) =>
                      updateSettings({ ...settings, dark: e.target.checked })
                    }
                    className="sr-only"
                  />
                  <span
                    className={`w-11 h-6 rounded-full relative transition-colors ${
                      settings.dark ? "bg-gray-800" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.dark ? "translate-x-5" : ""
                      }`}
                    />
                  </span>
                </label>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Emergency Contacts Modal */}
      {showECModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">Emergency Contacts</h3>
                <button
                  onClick={() => setShowECModal(false)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <p className="text-xs text-slate-400 mt-2">
                Add the people you'd like to notify in an emergency.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const name = e.target.ecName.value;
                  const phone = e.target.ecPhone.value;
                  const country = e.target.countrySelect.value;
                  const relation = e.target.relationSelect.value;
                  if (name && phone && relation) {
                    saveEmergencyContact({ name, phone, country, relation });
                    e.target.reset();
                  }
                }}
                className="mt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                  <div className="col-span-12 md:col-span-4">
                    <input
                      name="ecName"
                      type="text"
                      placeholder="Name"
                      className="w-full px-3 py-2 border rounded text-slate-700 placeholder-slate-400"
                      required
                    />
                  </div>

                  <div className="col-span-4 md:col-span-2">
                    <select
                      name="countrySelect"
                      className="w-full px-3 py-2 border rounded text-sm text-slate-700"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+81">🇯🇵 +81</option>
                      <option value="+49">🇩🇪 +49</option>
                      <option value="+33">🇫🇷 +33</option>
                      <option value="+971">🇦🇪 +971</option>
                    </select>
                  </div>

                  <div className="col-span-4 md:col-span-3">
                    <input
                      name="ecPhone"
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full px-3 py-2 border rounded text-slate-700 placeholder-slate-400"
                      required
                    />
                  </div>

                  <div className="col-span-4 md:col-span-2">
                    <select
                      name="relationSelect"
                      className="w-full px-3 py-2 border rounded text-sm text-slate-700"
                      required
                    >
                      <option value="">Relation</option>
                      <option value="Friend">Friend</option>
                      <option value="Mother">Mother</option>
                      <option value="Sister">Sister</option>
                      <option value="Brother">Brother</option>
                      <option value="Father">Father</option>
                      <option value="Boyfriend">Boyfriend</option>
                      <option value="Uncle">Uncle</option>
                      <option value="Aunt">Aunt</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="col-span-12 md:col-span-1">
                    <button
                      type="submit"
                      className="w-full px-3 py-2 rounded-md bg-pink-600 hover:bg-pink-700 text-white"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </form>

              <div className="mt-4">
                <h4 className="font-semibold">Saved Contacts</h4>
                <ul className="mt-3 space-y-3">
                  {emergencyContacts.length === 0 ? (
                    <li className="text-xs text-slate-400">
                      No emergency contacts yet.
                    </li>
                  ) : (
                    emergencyContacts.map((contact) => (
                      <li
                        key={contact.id}
                        className="p-3 rounded bg-pink-50 border border-pink-100 flex justify-between items-start"
                      >
                        <div>
                          <div className="font-semibold">{contact.name}</div>
                          <div className="text-sm text-slate-600">
                            Phone: {contact.country} {contact.phone}
                          </div>
                          <div className="text-sm text-slate-600">
                            Relation: {contact.relation}
                          </div>
                        </div>
                        <button
                          onClick={() => removeContact(contact.id)}
                          className="text-red-500 text-sm font-semibold hover:text-red-700"
                        >
                          ✖
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-3">Edit Profile</h3>
              <form onSubmit={handleEditProfile} className="space-y-3">
                <input
                  name="editUsername"
                  type="text"
                  defaultValue={user.username}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Username"
                  required
                />
                <input
                  name="editEmail"
                  type="email"
                  defaultValue={user.email}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Email"
                  required
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-3 py-2 rounded bg-white border hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPwdModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-3">Change Password</h3>
              <form onSubmit={handlePasswordChange} className="space-y-3">
                <input
                  type="password"
                  placeholder="Current password"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                <input
                  type="password"
                  placeholder="New password"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPwdModal(false)}
                    className="px-3 py-2 rounded bg-white border hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Profile;
