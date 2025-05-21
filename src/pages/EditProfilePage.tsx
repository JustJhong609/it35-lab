import React, { useState, useRef, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonAlert,
  IonHeader,
  IonBackButton,
  IonButtons,
  IonText,
  IonCol,
  IonGrid,
  IonRow,
  IonInputPasswordToggle,
  IonImg,
  IonAvatar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonToolbar, // Added IonToolbar for consistent header
  IonTitle // Added IonTitle for header title
} from "@ionic/react";
import supabase from "../utils/supabaseClient";
import { useHistory } from "react-router-dom";

const EditAccount: React.FC = () => {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const history = useHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSessionAndData = async () => {
      const { data: session, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session || !session.session) {
        setAlertMessage("You must be logged in to access this page.");
        setShowAlert(true);
        history.push("/it35-lab/login");
        return;
      }

      const { data: user, error: userError } = await supabase
        .from("users")
        .select("user_firstname, user_lastname, user_avatar_url, user_email, username")
        .eq("user_email", session.session.user.email)
        .single();

      if (userError || !user) {
        setAlertMessage("User data not found.");
        setShowAlert(true);
        return;
      }

      setFirstName(user.user_firstname || "");
      setLastName(user.user_lastname || "");
      setAvatarPreview(user.user_avatar_url);
      setEmail(user.user_email);
      setUsername(user.username || "");
    };

    fetchSessionAndData();
  }, [history]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (password !== confirmPassword) {
      setAlertMessage("Passwords don't match.");
      setShowAlert(true);
      return;
    }

    const { data: session, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session || !session.session) {
      setAlertMessage("Error fetching session or no session available.");
      setShowAlert(true);
      return;
    }

    const user = session.session.user;

    if (!user.email) {
      setAlertMessage("Error: User email is missing.");
      setShowAlert(true);
      return;
    }

    // Only attempt to sign in with password if currentPassword is provided and new password fields are being used
    if (currentPassword && (password || confirmPassword)) {
      const { error: passwordError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (passwordError) {
        setAlertMessage("Incorrect current password.");
        setShowAlert(true);
        return;
      }
    }


    let avatarUrl = avatarPreview;

    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("user-avatars")
        .upload(filePath, avatarFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        setAlertMessage(`Avatar upload failed: ${uploadError.message}`);
        setShowAlert(true);
        return;
      }

      const { data } = supabase.storage
        .from("user-avatars")
        .getPublicUrl(filePath);
      avatarUrl = data.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({
        user_firstname: firstName,
        user_lastname: lastName,
        user_avatar_url: avatarUrl,
        username: username,
      })
      .eq("user_email", user.email);

    if (updateError) {
      setAlertMessage(updateError.message);
      setShowAlert(true);
      return;
    }

    if (password) {
      const { error: passwordUpdateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (passwordUpdateError) {
        setAlertMessage(passwordUpdateError.message);
        setShowAlert(true);
        return;
      }
    }

    setAlertMessage("Account updated successfully!");
    setShowAlert(true);
    history.push("/it35-lab/app");
  };

  return (
    <IonPage>
      <IonHeader style={{ background: '#222222' }}> {/* Dark header background */}
        <IonToolbar style={{ '--background': '#222222', '--color': '#d7dadc' }}> {/* Toolbar matches header */}
          <IonButtons slot="start">
            <IonBackButton defaultHref="/it35-lab/app" style={{ '--color': '#d7dadc' }}/> {/* Light back button */}
          </IonButtons>
          <IonTitle style={{ color: '#d7dadc', fontWeight: 'bold' }}>Edit Profile</IonTitle> {/* Light title */}
        </IonToolbar>
      </IonHeader>
      <IonContent
        style={{
          "--background": "#1a1a1b", // Dark background for the page content
        }}
      >
        <IonCard style={{
          margin: '20px',
          borderRadius: '8px',
          background: '#2b2b2c', // Darker card background
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)', // Darker shadow
          border: '1px solid #3d3d3e' // Subtle border
        }}>
          <IonCardHeader style={{ borderBottom: '1px solid #3d3d3e' }}>
            <IonCardTitle style={{
              color: '#d7dadc', // Light text for dark mode
              fontWeight: '600',
              fontSize: '1.2rem',
              paddingBottom: '10px'
            }}>Modify Your Account</IonCardTitle>
          </IonCardHeader>

          <IonCardContent style={{ padding: '20px' }}>
            {/* Avatar Upload Section */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              {avatarPreview && (
                <IonAvatar
                  style={{
                    width: "100px",
                    height: "100px",
                    margin: "0 auto 15px",
                    border: '2px solid #818384' // Subtle border for avatar
                  }}
                >
                  <IonImg src={avatarPreview} style={{ objectFit: "cover" }} />
                </IonAvatar>
              )}

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleAvatarChange}
              />

              <IonButton
                onClick={() => fileInputRef.current?.click()}
                style={{
                  '--background': '#0079d3', // Reddit blue
                  '--background-hover': '#0085e6',
                  '--background-activated': '#006ac2',
                  '--border-radius': '4px',
                  '--box-shadow': 'none',
                  '--color': 'white',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  height: '40px'
                }}
              >
                Upload Avatar
              </IonButton>
            </div>

            {/* User Information Section */}
            <IonInput
              label="Username"
              labelPlacement="floating"
              fill="outline"
              style={{
                '--background': '#343536', // Darker input background
                '--border-radius': '4px',
                '--padding-start': '12px',
                '--color': '#d7dadc', // Light text
                '--placeholder-color': '#818384',
                '--border-color': '#4a4a4b', // Input border color
                marginBottom: '16px'
              }}
              value={username}
              onIonChange={(e) => setUsername(e.detail.value!)}
            />

            <IonGrid style={{ padding: '0' }}>
              <IonRow>
                <IonCol>
                  <IonInput
                    label="First Name"
                    labelPlacement="floating"
                    fill="outline"
                    style={{
                      '--background': '#343536',
                      '--border-radius': '4px',
                      '--padding-start': '12px',
                      '--color': '#d7dadc',
                      '--placeholder-color': '#818384',
                      '--border-color': '#4a4a4b',
                      marginBottom: '16px'
                    }}
                    value={firstName}
                    onIonChange={(e) => setFirstName(e.detail.value!)}
                  />
                </IonCol>
                <IonCol>
                  <IonInput
                    label="Last Name"
                    labelPlacement="floating"
                    fill="outline"
                    style={{
                      '--background': '#343536',
                      '--border-radius': '4px',
                      '--padding-start': '12px',
                      '--color': '#d7dadc',
                      '--placeholder-color': '#818384',
                      '--border-color': '#4a4a4b',
                      marginBottom: '16px'
                    }}
                    value={lastName}
                    onIonChange={(e) => setLastName(e.detail.value!)}
                  />
                </IonCol>
              </IonRow>
            </IonGrid>

            {/* Password Change Section */}
            <IonText style={{ display: 'block', margin: '20px 0 10px', fontWeight: 'bold', color: '#d7dadc', fontSize: '1rem' }}>
              Change Password
            </IonText>

            <IonInput
              label="New Password"
              type="password"
              labelPlacement="floating"
              fill="outline"
              counter={true}
              maxlength={30}
              style={{
                '--background': '#343536',
                '--border-radius': '4px',
                '--padding-start': '12px',
                '--color': '#d7dadc',
                '--placeholder-color': '#818384',
                '--border-color': '#4a4a4b',
                marginBottom: '16px'
              }}
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
            >
              <IonInputPasswordToggle slot="end" style={{'--color': '#818384'}}/>
              <div slot="helper" style={{ color: password.length < 8 && password.length > 0 ? '#ff4500' : (password.length >= 8 ? '#46d160' : '#818384'), fontSize: '12px' }}>
                {password.length < 8 && password.length > 0 ? 'Password should be at least 8 characters' : (password.length >= 8 ? 'Strong password' : 'Enter new password')}
              </div>
            </IonInput>

            <IonInput
              label="Confirm Password"
              type="password"
              labelPlacement="floating"
              fill="outline"
              counter={true}
              maxlength={30}
              style={{
                '--background': '#343536',
                '--border-radius': '4px',
                '--padding-start': '12px',
                '--color': '#d7dadc',
                '--placeholder-color': '#818384',
                '--border-color': '#4a4a4b',
                marginBottom: '16px'
              }}
              value={confirmPassword}
              onIonChange={(e) => setConfirmPassword(e.detail.value!)}
            >
              <IonInputPasswordToggle slot="end" style={{'--color': '#818384'}}/>
              <div slot="helper" style={{ color: confirmPassword.length > 0 && confirmPassword !== password ? '#ff4500' : (confirmPassword === password && confirmPassword.length > 0 ? '#46d160' : '#818384'), fontSize: '12px' }}>
                {confirmPassword.length > 0 && confirmPassword !== password ? 'Passwords do not match' : (confirmPassword === password && confirmPassword.length > 0 ? 'Passwords match' : 'Confirm new password')}
              </div>
            </IonInput>

            {/* Current Password Section */}
            <IonText style={{ display: 'block', margin: '20px 0 10px', fontWeight: 'bold', color: '#d7dadc', fontSize: '1rem' }}>
              Confirm Changes
            </IonText>

            <IonInput
              label="Current Password"
              type="password"
              labelPlacement="floating"
              fill="outline"
              counter={true}
              maxlength={30}
              style={{
                '--background': '#343536',
                '--border-radius': '4px',
                '--padding-start': '12px',
                '--color': '#d7dadc',
                '--placeholder-color': '#818384',
                '--border-color': '#4a4a4b',
                marginBottom: '24px'
              }}
              value={currentPassword}
              onIonChange={(e) => setCurrentPassword(e.detail.value!)}
            >
              <IonInputPasswordToggle slot="end" style={{'--color': '#818384'}}/>
              <div slot="helper" style={{ color: '#818384', fontSize: '12px' }}>
                Required to save changes
              </div>
            </IonInput>

            <IonButton
              expand="block"
              onClick={handleUpdate}
              style={{
                '--background': '#0079d3',
                '--background-hover': '#0085e6',
                '--background-activated': '#006ac2',
                '--border-radius': '4px',
                '--box-shadow': 'none',
                '--color': 'white',
                fontWeight: '600',
                height: '48px',
                fontSize: '1rem'
              }}
            >
              Update Account
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Update Status"
          message={alertMessage}
          buttons={["OK"]}
          style={{
            '--background': '#2b2b2c',
            '--backdrop-filter': 'blur(5px)',
            '--box-shadow': '0 4px 20px rgba(0, 0, 0, 0.4)',
            '--border-radius': '8px',
            '--header-color': '#d7dadc',
            '--message-color': '#d7dadc'
          }}
        />
      </IonContent>
    </IonPage>
  );
};

export default EditAccount;