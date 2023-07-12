import React, { useState, useContext } from 'react';
import './upload.css';
import { store } from '../../firebaseconfig';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { contractorContext } from '../../contexts/ContractorContext';

export default function Upload({ setImgUrl, imgUrl }) {
	const { updateTechObject, currentUserProfile } =
		useContext(contractorContext);
	const [progresspercent, setProgresspercent] = useState(0);
	const [file, setFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);

	const handleFileInputChange = () => {
		if (!file) return;
		if (file) {
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
		}
	};

	const onSubmit = (url) => {
		// e.preventDefault();
		const data = {
			id: currentUserProfile?.id,
			profileImg: url || currentUserProfile?.profileImg,
		};
		
		updateTechObject(data);
	};

	const handleSubmitFile = (e) => {
		e.preventDefault();
		
		if (!file) return;
		const storageRef = ref(store, `files/${uuidv4() + file.name}`);
		const uploadTask = uploadBytesResumable(storageRef, file);
		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				);
				setProgresspercent(progress);
			},
			(error) => {
				alert(error);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					setImgUrl(downloadURL);
					setPreviewUrl(null);
					onSubmit(downloadURL);
					setProgresspercent(0);
				});
			}
		);
	};
	return (
		<>
			<div
				className='flexCenter'
				style={{ flexDirection: 'column', gap: '7px' }}
			>
				{!previewUrl && !imgUrl && (
					<>
						<h3>Your Current Profile Image</h3>
						<img
							src={currentUserProfile?.profileImg}
							alt='Current Profile Image'
							height={200}
							width={200}
						/>
						<input type='file' onChange={(e) => setFile(e.target.files[0])} />
						{file ? (
							<button onClick={handleFileInputChange}>Preview</button>
						) : (
							''
						)}
					</>
				)}
				<div>
					{previewUrl && (
						<>
							<div
								className='flexCenter'
								style={{ flexDirection: 'column', gap: '7px' }}
							>
								<img src={previewUrl} alt={file.name} height={200} />
								<button
									onClick={() => {
										setPreviewUrl(null);
										setFile(null);
									}}
								>
									Cancel
								</button>
								<button onClick={handleSubmitFile}>Upload</button>
								{!imgUrl && (
									<div
										className='outerbar'
										style={{
											border: '2px solid white',
											background: 'white',
											width: '200px',
										}}
									>
										<div
											className='innerbar'
											style={{
												width: `${progresspercent}%`,
												background: 'red',
											}}
										>
											{progresspercent}%
										</div>
									</div>
								)}
							</div>
						</>
					)}
					{!previewUrl && imgUrl && (
						<>
							<h3>Your New Profile Image</h3>
							<div
								className='flexCenter'
								style={{ flexDirection: 'column', gap: '7px' }}
							>
								{imgUrl && (
									<img src={imgUrl} alt='uploaded file' height={200} />
								)}
								<button
									onClick={() => {
										setImgUrl(null);
										setPreviewUrl(null);
										window.location.reload();
									}}
								>
									Done
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</>
	);
}
