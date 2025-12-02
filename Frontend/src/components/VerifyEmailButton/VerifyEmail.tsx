  import { useState } from 'react';
  import Button from '../../components/Button';
  import userApi from '../../apis/users.api';
  import Popup from '../../components/Popup';

  export default function VerifyEmailButton() {
    const [loading, setLoading] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");

    const handleVerify = async () => {
      setLoading(true);
      try {
        const res = await userApi.sendVerifyEmail();

        setPopupMessage(res.data?.message || "Verification email sent successfully");
        setPopupOpen(true);
      } catch (error) {
        console.error(error);
        setPopupMessage("Failed to send verification email");
        setPopupOpen(true);
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        <Button
          variant="secondary"
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Verify email'}
        </Button>

        <Popup
          open={popupOpen}
          message={popupMessage}
          onClose={() => setPopupOpen(false)}
        />
      </>
    );
  }
