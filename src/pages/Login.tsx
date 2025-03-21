import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  useIonRouter,
  IonIcon,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
} from "@ionic/react";
import { eye, eyeOff } from "ionicons/icons";
import { useState } from "react";
import { supabase } from "../supabaseClient";

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Login Function
  const doLogin = async () => {
    setError(""); // Clear previous errors

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("Login Response:", data); // Debugging

    if (error) {
      setError(error.message); // Display error if login fails
    } else {
      navigation.push("/it35-lab/app", "forward", "replace"); // Navigate on success
    }
  };

  return (
    <IonPage>
      <IonHeader></IonHeader>
      <IonContent className="ion-padding" fullscreen>
        {/* Centered Layout */}
        <IonGrid className="ion-justify-content-center ion-align-items-center">
          <IonRow className="ion-justify-content-center ion-align-items-center">
            <IonCol size="6" className="ion-text-center">
              <IonImg src="/logo1.png" className="logo" />
            </IonCol>
            <IonCol size="6" className="ion-text-center">
              <IonImg src="/logo2.png" className="logo" />
            </IonCol>
          </IonRow>

          <IonRow className="ion-justify-content-center">
            <IonCol size="12" className="ion-text-center">
              <h2>Welcome to NBSC-ICS!</h2>
              <p>Please lupad to continue</p>
            </IonCol>
          </IonRow>

          {/* Error Message */}
          {error && (
            <IonRow className="ion-justify-content-center">
              <IonCol size="12" className="ion-text-center">
                <IonText color="danger">{error}</IonText>
              </IonCol>
            </IonRow>
          )}

          {/* Login Form */}
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="8">
              <IonItem>
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onIonInput={(e) => setEmail(e.detail.value!)}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Password</IonLabel>
                <IonInput
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onIonInput={(e) => setPassword(e.detail.value!)}
                />
                <IonButton fill="clear" slot="end" onClick={() => setShowPassword(!showPassword)}>
                  <IonIcon icon={showPassword ? eyeOff : eye} />
                </IonButton>
              </IonItem>

              <IonButton expand="full" className="login-btn" onClick={doLogin}>
                Login
              </IonButton>

              <IonRow className="ion-justify-content-center ion-padding-top">
              <IonText>Way account? Hala Lupad </IonText>
  <IonText
    color="primary"
    className="ion-text-bold"
    onClick={() => navigation.push("/register", "forward")}
    style={{ cursor: "pointer", marginLeft: "4px" }} // Ensures spacing
  >
    Sign up
  </IonText>
              </IonRow>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;
