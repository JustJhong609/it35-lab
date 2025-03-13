import { 
  IonButton,
  IonContent, 
  IonHeader, 
  IonInput, 
  IonInputPasswordToggle, 
  IonItem, 
  IonList, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonLabel,
  IonText,
  IonAlert,
  useIonRouter
} from '@ionic/react';
import { useState } from 'react';

const Register: React.FC = () => {
const navigation = useIonRouter(); // Ionic Router for navigation

// State to manage form inputs
const [username, setUsername] = useState('');
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');

// State for error messages
const [error, setError] = useState('');

// State for success alert
const [showSuccessAlert, setShowSuccessAlert] = useState(false);

// Function to handle form submission
const handleRegister = () => {
  if (!username || !firstName || !lastName || !email || !password || !confirmPassword) {
    setError('All fields are required.');
    return;
  }

  if (password !== confirmPassword) {
    setError('Passwords do not match.');
    return;
  }

  setError(''); // Clear errors if validation passes

  // Show success alert
  setShowSuccessAlert(true);
};

// Function to handle success alert dismissal and redirect to home page
const handleSuccessDismiss = () => {
  setShowSuccessAlert(false);
  navigation.push('/it35-lab', 'root'); // Redirect to home page
};

return (
  <IonPage>
    {/* Header Section */}
    <IonHeader>
      <IonToolbar>
        <IonTitle>Register</IonTitle>
      </IonToolbar>
    </IonHeader>

    {/* Registration Form */}
    <IonContent className="ion-padding">
      <IonList>
        <IonItem>
          <IonLabel position="stacked">Username</IonLabel>
          <IonInput 
            type="text" 
            placeholder="Enter your username" 
            value={username} 
            onIonInput={(e) => setUsername(e.detail.value!)}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">First Name</IonLabel>
          <IonInput 
            type="text" 
            placeholder="Enter your first name" 
            value={firstName} 
            onIonInput={(e) => setFirstName(e.detail.value!)}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Last Name</IonLabel>
          <IonInput 
            type="text" 
            placeholder="Enter your last name" 
            value={lastName} 
            onIonInput={(e) => setLastName(e.detail.value!)}
          />
        </IonItem>

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
            type="password" 
            placeholder="Enter your password" 
            value={password} 
            onIonInput={(e) => setPassword(e.detail.value!)}
          >
            <IonInputPasswordToggle slot="end" />
          </IonInput>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Confirm Password</IonLabel>
          <IonInput 
            type="password" 
            placeholder="Confirm your password" 
            value={confirmPassword} 
            onIonInput={(e) => setConfirmPassword(e.detail.value!)}
          >
            <IonInputPasswordToggle slot="end" />
          </IonInput>
        </IonItem>
      </IonList>

      {/* Error Message Display */}
      {error && <IonText color="danger"><p>{error}</p></IonText>}

      {/* Register and Login Buttons */}
      <IonButton expand="full" fill="solid" onClick={handleRegister}>
        Register
      </IonButton>
      <IonButton expand="full" fill="outline" onClick={() => navigation.push('/login', 'back')}>
        Login
      </IonButton>

      {/* Success Alert */}
      <IonAlert
        isOpen={showSuccessAlert}
        onDidDismiss={handleSuccessDismiss}
        header="Success"
        message="Registration Complete!"
        buttons={["OK"]}
      />
    </IonContent>
  </IonPage>
);
};

export default Register;
