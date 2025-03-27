import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
} from "@ionic/react";
const Feed: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Feed</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Jhong Title</IonCardTitle>
            <IonCardSubtitle>Owahaha</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>Ako nagud ni naunsa diay mo .</IonCardContent>
          <IonButton
            fill="clear"
            href="https://www.facebook.com/justjhongexd"
            target="_blank"
          >
            Facebook
          </IonButton>

          <IonButton
            fill="clear"
            href="https://github.com/JustJhong609"
            target="_blank"
          >
            Github
          </IonButton>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Jhong Title 2</IonCardTitle>
            <IonCardSubtitle>Card Subtitle</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            Here's a small text description for the card content. Nothing more,
            nothing less.
          </IonCardContent>

          <IonButton fill="clear">Action 1</IonButton>
          <IonButton fill="clear">Action 2</IonButton>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Ayaw kol</IonCardTitle>
            <IonCardSubtitle>Card Subtitle</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            Here's a small text description for the card content. Nothing more,
            nothing less.
          </IonCardContent>

          <IonButton fill="clear">Action 1</IonButton>
          <IonButton fill="clear">Action 2</IonButton>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Feed;
