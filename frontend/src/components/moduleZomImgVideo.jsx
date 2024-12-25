import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useUser } from '../service/UserContext';

const ModuleZomImgVideo = () => {
    const { showZom, setShowZom } = useUser() // Get values from context
    const { file, show } = showZom; // Destructure showZom object

    const handleCloseModal = () => {
        setShowZom({ ...showZom, show: false }); // Close the modal
    };

    return (
        <Modal
            open={show}
            onClose={handleCloseModal}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
        >
            <Box sx={{ position: 'relative', backgroundColor: 'black', padding: 0.4, borderRadius: 2 }}>
                <IconButton
                    onClick={handleCloseModal}
                    sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        backgroundColor: 'rgba(255, 255, 255, 0.4)',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                    }}
                >
                    <CloseIcon color="error" />
                </IconButton>
                {file && (
                    file.endsWith(".mp4") ? (
                        <video
                            controls
                            className="w-full h-full object-contain rounded"
                            style={{
                                maxWidth: '90vw',
                                maxHeight: '90vh',
                            }}
                        >
                            <source src={file} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <img
                            className=""
                            src={file}
                            alt="Modal Preview"
                            style={{
                                maxWidth: '90vw',
                                maxHeight: '90vh',
                                borderRadius: '8px',
                            }}
                        />
                    )
                )}
            </Box>
        </Modal>
    );
};

export default ModuleZomImgVideo;
