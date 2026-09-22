import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface AutoLogoutProps {
  timeout: number; // in ms
}

const AutoLogout: React.FC<AutoLogoutProps> = ({ timeout }) => {
  const { logout, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    let timer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        logout();
        window.location.href = "/login";
      }, timeout);
    };

    const activityEvents = ["mousemove", "keydown", "mousedown", "touchstart"];

    activityEvents.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      activityEvents.forEach((event) => window.removeEventListener(event, resetTimer));
      clearTimeout(timer);
    };
  }, [timeout, logout, isAuthenticated]);

  return null;
};

export default AutoLogout;
