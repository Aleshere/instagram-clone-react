import React, { useState, useEffect } from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from './firebase';
import firebase from 'firebase'

function Post({ postId, username, user, caption, imageUrl }) {
    const [ comments, setComments ] = useState([]);
    const [ comment, setComment ] = useState('');

    useEffect(() => {
        let  unsubscribe;
        if(postId) {
            unsubscribe = db
                .collection('posts')
                .doc(postId)
                .collection('comments')
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()))
                })
        }

        return () => {
            unsubscribe();
        }
    }, [postId])

    const postComment = (event) => {
        event.preventDefault();

        db.collection('posts').doc(postId).collection('comments').add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('');
    }


    return (
        <div className='post' >
            {/* header > avatar + username */}
            <div className="post__header">
                <Avatar 
                    className='post__avatar'
                    alt='Aleshere'
                    src='none'
                />
                <h3>{username}</h3>
            </div>

            {/* Image */}
            <img className='post__image' src={imageUrl} alt="post-test"/>

            {/* username + caption */}
            <h4 className='post__text' ><strong>{username}</strong> {caption}</h4>

            <div className="post__comments">
                {comments.map((comment) => (
                    <h4 className='post__text' >
                        <strong className='mr-1'>{comment.username}</strong>{comment.text}
                    </h4>
                ))}
            </div>

            {user && (
                <form className='post__commentBox' >
                    <input
                        className='post__input'
                        type='text'
                        placeholder='Add a comment...'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                        className='post__button'
                        disabled={!comment}
                        type='submit'
                        onClick={postComment}
                    >
                        Post
                    </button>
                </form>
            )}    
        </div>
    )
}

export default Post
