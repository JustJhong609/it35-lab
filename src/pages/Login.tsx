import {
  IonButton,
  IonContent,
  IonInput,
  IonPage,
  useIonRouter,
  IonInputPasswordToggle,
  IonAlert,
  IonIcon
} from "@ionic/react";
import { useState } from "react";
import supabase from "../utils/supabaseClient";
import { lockClosed, mail, skull } from "ionicons/icons";

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const doLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setAlertMessage("ACCESS DENIED: " + error.message);
      setShowAlert(true);
    } else {
      navigation.push("/it35-lab/app", "forward", "replace");
    }

    setLoading(false);
  };

  return (
    <IonPage className="login-page">
      <IonContent fullscreen className="ion-padding" scrollY={false}>
        {/* Cyberpunk background elements */}
        <div className="cyberpunk-bg">
          <div className="grid-lines"></div>
          <div className="neon-circle"></div>
          <div className="scanline"></div>
          <div className="glitch-overlay"></div>
          
          {/* Floating holographic elements */}
          <div className="hologram-1"></div>
          <div className="hologram-2"></div>
          <div className="hologram-3"></div>
          
          {/* Binary rain effect */}
          <div className="binary-rain">
            {Array.from({ length: 50 }).map((_, i) => (
              <div key={i} className="binary-column" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s` }}>
                {Array.from({ length: 20 }).map((_, j) => (
                  <span key={j} style={{ animationDelay: `${Math.random() * 2}s` }}>
                    {Math.round(Math.random())}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="form-container">
          <div className="cyber-card">
            {/* Cyberpunk title with glitch effect */}
            <div className="title-container">
              <h1 className="cyber-title">
                <span className="cyber-text" data-text="SYSTEM ACCESS">SYSTEM ACCESS</span>
                <span className="glitch"></span>
                <span className="scan"></span>
              </h1>
              <IonIcon icon={skull} className="title-icon" />
            </div>
            
            <p className="cyber-subtitle">AUTHENTICATION REQUIRED</p>

            {/* Futuristic input fields */}
            <div className="input-field">
              <IonInput 
                className="cyber-input"
                label="USER IDENTIFIER" 
                labelPlacement="stacked" 
                fill="outline" 
                type="email" 
                placeholder="ENTER YOUR EMAIL" 
                value={email} 
                onIonInput={(e) => setEmail(e.detail.value!)} 
              >
                <IonIcon slot="start" icon={mail} className="input-icon" />
              </IonInput>
              <span className="input-highlight"></span>
              <span className="input-border"></span>
            </div>

            <div className="input-field">
              <IonInput 
                className="cyber-input"
                label="SECURITY CODE" 
                labelPlacement="stacked" 
                fill="outline" 
                type="password" 
                placeholder="ENTER YOUR PASSWORD" 
                value={password} 
                onIonInput={(e) => setPassword(e.detail.value!)} 
              >
                <IonIcon slot="start" icon={lockClosed} className="input-icon" />
                <IonInputPasswordToggle slot="end" className="toggle-icon" />
              </IonInput>
              <span className="input-highlight"></span>
              <span className="input-border"></span>
            </div>

            <IonButton
              className="cyber-button"
              expand="block"
              onClick={doLogin}
              disabled={loading}
            >
              <span className="button-text">{loading ? "AUTHENTICATING..." : "ACCESS SYSTEM"}</span>
              <span className="button-glow"></span>
              <span className="button-particle"></span>
            </IonButton>

            <div className="link-container">
              <IonButton
                className="cyber-link"
                routerLink="/register"
                fill="clear"
              >
                <span className="link-text">NO CREDENTIALS? </span> 
                
                <span className="neon-text"> REQUEST ACCESS</span>
              </IonButton>
            </div>
          </div>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="ACCESS DENIED"
          message={alertMessage}
          buttons={['ACKNOWLEDGE']}
          cssClass="cyber-alert"
        />

        <style>{`
          /* Cyberpunk color palette */
          :root {
            --neon-pink: #ff2a6d;
            --neon-blue: #05d9e8;
            --neon-purple: #d300c5;
            --neon-green: #00ff9d;
            --dark-bg: #0d0221;
            --darker-bg: #050110;
            --grid-color: rgba(5, 217, 232, 0.1);
            --text-glow: 0 0 10px var(--neon-blue), 0 0 20px var(--neon-blue);
            --pink-glow: 0 0 10px var(--neon-pink), 0 0 20px var(--neon-pink);
          }
          
          /* Main Page Styles */
          .login-page {
            --ion-background-color: transparent;
          }
          
          /* Cyberpunk background */
          .cyberpunk-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            overflow: hidden;
            background: linear-gradient(135deg, var(--darker-bg), var(--dark-bg));
            animation: gradientBG 15s ease infinite;
          }
          
          /* Grid lines effect */
          .grid-lines {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
              linear-gradient(var(--grid-color) 1px, transparent 1px),
              linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
            background-size: 50px 50px;
            opacity: 0.5;
          }
          
          /* Neon circle animation */
          .neon-circle {
            position: absolute;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(5, 217, 232, 0.2) 0%, transparent 70%);
            top: 50%;
            left: 20%;
            filter: blur(10px);
            animation: pulse 8s infinite alternate;
          }
          
          /* Scanline effect */
          .scanline {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              to bottom,
              transparent 95%,
              rgba(5, 217, 232, 0.3) 96%,
              transparent 97%
            );
            background-size: 100% 10px;
            animation: scanline 8s linear infinite;
            pointer-events: none;
          }
          
          /* Glitch overlay effect */
          .glitch-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.05"/></svg>');
            opacity: 0.1;
            pointer-events: none;
          }
          
          /* Holographic floating elements */
          .hologram-1, .hologram-2, .hologram-3 {
            position: absolute;
            border-radius: 50%;
            filter: blur(20px);
            animation: float 15s infinite ease-in-out;
          }
          
          .hologram-1 {
            width: 400px;
            height: 400px;
            top: -100px;
            left: -100px;
            animation-delay: 0s;
            background: radial-gradient(circle, rgba(255, 42, 109, 0.15) 0%, transparent 70%);
          }
          
          .hologram-2 {
            width: 300px;
            height: 300px;
            bottom: -50px;
            right: -50px;
            animation-delay: 5s;
            background: radial-gradient(circle, rgba(5, 217, 232, 0.15) 0%, transparent 70%);
          }
          
          .hologram-3 {
            width: 200px;
            height: 200px;
            top: 30%;
            right: 10%;
            animation-delay: 8s;
            background: radial-gradient(circle, rgba(211, 0, 197, 0.15) 0%, transparent 70%);
          }
          
          /* Binary rain effect */
          .binary-rain {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            opacity: 0.15;
          }
          
          .binary-column {
            position: absolute;
            top: -100%;
            display: flex;
            flex-direction: column;
            color: var(--neon-green);
            font-family: monospace;
            font-size: 12px;
            line-height: 1.2;
            animation: binaryFall 10s linear infinite;
          }
          
          .binary-column span {
            opacity: 0;
            animation: binaryFade 1s infinite alternate;
          }
          
          /* Form Container */
          .form-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
          }
          
          /* Cyberpunk card */
          .cyber-card {
            background: rgba(13, 2, 33, 0.7);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 4px;
            border: 1px solid var(--neon-blue);
            box-shadow: 
              0 0 15px rgba(5, 217, 232, 0.3),
              0 0 30px rgba(5, 217, 232, 0.2),
              inset 0 0 10px rgba(5, 217, 232, 0.1);
            padding: 30px;
            width: 100%;
            max-width: 400px;
            position: relative;
            overflow: hidden;
            animation: fadeIn 0.5s ease-out;
          }
          
          .cyber-card::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, var(--neon-blue), var(--neon-pink), var(--neon-purple));
            z-index: -1;
            filter: blur(5px);
            opacity: 0.7;
            animation: borderGlow 3s linear infinite;
          }
          
          /* Title styles */
          .title-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 10px;
          }
          
          .cyber-title {
            color: var(--neon-blue);
            text-align: center;
            margin: 0 10px 0 0;
            font-weight: 700;
            font-size: 1.8rem;
            text-transform: uppercase;
            letter-spacing: 3px;
            position: relative;
            text-shadow: var(--text-glow);
          }
          
          .title-icon {
            color: var(--neon-pink);
            font-size: 2rem;
            filter: drop-shadow(0 0 5px var(--neon-pink));
          }
          
          .cyber-text {
            position: relative;
          }
          
          .cyber-text::before {
            content: attr(data-text);
            position: absolute;
            left: 0;
            color: var(--neon-pink);
            width: 100%;
            clip: rect(0, 900px, 0, 0);
            animation: glitch-effect 3s infinite linear alternate-reverse;
          }
          
          .glitch {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              to bottom,
              transparent 65%,
              rgba(255, 42, 109, 0.3) 66%,
              rgba(255, 42, 109, 0.3) 67%,
              transparent 68%
            );
            animation: glitch-scan 8s linear infinite;
          }
          
          .scan {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: var(--neon-blue);
            transform: scaleX(0);
            transform-origin: left;
            animation: scanline-anim 4s linear infinite;
            box-shadow: 0 0 10px var(--neon-blue);
          }
          
          .cyber-subtitle {
            color: rgba(255, 255, 255, 0.7);
            text-align: center;
            margin-bottom: 30px;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
          }
          
          /* Input field styles */
          .input-field {
            position: relative;
            margin-bottom: 25px;
          }
          
          .cyber-input {
            --background: rgba(5, 217, 232, 0.05);
            --color: white;
            --border-color: var(--neon-blue);
            --border-radius: 0;
            --highlight-color-focused: var(--neon-pink);
            --padding-start: 15px;
            --padding-end: 15px;
            --placeholder-color: rgba(255, 255, 255, 0.4);
            --placeholder-opacity: 1;
            border-left: 3px solid var(--neon-blue);
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 0.9rem;
          }
          
          .cyber-input::part(label) {
            color: var(--neon-blue);
            font-weight: 600;
            letter-spacing: 1px;
            font-size: 0.8rem;
            margin-bottom: 8px;
          }
          
          .cyber-input::part(native) {
            padding-top: 15px;
            padding-bottom: 15px;
          }
          
          .input-icon {
            color: var(--neon-blue);
            margin-right: 10px;
            font-size: 1.2rem;
          }
          
          .toggle-icon {
            color: var(--neon-pink);
          }
          
          .input-highlight {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: var(--neon-pink);
            transition: width 0.3s ease;
          }
          
          .input-border {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--neon-blue), transparent);
          }
          
          .cyber-input:focus-within ~ .input-highlight {
            width: 100%;
          }
          
          /* Cyberpunk button styles */
          .cyber-button {
            --background: transparent;
            --border-radius: 0;
            --box-shadow: none;
            position: relative;
            height: 50px;
            margin-top: 30px;
            margin-bottom: 20px;
            overflow: hidden;
            border: 1px solid var(--neon-blue);
            background: rgba(5, 217, 232, 0.1) !important;
            transition: all 0.3s ease;
          }
          
          .cyber-button:hover {
            background: rgba(5, 217, 232, 0.2) !important;
            box-shadow: 0 0 15px var(--neon-blue);
          }
          
          .button-text {
            position: relative;
            z-index: 1;
            color: white;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
          }
          
          .button-glow {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, var(--neon-blue), transparent);
            transform: translateX(-100%);
            transition: transform 0.6s ease;
          }
          
          .cyber-button:hover .button-glow {
            transform: translateX(100%);
          }
          
          .button-particle {
            position: absolute;
            width: 10px;
            height: 10px;
            background: var(--neon-pink);
            border-radius: 50%;
            opacity: 0;
            animation: particle 4s infinite;
          }
          
          /* Link container */
          .link-container {
            display: flex;
            justify-content: center;
            margin-top: 20px;
          }
          
          /* Sign up link styles */
          .cyber-link {
            --color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
            letter-spacing: 1px;
            text-transform: uppercase;
            --background: transparent;
            --box-shadow: none;
            margin: 0;
          }
          
          .link-text {
            color: rgba(255, 255, 255, 0.7);
          }
          
          .neon-text {
            color: var(--neon-pink);
            text-shadow: 0 0 5px var(--neon-pink);
            transition: all 0.3s ease;
          }
          
          .cyber-link:hover .neon-text {
            text-shadow: var(--pink-glow);
          }
          
          /* Cyberpunk alert styles */
          .cyber-alert {
            --backdrop-opacity: 0.9;
            --background: var(--dark-bg);
            --border-radius: 0;
            --box-shadow: 0 0 20px var(--neon-pink);
            --header-color: var(--neon-blue);
            --message-color: rgba(255, 255, 255, 0.8);
            --button-background: var(--neon-pink);
            --button-color: black;
            border: 1px solid var(--neon-blue);
            animation: alertPop 0.3s ease-out;
          }
          
          .cyber-alert .alert-button-group {
            justify-content: center;
          }
          
          .cyber-alert .alert-button {
            --border-radius: 0;
            --background: var(--neon-pink);
            --color: black;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            min-width: 150px;
            border: 1px solid var(--neon-blue);
          }
          
          /* Animations */
          @keyframes gradientBG {
            0% { background-position: 0% 50% }
            50% { background-position: 100% 50% }
            100% { background-position: 0% 50% }
          }
          
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.1); opacity: 0.5; }
            100% { transform: scale(1); opacity: 0.3; }
          }
          
          @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
          
          @keyframes float {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(50px, 50px) rotate(5deg); }
            50% { transform: translate(0, 100px) rotate(0deg); }
            75% { transform: translate(-50px, 50px) rotate(-5deg); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes borderGlow {
            0% { opacity: 0.3; }
            50% { opacity: 0.7; }
            100% { opacity: 0.3; }
          }
          
          @keyframes glitch-effect {
            0% { clip: rect(30px, 9999px, 10px, 0) }
            10% { clip: rect(20px, 9999px, 80px, 0) }
            20% { clip: rect(50px, 9999px, 30px, 0) }
            30% { clip: rect(10px, 9999px, 60px, 0) }
            40% { clip: rect(40px, 9999px, 20px, 0) }
            50% { clip: rect(70px, 9999px, 50px, 0) }
            60% { clip: rect(20px, 9999px, 10px, 0) }
            70% { clip: rect(30px, 9999px, 70px, 0) }
            80% { clip: rect(60px, 9999px, 40px, 0) }
            90% { clip: rect(10px, 9999px, 30px, 0) }
            100% { clip: rect(0, 9999px, 0, 0) }
          }
          
          @keyframes glitch-scan {
            0% { opacity: 0.1; }
            50% { opacity: 0.3; }
            100% { opacity: 0.1; }
          }
          
          @keyframes scanline-anim {
            0% { transform: scaleX(0); }
            10% { transform: scaleX(1); }
            100% { transform: scaleX(1); }
          }
          
          @keyframes particle {
            0% { transform: translate(0, 0); opacity: 0; }
            10% { opacity: 1; }
            100% { transform: translate(var(--x), var(--y)); opacity: 0; }
          }
          
          @keyframes alertPop {
            0% { transform: scale(0.8); opacity: 0; }
            80% { transform: scale(1.05); }
            100% { transform: scale(1); opacity: 1; }
          }
          
          @keyframes binaryFall {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
          }
          
          @keyframes binaryFade {
            0% { opacity: 0; }
            20% { opacity: 0.8; }
            50% { opacity: 1; }
            80% { opacity: 0.8; }
            100% { opacity: 0; }
          }
        `}</style>
      </IonContent>
    </IonPage>
  );
};

export default Login;