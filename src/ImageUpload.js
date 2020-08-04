import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import firebase from 'firebase'
import { storage, db } from './firebase'
import './ImageUpload.css'

function ImageUpload({ username }) {
    const [ image, setImage ] = useState(null);
    const [ progress, setProgress ] = useState(0);
    const [ caption, setCaption ] = useState('');

    const handleChange = (e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
    };

    const handleUpload = () => {
        // this is for firebase: take the upload file name, and store it
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // progress bar function.. (firebase giving snapshots of upload status)
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                // error function
                console.log(error);
            },
            () => {
                // complete function
                storage.ref('images')
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    // post the image inside the db
                    db.collection('posts').add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username
                    });

                    setProgress(0);
                    setCaption('');
                    setImage(null);
                })
            }
        )
    }

    return (
        <div className='imageUpload' >
            
            <progress  className='imageUpload__progress' value={progress} max='100' />
            <input type="text" placeholder='Enter a caption...' onChange={event => setCaption(event.target.value)} />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload} >
                Upload
            </Button>

        </div>
    )
}

export default ImageUpload
