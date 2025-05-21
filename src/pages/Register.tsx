import React, { useState } from 'react';
import {
    IonButton,
    IonContent,
    IonInput,
    IonInputPasswordToggle,
    IonPage,
    IonText,
    IonModal,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonAlert,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon
} from '@ionic/react';
import supabase from '../utils/supabaseClient';
import bcrypt from 'bcryptjs';
import { person, mail, lockClosed, skull, arrowBack } from 'ionicons/icons';

const AlertBox: React.FC<{ message: string; isOpen: boolean; onClose: () => void }> = ({ message, isOpen, onClose }) => {
  return (
    <IonAlert
      isOpen={isOpen}
      onDidDismiss={onClose}
      header="ACCESS DENIED"
      message={message}
      buttons={['ACKNOWLEDGE']}
      cssClass="cyber-alert"
      backdropDismiss={false}
      animated={true}
    />
  );
};

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const handleOpenVerificationModal = () => {
        if (!email.endsWith("@nbsc.edu.ph")) {
            setAlertMessage("Only @nbsc.edu.ph emails are allowed to register.");
            setShowAlert(true);
            return;
        }

        if (password !== confirmPassword) {
            setAlertMessage("Passwords do not match.");
            setShowAlert(true);
            return;
        }

        setShowVerificationModal(true);
    };

    const doRegister = async () => {
        setShowVerificationModal(false);
    
        try {
            const { data, error } = await supabase.auth.signUp({ email, password });
    
            if (error) {
                throw new Error("Account creation failed: " + error.message);
            }
    
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
    
            const { error: insertError } = await supabase.from("users").insert([
                {
                    username,
                    user_email: email,
                    user_firstname: firstName,
                    user_lastname: lastName,
                    user_password: hashedPassword,
                },
            ]);
    
            if (insertError) {
                throw new Error("Failed to save user data: " + insertError.message);
            }
    
            setShowSuccessModal(true);
        } catch (err) {
            if (err instanceof Error) {
                setAlertMessage(err.message);
            } else {
                setAlertMessage("An unknown error occurred.");
            }
            setShowAlert(true);
        }
    };
    
    return (
        <IonPage className="register-page">
            <IonContent className='ion-padding' fullscreen scrollY={false}>
                {/* Cyberpunk background elements */}
                <div className="cyberpunk-bg">
                    <div className="grid-lines"></div>
                    <div className="neon-circle"></div>
                    <div className="scanline"></div>
                    
                    {/* Floating holographic elements */}
                    <div className="hologram-1"></div>
                    <div className="hologram-2"></div>
                    <div className="hologram-3"></div>
                </div>

                <IonGrid className="form-container">
                    <IonRow className="ion-justify-content-center">
                        <IonCol size="12" sizeMd="10" sizeLg="8" sizeXl="6">
                            <div className="cyber-card">
                                <div className="title-container">
                                    <h1 className="cyber-title">
                                        <span className="cyber-text" data-text="NEW USER REGISTRATION">NEW USER REGISTRATION</span>
                                    </h1>
                                    <IonIcon icon={skull} className="title-icon" />
                                </div>
                                
                                <p className="cyber-subtitle">CREATE YOUR SYSTEM ACCOUNT</p>

                                <div className="form-grid">
                                    <div className="input-field">
                                        <IonInput 
                                            className="cyber-input"
                                            label="USER IDENTIFIER" 
                                            labelPlacement="stacked" 
                                            fill="outline" 
                                            type="text" 
                                            placeholder="ENTER UNIQUE USERNAME" 
                                            value={username} 
                                            onIonChange={e => setUsername(e.detail.value!)} 
                                        >
                                            <IonIcon slot="start" icon={person} className="input-icon" />
                                        </IonInput>
                                        <span className="input-highlight"></span>
                                        <span className="input-border"></span>
                                    </div>
                                    
                                    <div className="input-field">
                                        <IonInput 
                                            className="cyber-input"
                                            label="FIRST DESIGNATION" 
                                            labelPlacement="stacked" 
                                            fill="outline" 
                                            type="text" 
                                            placeholder="ENTER FIRST NAME" 
                                            value={firstName} 
                                            onIonChange={e => setFirstName(e.detail.value!)} 
                                        />
                                        <span className="input-highlight"></span>
                                        <span className="input-border"></span>
                                    </div>
                                    
                                    <div className="input-field">
                                        <IonInput 
                                            className="cyber-input"
                                            label="LAST DESIGNATION" 
                                            labelPlacement="stacked" 
                                            fill="outline" 
                                            type="text" 
                                            placeholder="ENTER LAST NAME" 
                                            value={lastName} 
                                            onIonChange={e => setLastName(e.detail.value!)} 
                                        />
                                        <span className="input-highlight"></span>
                                        <span className="input-border"></span>
                                    </div>
                                    
                                    <div className="input-field">
                                        <IonInput 
                                            className="cyber-input"
                                            label="AUTHENTICATION ID" 
                                            labelPlacement="stacked" 
                                            fill="outline" 
                                            type="email" 
                                            placeholder="@nbsc.edu.ph" 
                                            value={email} 
                                            onIonChange={e => setEmail(e.detail.value!)} 
                                        >
                                            <IonIcon slot="start" icon={mail} className="input-icon" />
                                        </IonInput>
                                        <span className="input-highlight"></span>
                                        <span className="input-border"></span>
                                    </div>
                                    
                                    <div className="input-field">
                                        <IonInput 
                                            className="cyber-input"
                                            label="ACCESS CODE" 
                                            labelPlacement="stacked" 
                                            fill="outline" 
                                            type="password" 
                                            placeholder="ENTER PASSWORD" 
                                            value={password} 
                                            onIonChange={e => setPassword(e.detail.value!)} 
                                        >
                                            <IonIcon slot="start" icon={lockClosed} className="input-icon" />
                                            <IonInputPasswordToggle slot="end" className="toggle-icon" />
                                        </IonInput>
                                        <span className="input-highlight"></span>
                                        <span className="input-border"></span>
                                    </div>
                                    
                                    <div className="input-field">
                                        <IonInput 
                                            className="cyber-input"
                                            label="CONFIRM ACCESS CODE" 
                                            labelPlacement="stacked" 
                                            fill="outline" 
                                            type="password" 
                                            placeholder="CONFIRM PASSWORD" 
                                            value={confirmPassword} 
                                            onIonChange={e => setConfirmPassword(e.detail.value!)} 
                                        >
                                            <IonIcon slot="start" icon={lockClosed} className="input-icon" />
                                            <IonInputPasswordToggle slot="end" className="toggle-icon" />
                                        </IonInput>
                                        <span className="input-highlight"></span>
                                        <span className="input-border"></span>
                                    </div>
                                </div>

                                <IonButton
                                    className="cyber-button"
                                    onClick={handleOpenVerificationModal} 
                                    expand="block"
                                >
                                    <span className="button-text">REQUEST ACCESS</span>
                                    <span className="button-glow"></span>
                                    <span className="button-particle"></span>
                                </IonButton>
                                
                                <div className="link-container">
                                    <IonButton 
                                        className="cyber-link"
                                        routerLink="/it35-lab" 
                                        fill="clear"
                                    >
                                        <IonIcon icon={arrowBack} slot="start" />
                                        <span className="link-text">EXISTING USER? </span>
                                        <span className="neon-text">AUTHENTICATE</span>
                                    </IonButton>
                                </div>
                            </div>
                        </IonCol>
                    </IonRow>
                </IonGrid>

                {/* Verification Modal */}
                <IonModal 
                    isOpen={showVerificationModal} 
                    onDidDismiss={() => setShowVerificationModal(false)}
                    className="cyber-modal"
                >
                    <IonContent className="ion-padding">
                        <div className="cyber-card modal-card">
                            <IonCard className="verification-card">
                                <IonCardHeader>
                                    <div className="title-container">
                                        <h1 className="cyber-title">
                                            <span className="cyber-text" data-text="CONFIRM DETAILS">CONFIRM DETAILS</span>
                                        </h1>
                                        <IonIcon icon={skull} className="title-icon" />
                                    </div>
                                    <div className="cyber-divider"></div>
                                    
                                    <IonCardSubtitle className="cyber-detail-label">USER IDENTIFIER</IonCardSubtitle>
                                    <IonCardTitle className="cyber-detail-value">{username}</IonCardTitle>

                                    <IonCardSubtitle className="cyber-detail-label">AUTHENTICATION ID</IonCardSubtitle>
                                    <IonCardTitle className="cyber-detail-value">{email}</IonCardTitle>

                                    <IonCardSubtitle className="cyber-detail-label">FULL DESIGNATION</IonCardSubtitle>
                                    <IonCardTitle className="cyber-detail-value">{firstName} {lastName}</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <div className="modal-buttons">
                                        <IonButton 
                                            className="cyber-button-outline"
                                            onClick={() => setShowVerificationModal(false)}
                                        >
                                            <span className="button-text">CANCEL</span>
                                        </IonButton>
                                        <IonButton 
                                            className="cyber-button"
                                            onClick={doRegister}
                                        >
                                            <span className="button-text">CONFIRM</span>
                                            <span className="button-glow"></span>
                                        </IonButton>
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        </div>
                    </IonContent>
                </IonModal>

                {/* Success Modal */}
                <IonModal 
                    isOpen={showSuccessModal} 
                    onDidDismiss={() => setShowSuccessModal(false)}
                    className="cyber-modal"
                >
                    <IonContent className="ion-padding">
                        <div className="cyber-card modal-card success-card">
                            <div className="title-container">
                                <h1 className="cyber-title">
                                    <span className="cyber-text" data-text="REGISTRATION SUCCESSFUL">REGISTRATION SUCCESSFUL</span>
                                </h1>
                                <IonIcon icon={skull} className="title-icon" />
                            </div>
                            
                            <div className="cyber-divider"></div>
                            
                            <IonText className="cyber-success-text">
                                <p>YOUR ACCOUNT HAS BEEN CREATED</p>
                                <p>PLEASE CHECK YOUR AUTHENTICATION ID FOR VERIFICATION</p>
                            </IonText>
                            
                            <div className="success-particles">
                                {[...Array(20)].map((_, i) => (
                                    <div key={i} className="success-particle" style={{
                                        '--delay': `${Math.random() * 2}s`,
                                        '--x': `${Math.random() * 100}%`,
                                        '--y': `${Math.random() * 100}%`,
                                        '--size': `${Math.random() * 10 + 5}px`,
                                        '--color': `hsl(${Math.random() * 60 + 180}, 100%, 50%)`
                                    } as React.CSSProperties}></div>
                                ))}
                            </div>
                            
                            <IonButton 
                                className="cyber-button"
                                routerLink="/it35-lab" 
                                routerDirection="back"
                            >
                                <span className="button-text">PROCEED TO AUTHENTICATION</span>
                                <span className="button-glow"></span>
                            </IonButton>
                        </div>
                    </IonContent>
                </IonModal>

                <AlertBox message={alertMessage} isOpen={showAlert} onClose={() => setShowAlert(false)} />

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
                    .register-page {
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
                        background: var(--dark-bg);
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
                    
                    /* Form Container */
                    .form-container {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        padding: 20px;
                    }
                    
                    .form-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr; /* Two columns */
                        gap: 20px;
                        margin-bottom: 20px;
                        
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
                        position: relative;
                        overflow: hidden;
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
                    
                    /* Modal card */
                    .modal-card {
                        max-width: 500px;
                        margin: 20px auto;
                    }
                    
                    .success-card {
                        text-align: center;
                        padding: 40px 30px;
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
                        font-size: 1.5rem;
                        text-transform: uppercase;
                        letter-spacing: 3px;
                        position: relative;
                        text-shadow: var(--text-glow);
                    }
                    
                    .title-icon {
                        color: var(--neon-pink);
                        font-size: 1.8rem;
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
                    
                    .cyber-subtitle {
                        color: rgba(255, 255, 255, 0.7);
                        text-align: center;
                        margin-bottom: 30px;
                        font-size: 0.9rem;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                        text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
                    }
                    
                    /* Form grid */
                    .form-grid {
                        display: grid;
                        gap: 20px;
                        margin-bottom: 20px;
                    }
                    
                    /* Input field styles */
                    .input-field {
                        position: relative;
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
                        margin-top: 20px;
                        margin-bottom: 20px;
                        overflow: hidden;
                        border: 1px solid var(--neon-blue);
                        background: rgba(5, 217, 232, 0.1) !important;
                        transition: all 0.3s ease;
                    }
                    
                    .cyber-button-outline {
                        --background: transparent;
                        --border-radius: 0;
                        --box-shadow: none;
                        position: relative;
                        height: 50px;
                        margin: 20px 10px;
                        overflow: hidden;
                        border: 1px solid var(--neon-pink);
                        background: rgba(255, 42, 109, 0.1) !important;
                        transition: all 0.3s ease;
                    }
                    
                    .cyber-button:hover {
                        background: rgba(5, 217, 232, 0.2) !important;
                        box-shadow: 0 0 15px var(--neon-blue);
                    }
                    
                    .cyber-button-outline:hover {
                        background: rgba(255, 42, 109, 0.2) !important;
                        box-shadow: 0 0 15px var(--neon-pink);
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
                        margin-top: 10px;
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
                    
                    /* Modal styles */
                    .cyber-modal {
                        --background: rgba(0, 0, 0, 0.7);
                        --backdrop-opacity: 0.8;
                    }
                    
                    .verification-card {
                        background: rgba(13, 2, 33, 0.9);
                        border: 1px solid var(--neon-blue);
                        box-shadow: 0 0 20px rgba(5, 217, 232, 0.3);
                        color: white;
                    }
                    
                    .cyber-divider {
                        height: 2px;
                        background: linear-gradient(90deg, transparent, var(--neon-blue), transparent);
                        margin: 20px 0;
                    }
                    
                    .cyber-detail-label {
                        color: var(--neon-blue);
                        font-size: 0.8rem;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin-top: 15px;
                    }
                    
                    .cyber-detail-value {
                        color: white;
                        font-size: 1rem;
                        margin-bottom: 10px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    
                    .modal-buttons {
                        display: flex;
                        justify-content: center;
                        gap: 20px;
                        margin-top: 30px;
                    }
                    
                    /* Success styles */
                    .cyber-success-text {
                        color: rgba(255, 255, 255, 0.8);
                        text-align: center;
                        margin: 30px 0;
                        line-height: 1.6;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        font-size: 0.9rem;
                    }
                    
                    .success-particles {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        pointer-events: none;
                        z-index: -1;
                    }
                    
                    .success-particle {
                        position: absolute;
                        width: var(--size);
                        height: var(--size);
                        background: var(--color);
                        border-radius: 50%;
                        opacity: 0;
                        animation: successParticle 2s ease-in-out infinite;
                        animation-delay: var(--delay);
                        filter: blur(2px);
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
                    
                    @keyframes particle {
                        0% { transform: translate(0, 0); opacity: 0; }
                        10% { opacity: 1; }
                        100% { transform: translate(var(--x), var(--y)); opacity: 0; }
                    }
                    
                    @keyframes successParticle {
                        0% { transform: translate(0, 0) scale(0); opacity: 0; }
                        50% { opacity: 1; transform: translate(var(--x), var(--y)) scale(1); }
                        100% { transform: translate(calc(var(--x) * 1.5), calc(var(--y) * 1.5)) scale(0); opacity: 0; }
                    }
                `}</style>
            </IonContent>
        </IonPage>
    );
};

export default Register;