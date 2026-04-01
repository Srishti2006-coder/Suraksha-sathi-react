/* eslint-disable */
import React, { useState, useEffect } from "react";
import { userAPI, clearAuthData, isLoggedIn, getCurrentUser } from "../utils/api";

const Profile = ({ setPage }) => {
  // State for user data
  const [user, setUser] = useState({
    name: "User",
    email: "email@example.com",
    phone: "",
    emergencyContacts: [],
    voiceCommand: ""
  });

  // State for emergency contacts
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  
  // State for modals
  const [showECModal, setShowECModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPwdModal, setShowPwdModal] = useState(false);
  
  // State for contact form
  const [newContact, setNewContact] = useState({ name: "", phone: "", relation: "" });
  
  // State for SOS
  const [sosCmd, setSosCmd] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("Click to start voice listener");
  const [sosHeard, setSosHeard] = useState("");
  
  // State for stats
  const [stats, setStats] = useState({
    routes: 0,
    reports: 0,
    alerts: 0
  });

  // State for activity
  const [activities, setActivities] = useState([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load user profile on mount
  useEffect(() => {
    if (!isLoggedIn()) {
      setPage("login");
      return;
    }
    
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getProfile();
      setUser(data.user);
      setEmergencyContacts(data.user.emergencyContacts || []);
      setStats({
        routes: data.user.safeRoutesCount || 0,
        reports: data.user.reportsCount || 0,
        alerts: data.user.sosCount || 0
      });
      setSosCmd(data.user.voiceCommand || "");
    } catch (err) {
      console.error("Error loading profile:", err);
      if (err.message.includes("token") || err.message.includes("login")) {
        clearAuthData();
        setPage("login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthData();
    setPage("home");
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) return;

    const updatedContacts = [...emergencyContacts, { ...newContact, id: Date.now() }];
    
    try {
      await userAPI.updateProfile({ emergencyContacts: updatedContacts });
      setEmergencyContacts(updatedContacts);
      setNewContact({ name: "", phone: "", relation: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteContact = async (id) => {
    const updatedContacts = emergencyContacts.filter(c => c.id !== id);
    
    try {
      await userAPI.updateProfile({ emergencyContacts: updatedContacts });
      setEmergencyContacts(updatedContacts);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveVoiceCommand = async () => {
    try {
      await userAPI.updateProfile({ voiceCommand: sosCmd });
      alert("Voice command saved!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("Password change not implemented in demo");
    setShowPwdModal(false);
  };

  // Voice recognition functions
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setStatus("Voice recognition not supported in this browser");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onstart = () => {
      setIsListening(true);
      setStatus("Listening... Say your command");
    };
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .join("");
      
      setSosHeard(transcript);
      
      // Check if spoken text contains the saved command
      if (sosCmd && transcript.toLowerCase().includes(sosCmd.toLowerCase())) {
        triggerSOS();
      }
    };
    
    recognition.onerror = (event) => {
      setStatus("Error: " + event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
      if (sosHeard) {
        setStatus("Heard: " + sosHeard);
      }
    };
    
    recognition.start();
  };

  const triggerSOS = () => {
    // Play alarm sound
    const audio = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU");
    audio.play().catch(() => {});
    
    alert("🚨 SOS TRIGGERED! Emergency contacts will be notified.");
    setStatus("SOS Triggered!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <main className="flex-grow p-4 md:p-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.name || "User"}</h2>
            <p className="text-slate-500">{user.email}</p>
            {user.phone && <p className="text-slate-500">{user.phone}</p>}
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Edit Profile
          </button>
          <button
            onClick={() => setShowPwdModal(true)}
            className="px-4 py-2 bg-white border rounded hover:bg-slate-50"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600">{stats.routes}</div>
          <div className="text-sm text-slate-500">Safe Routes</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600">{stats.reports}</div>
          <div className="text-sm text-slate-500">Reports</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600">{stats.alerts}</div>
          <div className="text-sm text-slate-500">SOS Alerts</div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Emergency Contacts</h3>
          <button
            onClick={() => setShowECModal(true)}
            className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
          >
            Add Contact
          </button>
        </div>
        
        {emergencyContacts.length === 0 ? (
          <p className="text-slate-500">No emergency contacts added</p>
        ) : (
          <div className="space-y-2">
            {emergencyContacts.map((contact) => (
              <div key={contact.id || contact._id} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                <div>
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-sm text-slate-500">{contact.phone} {contact.relation && `(${contact.relation})`}</div>
                </div>
                <button
                  onClick={() => handleDeleteContact(contact.id || contact._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Voice SOS */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="font-semibold text-lg mb-4">Voice SOS Command</h3>
        <p className="text-sm text-slate-500 mb-4">
          Set a voice command that will trigger SOS when spoken
        </p>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={sosCmd}
            onChange={(e) => setSosCmd(e.target.value)}
            placeholder="Enter voice command (e.g., help me)"
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            onClick={handleSaveVoiceCommand}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
        
        <button
          onClick={isListening ? () => setIsListening(false) : startListening}
          className={`w-full py-3 rounded font-medium ${
            isListening 
              ? "bg-red-500 text-white animate-pulse" 
              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
          }`}
        >
          {isListening ? "🛑 Stop Listening" : "🎤 Start Voice Listener"}
        </button>
        
        {status && (
          <p className="mt-2 text-sm text-center text-slate-500">{status}</p>
        )}
        
        {sosHeard && (
          <p className="mt-2 text-sm text-center text-indigo-600">Heard: "{sosHeard}"</p>
        )}
      </div>

      {/* Emergency Contact Modal */}
      {showECModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-3">Add Emergency Contact</h3>
              <form onSubmit={handleAddContact} className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone (e.g., +919876543210)"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                <select
                  value={newContact.relation}
                  onChange={(e) => setNewContact({...newContact, relation: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Select Relation</option>
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Friend">Friend</option>
                  <option value="Other">Other</option>
                </select>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowECModal(false)}
                    className="px-3 py-2 rounded bg-white border hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
              </form>
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
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                try {
                  await userAPI.updateProfile({
                    name: formData.get("name"),
                    phone: formData.get("phone")
                  });
                  setUser({...user, name: formData.get("name"), phone: formData.get("phone")});
                  setShowEditModal(false);
                } catch (err) {
                  setError(err.message);
                }
              }} className="space-y-3">
                <input
                  name="name"
                  defaultValue={user.name}
                  type="text"
                  placeholder="Name"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                <input
                  name="phone"
                  defaultValue={user.phone}
                  type="tel"
                  placeholder="Phone"
                  className="w-full px-3 py-2 border rounded"
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
