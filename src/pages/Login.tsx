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
  IonToolbar,
} from "@ionic/react";
import { eye, eyeOff } from "ionicons/icons";
import { useState } from "react";
import supabase from "../utils/supabaseClient";

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const doLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Login failed: " + error.message);
    } else {
      alert("Login successful!");
      navigation.push("/it35-lab/app", "forward", "replace");
    }

    setLoading(false);
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <div className="login-container">
        <img src="/logo.png" alt="NBSC Logo" className="logo-img" />
          <h2 className="glow-text">Welcome to NBSC-ICS !</h2>
          <p className="subtle-text">Please login to continue</p>

          <IonItem className="input-field glass">
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput
              type="email"
              placeholder="Enter your email"
              value={email}
              onIonInput={(e) => setEmail(e.detail.value!)}
            />
          </IonItem>

          <IonItem className="input-field glass">
            <IonLabel position="stacked">Password</IonLabel>
            <IonInput
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onIonInput={(e) => setPassword(e.detail.value!)}
            />
            <IonButton
              fill="clear"
              slot="end"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
            >
              <IonIcon icon={showPassword ? eyeOff : eye} />
            </IonButton>
          </IonItem>

          <IonButton
            expand="full"
            className="login-btn bounce"
            onClick={doLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </IonButton>

          <p className="forgot-password">
            <span
              onClick={() => navigation.push("/forgot-password", "forward")}
            >
              Forgot Password?
            </span>
          </p>

          <p className="register-link">
            Way account? Hala Lupad{" "}
            <span onClick={() => navigation.push("/register", "forward")}>
              Sign up
            </span>
          </p>
        </div>
      </IonContent>

      <style>
        {`
    .login-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 20px;
      background: linear-gradient(135deg, #1e1e2f, #2c3e50);
      color: #fff;
    }

    .glow-text {
      font-size: 28px;
      margin-bottom: 10px;
      text-shadow: 0 0 8px #58a6ff;
    }

    .subtle-text {
      color: #c5c5c5;
      margin-bottom: 20px;
    }

    .input-field {
      width: 100%;
      max-width: 400px;
      margin-bottom: 15px;
      border-radius: 15px;
      overflow: hidden;
      position: relative;
      transition: all 0.3s ease;
    }

    .input-field:hover {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(88, 166, 255, 0.4);
      box-shadow: 0 0 8px rgba(88, 166, 255, 0.3);
    }

    .glass {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .password-toggle {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }

    .login-btn {
      width: 100%;
      max-width: 400px;
      margin-top: 10px;
      border-radius: 20px;
      background: linear-gradient(90deg, #4e9af1, #007bff);
      color: white;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
      transition: all 0.3s ease;
    }

    .login-btn:hover {
      transform: scale(1.03);
      box-shadow: 0 6px 18px rgba(0, 123, 255, 0.6);
    }

    .bounce {
      animation: bounce-in 0.8s ease;
    }

    @keyframes bounce-in {
      0% { transform: scale(0.95); opacity: 0; }
      60% { transform: scale(1.05); opacity: 1; }
      100% { transform: scale(1); }
    }

    .forgot-password,
    .register-link {
      font-size: 14px;
      margin-top: 10px;
      text-align: center;
    }

    .forgot-password span,
    .register-link span {
      color: #66b3ff;
      font-weight: bold;
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .forgot-password span:hover,
    .register-link span:hover {
      color: #0090ff;
      text-decoration: underline;
    }
      .logo-img {
      width: 100px;
      height: auto;
      margin-bottom: 20px;
      animation: fadeIn 1s ease-in-out;
    }

    @keyframes fadeIn {
      0% { opacity: 0; transform: translateY(-10px); }
      100% { opacity: 1; transform: translateY(0); }
    }
  `}
      </style>
    </IonPage>
  );
};

export default Login;
