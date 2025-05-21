import { useState, useEffect } from 'react';
import { IonApp, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonInput, IonLabel, IonModal, IonFooter, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonAlert, IonText, IonAvatar, IonCol, IonGrid, IonRow, IonIcon, IonPopover } from '@ionic/react';
import { User } from '@supabase/supabase-js';
import supabase from '../utils/supabaseClient';
import { trash } from 'ionicons/icons';
import { arrowUpCircle, arrowDownCircle, chatbubbleOutline, shareSocialOutline, imageOutline, videocamOutline, ellipsisHorizontal } from 'ionicons/icons'; // Added new icons

interface Post {
  post_id: string;
  user_id: number;
  username: string;
  avatar_url: string;
  post_content: string;
  post_created_at: string;
  post_updated_at: string;
}

const FeedContainer = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postContent, setPostContent] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [popoverState, setPopoverState] = useState<{ open: boolean; event: Event | null; postId: string | null }>({ open: false, event: null, postId: null });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user?.email?.endsWith('@nbsc.edu.ph')) {
        setUser(authData.user);
        const { data: userData, error } = await supabase
          .from('users')
          .select('user_id, username, user_avatar_url')
          .eq('user_email', authData.user.email)
          .single();
        if (!error && userData) {
          setUser({ ...authData.user, id: userData.user_id });
          setUsername(userData.username);
        }
      }
    };
    const fetchPosts = async () => {
      const { data, error } = await supabase.from('posts').select('*').order('post_created_at', { ascending: false });
      if (!error) setPosts(data as Post[]);
    };
    fetchUser();
    fetchPosts();
  }, []);

  const createPost = async () => {
    if (!postContent || !user || !username) return;

    // Fetch avatar URL
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('user_avatar_url')
      .eq('user_id', user.id)
      .single();

    if (userError) {
      console.error('Error fetching user avatar:', userError);
      return;
    }

    const avatarUrl = userData?.user_avatar_url || 'https://ionicframework.com/docs/img/demos/avatar.svg';

    // Insert post with avatar URL
    const { data, error } = await supabase
      .from('posts')
      .insert([
        { post_content: postContent, user_id: user.id, username, avatar_url: avatarUrl }
      ])
      .select('*');

    if (!error && data) {
      setPosts([data[0] as Post, ...posts]);
    }

    setPostContent('');
  };

  const deletePost = async (post_id: string) => {
    await supabase.from('posts').delete().match({ post_id });
    setPosts(posts.filter(post => post.post_id !== post_id));
  };

  const startEditingPost = (post: Post) => {
    setEditingPost(post);
    setPostContent(post.post_content);
    setIsModalOpen(true);
  };

  const savePost = async () => {
    if (!postContent || !editingPost) return;
    const { data, error } = await supabase
      .from('posts')
      .update({ post_content: postContent })
      .match({ post_id: editingPost.post_id })
      .select('*');
    if (!error && data) {
      const updatedPost = data[0] as Post;
      setPosts(posts.map(post => (post.post_id === updatedPost.post_id ? updatedPost : post)));
      setPostContent('');
      setEditingPost(null);
      setIsModalOpen(false);
      setIsAlertOpen(true);
    }
  };

  return (
    <>
      <IonContent style={{
        '--background': '#1a1a1b', // Dark background for Reddit theme
      }}>
        {user ? (
          <>
            <IonCard style={{
              margin: '16px',
              borderRadius: '8px',
              background: '#2b2b2c', // Darker card background
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)', // Darker shadow
              border: '1px solid #3d3d3e' // Subtle border
            }}>
              <IonCardHeader style={{
                borderBottom: '1px solid #3d3d3e',
                paddingBottom: '12px'
              }}>
                <IonCardTitle style={{
                  color: '#d7dadc', // Light text for dark mode
                  fontWeight: '600',
                  fontSize: '1.2rem'
                }}>Create Post</IonCardTitle>
              </IonCardHeader>

              <IonCardContent style={{ paddingTop: '16px' }}>
                <IonInput
                  style={{
                    '--background': '#343536', // Darker input background
                    '--border-radius': '4px',
                    '--padding-start': '12px',
                    '--placeholder-color': '#818384', // Lighter placeholder
                    '--color': '#d7dadc' // Light text
                  }}
                  value={postContent}
                  onIonChange={e => setPostContent(e.detail.value!)}
                  placeholder="What's on your mind?"
                />
              </IonCardContent>

              {/* Icon options row */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                padding: '8px 16px',
                borderTop: '1px solid #3d3d3e'
              }}>
                <IonButton
                  fill="clear"
                  style={{
                    '--padding-start': '4px',
                    '--padding-end': '4px',
                    '--color': '#818384' // Lighter icon color
                  }}
                >
                  <IonIcon icon={imageOutline} style={{ fontSize: '1.2rem', marginRight: '4px', color: '#0079d3' }} /> {/* Reddit blue */}
                  <span style={{ fontSize: '0.8rem' }}>Photo</span>
                </IonButton>

                <IonButton
                  fill="clear"
                  style={{
                    '--padding-start': '4px',
                    '--padding-end': '4px',
                    '--color': '#818384'
                  }}
                >
                  <IonIcon icon={videocamOutline} style={{ fontSize: '1.2rem', marginRight: '4px', color: '#46d160' }} /> {/* Reddit green */}
                  <span style={{ fontSize: '0.8rem' }}>Video</span>
                </IonButton>

                <IonButton
                  fill="clear"
                  style={{
                    '--padding-start': '4px',
                    '--padding-end': '4px',
                    '--color': '#818384'
                  }}
                >
                  <IonIcon icon={chatbubbleOutline} style={{ fontSize: '1.2rem', marginRight: '4px', color: '#ff4500' }} /> {/* Reddit orange */}
                  <span style={{ fontSize: '0.8rem' }}>Discussion</span>
                </IonButton>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '0.5rem',
                borderTop: '1px solid #3d3d3e'
              }}>
                <IonButton
                  onClick={createPost}
                  style={{
                    '--background': '#0079d3', // Reddit blue
                    '--background-hover': '#0085e6',
                    '--background-activated': '#006ac2',
                    '--border-radius': '4px',
                    '--box-shadow': 'none',
                    '--color': 'white',
                    margin: '8px',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}
                >
                  Post
                </IonButton>
              </div>
            </IonCard>

            {posts.map(post => (
              <IonCard key={post.post_id} style={{
                margin: '16px',
                borderRadius: '8px',
                background: '#2b2b2c',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)',
                border: '1px solid #3d3d3e',
                display: 'flex' // For side-by-side upvote/downvote
              }}>
                {/* Upvote/Downvote Section */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px 8px',
                  background: '#212122', // Slightly darker background for vote column
                  borderRight: '1px solid #3d3d3e',
                  borderRadius: '8px 0 0 8px'
                }}>
                  <IonIcon icon={arrowUpCircle} style={{ fontSize: '1.8rem', color: '#818384', marginBottom: '4px' }} />
                  <IonText style={{ color: '#d7dadc', fontSize: '0.9rem', fontWeight: 'bold' }}>
                    <p>123</p> {/* Placeholder for vote count */}
                  </IonText>
                  <IonIcon icon={arrowDownCircle} style={{ fontSize: '1.8rem', color: '#818384', marginTop: '4px' }} />
                </div>

                <div style={{ flexGrow: 1 }}> {/* Main content area */}
                  <IonCardHeader style={{
                    borderBottom: '1px solid #3d3d3e',
                    padding: '12px 16px'
                  }}>
                    <IonRow className="ion-align-items-center">
                      <IonCol size="auto">
                        <IonAvatar style={{
                          width: '36px',
                          height: '36px',
                          border: '2px solid #818384'
                        }}>
                          <img alt={post.username} src={post.avatar_url} />
                        </IonAvatar>
                      </IonCol>
                      <IonCol>
                        <IonCardTitle style={{
                          marginTop: '0px',
                          color: '#d7dadc',
                          fontWeight: '500',
                          fontSize: '1rem'
                        }}>{post.username}</IonCardTitle>
                        <IonCardSubtitle style={{
                          color: '#818384',
                          fontSize: '0.75rem'
                        }}>{new Date(post.post_created_at).toLocaleString()}</IonCardSubtitle>
                      </IonCol>
                      <IonCol size="auto">
                        <IonButton
                          fill="clear"
                          style={{
                            '--padding-start': '0',
                            '--padding-end': '0',
                            '--ripple-color': 'transparent',
                            '--color': '#818384'
                          }}
                          onClick={(e) =>
                            setPopoverState({
                              open: true,
                              event: e.nativeEvent,
                              postId: post.post_id,
                            })
                          }
                        >
                          <IonIcon
                            icon={ellipsisHorizontal} // Replaced pencil icon with ellipsis for more options
                            style={{
                              color: '#818384',
                              fontSize: '1.2rem'
                            }}
                          />
                        </IonButton>
                      </IonCol>
                    </IonRow>
                  </IonCardHeader>

                  <IonCardContent style={{ padding: '16px' }}>
                    <IonText style={{
                      color: '#d7dadc',
                      lineHeight: '1.5'
                    }}>
                      <p style={{
                        margin: 0,
                        fontSize: '0.95rem',
                        whiteSpace: 'pre-wrap'
                      }}>{post.post_content}</p>
                    </IonText>
                  </IonCardContent>
                  {/* Action buttons */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    padding: '8px 16px',
                    borderTop: '1px solid #3d3d3e'
                  }}>
                    <IonButton
                      fill="clear"
                      style={{
                        '--padding-start': '4px',
                        '--padding-end': '4px',
                        '--color': '#818384'
                      }}
                    >
                      <IonIcon icon={chatbubbleOutline} style={{ fontSize: '1.2rem', marginRight: '4px' }} />
                      <span style={{ fontSize: '0.85rem' }}>Comments</span>
                    </IonButton>

                    <IonButton
                      fill="clear"
                      style={{
                        '--padding-start': '4px',
                        '--padding-end': '4px',
                        '--color': '#818384'
                      }}
                    >
                      <IonIcon icon={shareSocialOutline} style={{ fontSize: '1.2rem', marginRight: '4px' }} />
                      <span style={{ fontSize: '0.85rem' }}>Share</span>
                    </IonButton>
                  </div>
                </div>

                <IonPopover
                  isOpen={popoverState.open && popoverState.postId === post.post_id}
                  event={popoverState.event}
                  onDidDismiss={() =>
                    setPopoverState({ open: false, event: null, postId: null })
                  }
                  style={{
                    '--background': '#343536',
                    '--box-shadow': '0 4px 20px rgba(0, 0, 0, 0.4)',
                    '--border-radius': '4px',
                  }}
                >
                  <IonButton
                    fill="clear"
                    style={{
                      '--color': '#d7dadc',
                      '--background-hover': '#4a4a4b',
                      width: '100%',
                      justifyContent: 'flex-start',
                      paddingLeft: '16px',
                      fontSize: '0.9rem'
                    }}
                    onClick={() => {
                      startEditingPost(post);
                      setPopoverState({ open: false, event: null, postId: null });
                    }}
                  >
                    Edit
                  </IonButton>
                  <IonButton
                    fill="clear"
                    color="danger"
                    style={{
                      '--color': '#ff4500', // Reddit orange for danger
                      '--background-hover': '#4a4a4b',
                      width: '100%',
                      justifyContent: 'flex-start',
                      paddingLeft: '16px',
                      fontSize: '0.9rem'
                    }}
                    onClick={() => {
                      deletePost(post.post_id);
                      setPopoverState({ open: false, event: null, postId: null });
                    }}
                  >
                    Delete
                  </IonButton>
                </IonPopover>
              </IonCard>
            ))}
          </>
        ) : (
          <IonLabel style={{
            display: 'block',
            textAlign: 'center',
            marginTop: '50%',
            color: '#d7dadc', // Light text for loading in dark mode
            fontSize: '1.2rem'
          }}>Loading...</IonLabel>
        )}
      </IonContent>

      <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
        <IonHeader style={{
          background: '#1a1a1b' // Dark modal header
        }}>
          <IonToolbar>
            <IonTitle style={{
              color: '#d7dadc',
              fontWeight: '600',
              textAlign: 'center'
            }}>Edit Post</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent style={{
          '--background': '#2b2b2c', // Dark modal content
          padding: '16px'
        }}>
          <IonInput
            style={{
              '--background': '#343536',
              '--border-radius': '4px',
              '--padding-start': '12px',
              '--placeholder-color': '#818384',
              '--color': '#d7dadc',
              marginBottom: '16px'
            }}
            value={postContent}
            onIonChange={e => setPostContent(e.detail.value!)}
            placeholder="Edit your post..."
          />
        </IonContent>
        <IonFooter style={{
          background: '#2b2b2c',
          padding: '8px 16px',
          borderTop: '1px solid #3d3d3e'
        }}>
          <IonButton
            onClick={savePost}
            style={{
              '--background': '#0079d3',
              '--background-hover': '#0085e6',
              '--background-activated': '#006ac2',
              '--border-radius': '4px',
              '--box-shadow': 'none',
              '--color': 'white',
              marginRight: '8px',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}
          >
            Save
          </IonButton>
          <IonButton
            onClick={() => setIsModalOpen(false)}
            style={{
              '--background': '#343536',
              '--background-hover': '#4a4a4b',
              '--color': '#d7dadc',
              '--border-radius': '4px',
              '--box-shadow': 'none',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}
          >
            Cancel
          </IonButton>
        </IonFooter>
      </IonModal>

      <IonAlert
        isOpen={isAlertOpen}
        onDidDismiss={() => setIsAlertOpen(false)}
        header="Success"
        message="Post updated successfully!"
        buttons={['OK']}
        style={{
          '--background': '#2b2b2c',
          '--backdrop-filter': 'blur(5px)',
          '--box-shadow': '0 4px 20px rgba(0, 0, 0, 0.4)',
          '--border-radius': '8px',
          '--header-color': '#d7dadc',
          '--message-color': '#d7dadc'
        }}
      />
    </>
  );
};

export default FeedContainer;