import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/AdminDashboard";
import RoomDetail from "./pages/RoomDetail";
import MyRoomsPage from "./pages/MyRoomsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import CreateRoomModal from "./components/ui/CreateRoomModal";

export default function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const navigate = (page, data = null) => {
    setCurrentPage(page);
    if (data) setSelectedRoom(data);
    window.scrollTo(0, 0);
  };

  // When a room is created from the modal, go straight into it
  const handleRoomCreated = (newRoom) => {
    setSelectedRoom(newRoom);
    setCurrentPage("room");
    setShowCreateModal(false);
    window.scrollTo(0, 0);
  };

  const sharedProps = {
    onNavigate: navigate,
    onCreateRoom: () => setShowCreateModal(true),
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
      {currentPage === "landing"       && <LandingPage {...sharedProps} />}
      {currentPage === "login"         && <LoginPage onNavigate={navigate} />}
      {currentPage === "home"          && <HomePage {...sharedProps} />}
      {currentPage === "admin"         && <AdminDashboard {...sharedProps} />}
      {currentPage === "room"          && <RoomDetail onNavigate={navigate} room={selectedRoom} />}
      {currentPage === "myrooms"       && <MyRoomsPage {...sharedProps} />}
      {currentPage === "analytics"     && <AnalyticsPage onNavigate={navigate} />}
      {currentPage === "notifications" && <NotificationsPage onNavigate={navigate} />}
      {currentPage === "settings"      && <SettingsPage onNavigate={navigate} />}
      {currentPage === "profile"       && <SettingsPage onNavigate={navigate} />}
      {showCreateModal && (
        <CreateRoomModal
          onClose={() => setShowCreateModal(false)}
          onRoomCreated={handleRoomCreated}
        />
      )}
    </div>
  );
}
