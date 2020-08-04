import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './images/instagram.png'
import Post from './Post'
import { db, auth } from './firebase'
import { makeStyles, Button, Input } from '@material-ui/core';
import Modal from '@material-ui/core/Modal'
import ImageUpload from './ImageUpload'
import InstagramEmbed from 'react-instagram-embed'

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  
  const [posts, setPosts] = useState([]); 
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        // user has logged in. This survives REFRESH events!!
        console.log(authUser);
        setUser(authUser);
      } else {
        // user has logged out
        setUser(null);
      }
    })

    return () => {
      // perform some cleanup actions
      unsubscribe();
    }
  }, [user, username]);

  // useEffect --> runs a piece of code based on a specific condition
  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      // every time a change happens in the db, this code fires
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));

    setOpenSignIn(false);
  }

  return (
    <div className='app'>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper} >
          <form className='app__signup' >
            <center>
              <img
                className='app__headerImage'
                src={logo}
                alt="logo"
              />
            </center>

            <Input 
              placeholder='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input 
              placeholder='email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input 
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signUp} >Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper} >
          <form className='app__signup' >
            <center>
              <img
                className='app__headerImage'
                src={logo}
                alt="logo"
              />
            </center>

            <Input 
              placeholder='email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input 
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signIn} >Sign In</Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img
          className='app__headerImage'
          src={logo}
          alt="logo"
          />

      {user ? (
        <Button onClick={() => auth.signOut()} >Logout</Button>
      ) : (
        <div className="app__loginContainer">
          <Button onClick={() => setOpenSignIn(true)} >Sign In</Button>
          <Button onClick={() => setOpen(true)} >Sign Up</Button>
        </div>
      )}

      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({id, post}) => (
              <Post
                key={id}
                user={user}
                postId={id}
                username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}
              />
            ))
          }
        </div>

        <div className="app__postsRight">
          <InstagramEmbed
            className='app__instagramEmbed'
            url='https://www.instagram.com/p/CA2UkWogh7H/'
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
            />
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <div className='app__upload' >
          <h3>Login to upload a post</h3>
        </div>
      )}

    </div>
  );
}

export default App;
