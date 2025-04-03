import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
  IonAlert,
} from "@ionic/react";
import { useState } from "react";
import  supabase  from "../supabaseClient"; // Import Supabase client

const UpdatePassword: React.FC = () => {
  const navigation = useIonRouter();
  const [email, setEmail] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // To store specific error messages

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setErrorMessage("Please enter a valid email address.");
      setShowErrorAlert(true);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:8100/it35-lab/forgot-password", // Ensure this matches your setup
    });

    if (error) {
      setErrorMessage(error.message);
      setShowErrorAlert(true);
    } else {
      setShowSuccessAlert(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Reset Password</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="reset-container">
          <h2>Forgot Your Password?</h2>
          <p>Enter your email, and we'll send you a reset link.</p>

          <IonItem className="input-field">
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput
              type="email"
              placeholder="Enter your email"
              value={email}
              onIonInput={(e) => setEmail(e.detail.value!)}
            />
          </IonItem>

          <IonButton expand="full" className="reset-btn" onClick={handleResetPassword}>
            Send Reset Link
          </IonButton>

          <p className="back-to-login">
            <span
              style={{ color: "blue", cursor: "pointer", fontWeight: "bold" }}
              onClick={() => navigation.push("/login", "back")}
            >
              Back to Login
            </span>
          </p>
        </div>

        {/* Success Alert */}
        <IonAlert
          isOpen={showSuccessAlert}
          onDidDismiss={() => navigation.push("/login", "back")}
          header="Success"
          message="Password reset email sent. Check your inbox."
          buttons={["OK"]}
        />

        {/* Error Alert */}
        <IonAlert
          isOpen={showErrorAlert}
          onDidDismiss={() => setShowErrorAlert(false)}
          header="Error"
          message={errorMessage}
          buttons={["OK"]}
        />
      </IonContent>

      <style>
        {`
          .reset-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            padding: 20px;
          }

          .reset-container h2 {
            font-size: 24px;
            margin-bottom: 10px;
          }

          .reset-container p {
            color: gray;
            margin-bottom: 20px;
          }

          .input-field {
            width: 100%;
            max-width: 400px;
            margin-bottom: 15px;
          }

          .reset-btn {
            width: 100%;
            max-width: 400px;
            border-radius: 10px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          }

          .back-to-login {
            margin-top: 10px;
            font-size: 14px;
            text-align: center;
          }
        `}
      </style>
    </IonPage>
  );
};

export default UpdatePassword;
